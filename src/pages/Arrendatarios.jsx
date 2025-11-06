import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import GlassCard from '../components/ui/GlassCard'
import { arrendatariosService } from '../services/arrendatariosService'
import { propiedadesService } from '../services/propiedadesService'
import { exportTenantsToPdf } from '../services/exportPdfService'
import { useAuth } from '../hooks/useAuth'
import { 
  Plus, 
  FileDown, 
  Search, 
  X, 
  Edit, 
  Trash2, 
  Users,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock
} from 'lucide-react'

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  telefono: yup.string().required('El teléfono es requerido'),
  correo: yup.string().email('Email inválido').required('El email es requerido'),
  propiedad_id: yup.string().required('La propiedad es requerida'),
  fecha_inicio: yup.date().required('La fecha de inicio es requerida'),
  fecha_finalizacion: yup.date().required('La fecha de finalización es requerida')
    .min(yup.ref('fecha_inicio'), 'La fecha de finalización debe ser posterior a la fecha de inicio')
})

const Arrendatarios = () => {
  const { user } = useAuth()
  const [arrendatarios, setArrendatarios] = useState([])
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingArrendatario, setEditingArrendatario] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [arrendatariosResult, propiedadesResult] = await Promise.all([
        arrendatariosService.getAll(),
        propiedadesService.getAll()
      ])
      
      if (arrendatariosResult.error) throw arrendatariosResult.error
      if (propiedadesResult.error) throw propiedadesResult.error
      
      setArrendatarios(arrendatariosResult.data || [])
      setPropiedades(propiedadesResult.data || [])
    } catch (error) {
      toast.error('Error al cargar datos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      // Transformar datos para la nueva estructura
      const arrendatarioData = {
        nombre: data.nombre,
        contacto: {
          telefono: data.telefono,
          correo: data.correo
        },
        propiedad_id: data.propiedad_id,
        fecha_inicio: data.fecha_inicio,
        fecha_finalizacion: data.fecha_finalizacion
      }

      if (editingArrendatario) {
        const { error } = await arrendatariosService.update(editingArrendatario.id, arrendatarioData)
        if (error) throw error
        toast.success('Arrendatario actualizado exitosamente')
      } else {
        const { error } = await arrendatariosService.create(arrendatarioData)
        if (error) throw error
        toast.success('Arrendatario creado exitosamente')
      }
      
      setModalOpen(false)
      reset()
      setEditingArrendatario(null)
      loadData()
    } catch (error) {
      toast.error('Error al guardar arrendatario')
      console.error(error)
    }
  }

  const handleEdit = (arrendatario) => {
    setEditingArrendatario(arrendatario)
    setValue('nombre', arrendatario.nombre)
    setValue('correo', arrendatario.contacto?.correo || '')
    setValue('telefono', arrendatario.contacto?.telefono || '')
    setValue('propiedad_id', arrendatario.propiedad_id)
    setValue('fecha_inicio', arrendatario.fecha_inicio?.split('T')[0] || '')
    setValue('fecha_finalizacion', arrendatario.fecha_finalizacion?.split('T')[0] || '')
    setModalOpen(true)
  }

  const handleDelete = async (arrendatario) => {
    if (window.confirm('¿Estás seguro de eliminar este arrendatario?')) {
      try {
        const { error } = await arrendatariosService.delete(arrendatario.id)
        if (error) throw error
        toast.success('Arrendatario eliminado exitosamente')
        loadData()
      } catch (error) {
        toast.error('Error al eliminar arrendatario')
        console.error(error)
      }
    }
  }

  const handleExportPdf = () => {
    exportTenantsToPdf(arrendatarios, user)
    toast.success('PDF exportado exitosamente')
  }

  const openCreateModal = () => {
    setEditingArrendatario(null)
    reset()
    setModalOpen(true)
  }

  // Calcular días restantes de contrato
  const calcularDiasRestantes = (fechaFinalizacion) => {
    if (!fechaFinalizacion) return null
    
    const hoy = new Date()
    const fechaFin = new Date(fechaFinalizacion)
    const diferencia = fechaFin.getTime() - hoy.getTime()
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24))
    
    return diasRestantes
  }

  const formatearTiempoRestante = (dias) => {
    if (dias === null) return 'Sin fecha'
    if (dias < 0) return 'Vencido'
    if (dias === 0) return 'Vence hoy'
    if (dias <= 30) return `${dias} días`
    if (dias <= 365) {
      const meses = Math.floor(dias / 30)
      const diasRestantes = dias % 30
      return `${meses}m ${diasRestantes}d`
    }
    const años = Math.floor(dias / 365)
    const diasRestantes = dias % 365
    const meses = Math.floor(diasRestantes / 30)
    return `${años}a ${meses}m`
  }

  // Filtrar arrendatarios por búsqueda
  const filteredArrendatarios = arrendatarios.filter(arrendatario => {
    const searchLower = searchTerm.toLowerCase()
    return (
      arrendatario.nombre.toLowerCase().includes(searchLower) ||
      arrendatario.contacto?.correo?.toLowerCase().includes(searchLower) ||
      arrendatario.contacto?.telefono?.includes(searchTerm) ||
      arrendatario.propiedades?.nombre?.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { 
      key: 'contacto', 
      label: 'Email',
      render: (value) => value?.correo || 'Sin email'
    },
    { 
      key: 'contacto', 
      label: 'Teléfono',
      render: (value) => value?.telefono || 'Sin teléfono'
    },
    { 
      key: 'propiedades', 
      label: 'Propiedad',
      render: (value) => value?.nombre || 'Sin asignar'
    },
    { 
      key: 'fecha_inicio', 
      label: 'Inicio Contrato',
      render: (value) => value ? new Date(value).toLocaleDateString('es-ES') : 'Sin fecha'
    },
    { 
      key: 'fecha_finalizacion', 
      label: 'Fin Contrato',
      render: (value) => value ? new Date(value).toLocaleDateString('es-ES') : 'Sin fecha'
    },
    { 
      key: 'fecha_finalizacion', 
      label: 'Tiempo Restante',
      render: (value, row) => {
        const dias = calcularDiasRestantes(value)
        const tiempo = formatearTiempoRestante(dias)
        
        let colorClass = 'bg-green-100 text-green-800'
        if (dias !== null) {
          if (dias < 0) colorClass = 'bg-red-100 text-red-800'
          else if (dias <= 30) colorClass = 'bg-yellow-100 text-yellow-800'
          else if (dias <= 90) colorClass = 'bg-orange-100 text-orange-800'
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {tiempo}
          </span>
        )
      }
    }
  ]

  const actions = [
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEdit,
      variant: 'primary',
      title: 'Editar arrendatario'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: 'danger',
      title: 'Eliminar arrendatario'
    }
  ]

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-ideark-light-gray/30 to-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light text-ideark-dark-gray mb-2">Arrendatarios</h1>
          <p className="text-ideark-dark-gray font-light">Gestión de arrendatarios del sistema</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={arrendatarios.length === 0}
            className="flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Exportar PDF</span>
          </Button>
          <Button
            variant="primary"
            onClick={openCreateModal}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Arrendatario</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ideark-medium-gray" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono o propiedad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-ideark-light-gray rounded-modern focus:outline-none focus:ring-4 focus:ring-ideark-primary/20 focus:border-ideark-primary transition-all duration-300 bg-white/80"
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              onClick={() => setSearchTerm('')}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Limpiar</span>
            </Button>
          )}
        </div>
        {searchTerm && (
          <div className="mt-4 text-sm text-ideark-dark-gray font-light">
            Mostrando {filteredArrendatarios.length} de {arrendatarios.length} arrendatarios
          </div>
        )}
      </GlassCard>

      <Table
        columns={columns}
        data={filteredArrendatarios}
        actions={actions}
        loading={loading}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingArrendatario ? 'Editar Arrendatario' : 'Nuevo Arrendatario'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              {...register('nombre')}
              className="input-field"
              placeholder="Nombre completo del arrendatario"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('correo')}
              type="email"
              className="input-field"
              placeholder="correo@ejemplo.com"
            />
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">{errors.correo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              {...register('telefono')}
              className="input-field"
              placeholder="Número de teléfono"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propiedad
            </label>
            <select {...register('propiedad_id')} className="input-field">
              <option value="">Seleccionar propiedad</option>
              {propiedades.map((propiedad) => (
                <option key={propiedad.id} value={propiedad.id}>
                  {propiedad.nombre} - {propiedad.direccion}
                </option>
              ))}
            </select>
            {errors.propiedad_id && (
              <p className="text-red-500 text-sm mt-1">{errors.propiedad_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio del Contrato
              </label>
              <input
                {...register('fecha_inicio')}
                type="date"
                className="input-field"
              />
              {errors.fecha_inicio && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Finalización del Contrato
              </label>
              <input
                {...register('fecha_finalizacion')}
                type="date"
                className="input-field"
              />
              {errors.fecha_finalizacion && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_finalizacion.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editingArrendatario ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Arrendatarios