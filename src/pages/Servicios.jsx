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
import { serviciosService } from '../services/serviciosService'
import { propiedadesService } from '../services/propiedadesService'
import { exportServicesToPdf } from '../services/exportPdfService'
import { useAuth } from '../hooks/useAuth'
import { 
  Plus, 
  FileDown, 
  Search, 
  X, 
  Edit, 
  Trash2, 
  Calculator,
  Zap,
  Building2,
  DollarSign,
  Calendar,
  Users,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

const schema = yup.object({
  tipo: yup.string().required('El tipo de servicio es requerido'),
  propiedad_id: yup.string().required('La propiedad es requerida'),
  valor_total: yup.number().positive('El valor debe ser positivo').required('El valor es requerido'),
  fecha_pago: yup.date().required('La fecha de pago es requerida')
})

const Servicios = () => {
  const { user } = useAuth()
  const [servicios, setServicios] = useState([])
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [divisionModalOpen, setDivisionModalOpen] = useState(false)
  const [editingServicio, setEditingServicio] = useState(null)
  const [serviceDivision, setServiceDivision] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('')
  const [manualDivision, setManualDivision] = useState({
    valorServicio: '',
    tipoServicio: '',
    propiedadId: '',
    propiedadNombre: '',
    arrendatarios: []
  })

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [serviciosResult, propiedadesResult] = await Promise.all([
        serviciosService.getAll(),
        propiedadesService.getAll()
      ])
      
      if (serviciosResult.error) throw serviciosResult.error
      if (propiedadesResult.error) throw propiedadesResult.error
      
      setServicios(serviciosResult.data || [])
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
      const servicioData = {
        tipo: data.tipo,
        valor_total: data.valor_total,
        fecha_pago: data.fecha_pago,
        propiedad_id: data.propiedad_id,
        creado_por: user.id
      }

      if (editingServicio) {
        const { error } = await serviciosService.update(editingServicio.id, servicioData)
        if (error) throw error
        toast.success('Servicio actualizado exitosamente')
      } else {
        const { error } = await serviciosService.create(servicioData)
        if (error) throw error
        toast.success('Servicio creado exitosamente')
      }
      
      setModalOpen(false)
      reset()
      setEditingServicio(null)
      loadData()
    } catch (error) {
      toast.error('Error al guardar servicio')
      console.error(error)
    }
  }

  const handleEdit = (servicio) => {
    setEditingServicio(servicio)
    setValue('tipo', servicio.tipo)
    setValue('propiedad_id', servicio.propiedad_id)
    setValue('valor_total', servicio.valor_total)
    setValue('fecha_pago', servicio.fecha_pago)
    setModalOpen(true)
  }

  const handleDelete = async (servicio) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        const { error } = await serviciosService.delete(servicio.id)
        if (error) throw error
        toast.success('Servicio eliminado exitosamente')
        loadData()
      } catch (error) {
        toast.error('Error al eliminar servicio')
        console.error(error)
      }
    }
  }

  const handleCalculateDivision = async (servicio) => {
    // Inicializar con datos del servicio seleccionado
    setManualDivision({
      valorServicio: servicio.valor_total.toString(),
      tipoServicio: servicio.tipo,
      propiedadId: servicio.propiedad_id,
      propiedadNombre: servicio.propiedades?.nombre || 'Propiedad'
    })
    setServiceDivision([])
    setDivisionModalOpen(true)
    
    // Cargar arrendatarios de la propiedad automáticamente
    await loadArrendatariosByProperty(servicio.propiedad_id)
  }

  const loadArrendatariosByProperty = async (propiedadId) => {
    try {
      const { data, error } = await serviciosService.getArrendatariosByProperty(propiedadId)
      if (error) throw error
      
      setManualDivision(prev => ({
        ...prev,
        arrendatarios: data || []
      }))
    } catch (error) {
      console.error('Error cargando arrendatarios:', error)
      toast.error('Error al cargar arrendatarios de la propiedad')
    }
  }

  const calculateDivisionWithArrendatarios = () => {
    const { valorServicio, tipoServicio, arrendatarios } = manualDivision
    
    if (!valorServicio || !tipoServicio) {
      toast.error('Por favor completa el valor del servicio')
      return
    }

    if (!arrendatarios || arrendatarios.length === 0) {
      toast.error('No hay arrendatarios registrados en esta propiedad')
      return
    }

    const valorTotal = parseFloat(valorServicio)
    if (valorTotal <= 0) {
      toast.error('El valor debe ser mayor a cero')
      return
    }

    const valorPorArrendatario = Math.round(valorTotal / arrendatarios.length)
    
    const division = arrendatarios.map((arrendatario, index) => ({
      arrendatario_id: arrendatario.id,
      arrendatario_nombre: arrendatario.nombre,
      valor_asignado: valorPorArrendatario,
      tipo_servicio: tipoServicio,
      telefono: arrendatario.contacto?.telefono || 'Sin teléfono',
      email: arrendatario.contacto?.correo || 'Sin email',
      numero: index + 1
    }))

    setServiceDivision(division)
  }

  const resetDivision = () => {
    setManualDivision({
      valorServicio: '',
      tipoServicio: '',
      propiedadId: '',
      propiedadNombre: '',
      arrendatarios: []
    })
    setServiceDivision([])
  }

  const handleExportPdf = () => {
    exportServicesToPdf(servicios, user)
    toast.success('PDF exportado exitosamente')
  }

  const openCreateModal = () => {
    setEditingServicio(null)
    reset()
    setModalOpen(true)
  }

  // Filtrar servicios por búsqueda y propiedad
  const filteredServicios = servicios.filter(servicio => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      servicio.tipo.toLowerCase().includes(searchLower) ||
      servicio.propiedades?.nombre?.toLowerCase().includes(searchLower) ||
      servicio.propiedades?.direccion?.toLowerCase().includes(searchLower)
    )
    
    const matchesProperty = selectedProperty === '' || servicio.propiedad_id === selectedProperty
    
    return matchesSearch && matchesProperty
  })

  const columns = [
    { 
      key: 'tipo', 
      label: 'Tipo de Servicio',
      render: (value) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ideark-primary to-ideark-secondary rounded-soft flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-ideark-dark-gray capitalize">{value}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'propiedades', 
      label: 'Propiedad',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-ideark-medium-gray" />
          <span className="text-ideark-dark-gray">{value?.nombre || 'Sin asignar'}</span>
        </div>
      )
    },
    { 
      key: 'valor_total', 
      label: 'Valor Total',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-ideark-primary" />
          <span className="font-medium text-ideark-dark-gray">
            ${value?.toLocaleString('es-ES') || 0}
          </span>
        </div>
      )
    },
    { 
      key: 'fecha_pago', 
      label: 'Fecha de Pago',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-ideark-medium-gray" />
          <span className="text-ideark-dark-gray">
            {new Date(value).toLocaleDateString('es-ES')}
          </span>
        </div>
      )
    }
  ]

  const actions = [
    {
      icon: <Calculator className="w-4 h-4" />,
      onClick: handleCalculateDivision,
      variant: 'success',
      title: 'División de servicios'
    },
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEdit,
      variant: 'primary',
      title: 'Editar servicio'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: 'danger',
      title: 'Eliminar servicio'
    }
  ]

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-ideark-light-gray/30 to-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light text-ideark-dark-gray mb-2">Servicios</h1>
          <p className="text-ideark-dark-gray font-light">Gestión de servicios del sistema</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={servicios.length === 0}
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
            <span>Nuevo Servicio</span>
          </Button>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ideark-medium-gray" />
              <input
                type="text"
                placeholder="Buscar por tipo de servicio o propiedad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-ideark-light-gray rounded-modern focus:outline-none focus:ring-4 focus:ring-ideark-primary/20 focus:border-ideark-primary transition-all duration-300 bg-white/80"
              />
            </div>
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ideark-medium-gray" />
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-ideark-light-gray rounded-modern focus:outline-none focus:ring-4 focus:ring-ideark-primary/20 focus:border-ideark-primary transition-all duration-300 bg-white/80"
            >
              <option value="">Todas las propiedades</option>
              {propiedades.map((propiedad) => (
                <option key={propiedad.id} value={propiedad.id}>
                  {propiedad.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-ideark-dark-gray font-light">
            Mostrando {filteredServicios.length} de {servicios.length} servicios
          </div>
          {(searchTerm || selectedProperty) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('')
                setSelectedProperty('')
              }}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </Button>
          )}
        </div>
      </GlassCard>

      <Table
        columns={columns}
        data={filteredServicios}
        actions={actions}
        loading={loading}
      />

      {/* Modal para crear/editar servicio */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio
            </label>
            <select {...register('tipo')} className="input-field">
              <option value="">Seleccionar tipo</option>
              <option value="agua">Agua</option>
              <option value="energia">Energía</option>
              <option value="gas">Gas</option>
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Total
            </label>
            <input
              {...register('valor_total')}
              type="number"
              className="input-field"
              placeholder="Valor total del servicio"
            />
            {errors.valor_total && (
              <p className="text-red-500 text-sm mt-1">{errors.valor_total.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Pago
            </label>
            <input
              {...register('fecha_pago')}
              type="date"
              className="input-field"
            />
            {errors.fecha_pago && (
              <p className="text-red-500 text-sm mt-1">{errors.fecha_pago.message}</p>
            )}
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
              {editingServicio ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para división manual del servicio */}
      <Modal
        isOpen={divisionModalOpen}
        onClose={() => {
          setDivisionModalOpen(false)
          resetDivision()
        }}
        title="División Manual del Servicio"
        size="lg"
      >
        <div className="space-y-6">
          {/* Información de la propiedad y arrendatarios */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{manualDivision.propiedadNombre}</span>
            </h3>
            <div className="flex items-center space-x-4 text-sm text-blue-700">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{manualDivision.arrendatarios?.length || 0} arrendatarios registrados</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>Servicio: {manualDivision.tipoServicio}</span>
              </span>
            </div>
          </div>

          {/* Lista de arrendatarios */}
          {manualDivision.arrendatarios && manualDivision.arrendatarios.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Arrendatarios en esta propiedad:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {manualDivision.arrendatarios.map((arrendatario, index) => (
                  <div key={arrendatario.id} className="flex items-center space-x-2 text-sm">
                    <span className="w-6 h-6 bg-ideark-primary text-white rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="font-medium">{arrendatario.nombre}</span>
                    <span className="text-gray-500">({arrendatario.contacto?.telefono || 'Sin tel.'})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información del servicio */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">División del Servicio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Tipo de Servicio</p>
                <p className="font-medium text-lg">{manualDivision.tipoServicio}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="font-medium text-lg">${parseFloat(manualDivision.valorServicio || 0).toLocaleString('es-ES')}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Arrendatarios</p>
                <p className="font-medium text-lg">{manualDivision.arrendatarios?.length || 0} personas</p>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={calculateDivisionWithArrendatarios}
                className="btn-primary"
                disabled={!manualDivision.arrendatarios || manualDivision.arrendatarios.length === 0}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Ver División del Servicio
              </button>
            </div>

            {(!manualDivision.arrendatarios || manualDivision.arrendatarios.length === 0) && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No hay arrendatarios registrados en esta propiedad. 
                  <br />Agrega arrendatarios primero para poder dividir el servicio.
                </p>
              </div>
            )}
          </div>

          {/* Resultados de la división */}
          {serviceDivision && serviceDivision.length > 0 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Servicio de {manualDivision.tipoServicio.charAt(0).toUpperCase() + manualDivision.tipoServicio.slice(1)}
                    </h4>
                    <p className="text-sm text-blue-700">
{manualDivision.propiedadNombre} - {serviceDivision.length} arrendatario(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-700">Valor por persona:</p>
                    <p className="text-xl font-bold text-blue-900">
                      ${serviceDivision[0]?.valor_asignado.toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {serviceDivision.map((division, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-ideark-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{division.numero}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{division.arrendatario_nombre}</h4>
                          <div className="text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{division.telefono}</span>
                            </span>
                            <span className="ml-3 flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{division.email}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-ideark-primary">
                          ${division.valor_asignado.toLocaleString('es-ES')}
                        </p>
                        <p className="text-xs text-gray-500">Valor a pagar</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Total verificado:</span>
                  <span className="text-xl font-bold text-green-800">
                    ${serviceDivision.reduce((sum, div) => sum + div.valor_asignado, 0).toLocaleString('es-ES')}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
La suma coincide con el valor total del servicio
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <button
              onClick={resetDivision}
              className="btn-secondary"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar
            </button>
            <button
              onClick={() => {
                setDivisionModalOpen(false)
                resetDivision()
              }}
              className="btn-primary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Servicios