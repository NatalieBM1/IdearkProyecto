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
import { propiedadesService } from '../services/propiedadesService'
import { exportPropertiesToPdf } from '../services/exportPdfService'
import { useAuth } from '../hooks/useAuth'
import { 
  Plus, 
  FileDown, 
  Search, 
  X, 
  Edit, 
  Trash2, 
  Building2,
  MapPin,
  DollarSign,
  Activity
} from 'lucide-react'

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  direccion: yup.string().required('La dirección es requerida'),
  valor: yup.number().positive('El valor debe ser positivo').required('El valor es requerido'),
  estado: yup.string().required('El estado es requerido')
})

const Propiedades = () => {
  const { user } = useAuth()
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPropiedad, setEditingPropiedad] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    loadPropiedades()
  }, [])

  const loadPropiedades = async () => {
    try {
      const { data, error } = await propiedadesService.getAll()
      if (error) throw error
      setPropiedades(data || [])
    } catch (error) {
      toast.error('Error al cargar propiedades')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingPropiedad) {
        const { error } = await propiedadesService.update(editingPropiedad.id, data)
        if (error) throw error
        toast.success('Propiedad actualizada exitosamente')
      } else {
        const { error } = await propiedadesService.create(data)
        if (error) throw error
        toast.success('Propiedad creada exitosamente')
      }
      
      setModalOpen(false)
      reset()
      setEditingPropiedad(null)
      loadPropiedades()
    } catch (error) {
      toast.error('Error al guardar propiedad')
      console.error(error)
    }
  }

  const handleEdit = (propiedad) => {
    setEditingPropiedad(propiedad)
    setValue('nombre', propiedad.nombre)
    setValue('direccion', propiedad.direccion)
    setValue('valor', propiedad.valor)
    setValue('estado', propiedad.estado)
    setModalOpen(true)
  }

  const handleDelete = async (propiedad) => {
    if (window.confirm('¿Estás seguro de eliminar esta propiedad?')) {
      try {
        const { error } = await propiedadesService.delete(propiedad.id)
        if (error) throw error
        toast.success('Propiedad eliminada exitosamente')
        loadPropiedades()
      } catch (error) {
        toast.error('Error al eliminar propiedad')
        console.error(error)
      }
    }
  }

  const handleExportPdf = () => {
    exportPropertiesToPdf(propiedades, user)
    toast.success('PDF exportado exitosamente')
  }

  const openCreateModal = () => {
    setEditingPropiedad(null)
    reset()
    setModalOpen(true)
  }

  // Filtrar propiedades por búsqueda
  const filteredPropiedades = propiedades.filter(propiedad => {
    const searchLower = searchTerm.toLowerCase()
    return (
      propiedad.nombre.toLowerCase().includes(searchLower) ||
      propiedad.direccion.toLowerCase().includes(searchLower) ||
      propiedad.estado.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    { 
      key: 'nombre', 
      label: 'Nombre',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ideark-slate-600 to-ideark-slate-700 rounded-soft flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-ideark-dark-gray">{value}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'direccion', 
      label: 'Dirección',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-ideark-slate-400" />
          <span className="text-ideark-dark-gray">{value}</span>
        </div>
      )
    },
    { 
      key: 'valor', 
      label: 'Valor',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-ideark-slate-500" />
          <span className="font-medium text-ideark-dark-gray">
            ${value?.toLocaleString('es-ES') || 0}
          </span>
        </div>
      )
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value) => {
        const statusConfig = {
          disponible: { 
            bg: 'bg-gradient-to-r from-ideark-success to-ideark-secondary', 
            text: 'text-white',
            icon: Activity
          },
          ocupado: { 
            bg: 'bg-gradient-to-r from-ideark-primary to-ideark-secondary', 
            text: 'text-white',
            icon: Activity
          },
          mantenimiento: { 
            bg: 'bg-gradient-to-r from-ideark-warning to-orange-400', 
            text: 'text-white',
            icon: Activity
          }
        }
        
        const config = statusConfig[value] || statusConfig.disponible
        const IconComponent = config.icon
        
        return (
          <span className={`
            inline-flex items-center space-x-1 px-3 py-1 rounded-pill text-xs font-medium
            ${config.bg} ${config.text}
          `}>
            <IconComponent className="w-3 h-3" />
            <span className="capitalize">{value}</span>
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
      title: 'Editar propiedad'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: 'danger',
      title: 'Eliminar propiedad'
    }
  ]

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-ideark-light-gray/30 to-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light text-ideark-dark-gray mb-2">Propiedades</h1>
          <p className="text-ideark-dark-gray font-light">Gestión de propiedades del sistema</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={propiedades.length === 0}
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
            <span>Nueva Propiedad</span>
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
              placeholder="Buscar por nombre, dirección o estado..."
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
            Mostrando {filteredPropiedades.length} de {propiedades.length} propiedades
          </div>
        )}
      </GlassCard>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredPropiedades}
        actions={actions}
        loading={loading}
        emptyMessage="No hay propiedades registradas"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPropiedad ? 'Editar Propiedad' : 'Nueva Propiedad'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre de la Propiedad"
              placeholder="Ej: Casa Principal"
              icon={Building2}
              {...register('nombre')}
              error={errors.nombre?.message}
            />

            <Input
              label="Dirección"
              placeholder="Dirección completa"
              icon={MapPin}
              {...register('direccion')}
              error={errors.direccion?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Valor"
              type="number"
              placeholder="Valor de la propiedad"
              icon={DollarSign}
              {...register('valor')}
              error={errors.valor?.message}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ideark-dark-gray">
                Estado
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ideark-medium-gray" />
                <select 
                  {...register('estado')} 
                  className="w-full pl-12 pr-4 py-3 border-2 border-ideark-light-gray rounded-modern focus:outline-none focus:ring-4 focus:ring-ideark-primary/20 focus:border-ideark-primary transition-all duration-300 bg-white"
                >
                  <option value="">Seleccionar estado</option>
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
              {errors.estado && (
                <p className="text-red-500 text-sm">{errors.estado.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-ideark-light-gray">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editingPropiedad ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Propiedades