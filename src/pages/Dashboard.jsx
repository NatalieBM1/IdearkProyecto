import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propiedadesService } from '../services/propiedadesService'
import { arrendatariosService } from '../services/arrendatariosService'
import { serviciosService } from '../services/serviciosService'
import { notificacionesService } from '../services/notificacionesService'
import StatCard from '../components/ui/StatCard'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { 
  Building2, 
  Users, 
  Zap, 
  Bell, 
  RefreshCw,
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    propiedades: { total: 0, activas: 0 },
    arrendatarios: { total: 0, activos: 0 },
    servicios: { total: 0, valorTotal: 0 },
    notificaciones: { total: 0, noLeidas: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [propiedadesStats, arrendatariosStats, serviciosStats, notificacionesStats] = await Promise.all([
        propiedadesService.getStats(),
        arrendatariosService.getStats(),
        serviciosService.getStats(),
        notificacionesService.getStats()
      ])

      setStats({
        propiedades: propiedadesStats.data || { total: 0, activas: 0 },
        arrendatarios: arrendatariosStats.data || { total: 0, activos: 0 },
        servicios: serviciosStats.data || { total: 0, valorTotal: 0 },
        notificaciones: notificacionesStats.data || { total: 0, noLeidas: 0 }
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular cambios porcentuales (simulados para demo)
  const getChangePercentage = (current, type) => {
    const changes = {
      propiedades: '+12%',
      arrendatarios: '+8%',
      servicios: '-3%',
      notificaciones: '+15%'
    }
    return changes[type] || '+0%'
  }

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-ideark-dark-gray mb-2">Dashboard</h1>
            <p className="text-ideark-medium-gray">Resumen general del sistema</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-24 bg-ideark-light-gray rounded-modern"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-ideark-light-gray/30 to-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light text-ideark-dark-gray mb-2">Dashboard</h1>
          <p className="text-ideark-dark-gray font-light">Resumen general del sistema Ideark</p>
        </div>
        <Button
          variant="secondary"
          onClick={loadStats}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Propiedades"
          value={stats.propiedades.total}
          change={getChangePercentage(stats.propiedades.total, 'propiedades')}
          icon={Building2}
          color="primary"
          onClick={() => navigate('/propiedades')}
        />
        <StatCard
          title="Arrendatarios Activos"
          value={stats.arrendatarios.activos}
          change={getChangePercentage(stats.arrendatarios.activos, 'arrendatarios')}
          icon={Users}
          color="secondary"
          onClick={() => navigate('/arrendatarios')}
        />
        <StatCard
          title="Servicios Pendientes"
          value={stats.servicios.total}
          change={getChangePercentage(stats.servicios.total, 'servicios')}
          icon={Zap}
          color="warning"
          onClick={() => navigate('/servicios')}
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${stats.servicios.valorTotal?.toLocaleString('es-ES') || 0}`}
          change={getChangePercentage(stats.servicios.valorTotal, 'notificaciones')}
          icon={DollarSign}
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-ideark-dark-gray flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Resumen del Sistema</span>
              </h2>
              <div className="flex items-center space-x-2 text-sm text-ideark-dark-gray font-light">
                <Calendar className="w-4 h-4" />
                <span>Último mes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-ideark-primary/10 to-ideark-secondary/20 rounded-modern">
                  <div>
                    <p className="text-sm text-ideark-dark-gray font-light">Propiedades Activas</p>
                    <p className="text-2xl font-medium text-ideark-dark-gray">{stats.propiedades.activas}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-ideark-primary" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-ideark-secondary/10 to-ideark-primary/20 rounded-modern">
                  <div>
                    <p className="text-sm text-ideark-dark-gray font-light">Arrendatarios Activos</p>
                    <p className="text-2xl font-medium text-ideark-dark-gray">{stats.arrendatarios.activos}</p>
                  </div>
                  <Users className="w-8 h-8 text-ideark-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-ideark-warning/10 to-orange-100 rounded-modern">
                  <div>
                    <p className="text-sm text-ideark-dark-gray font-light">Valor Total Servicios</p>
                    <p className="text-2xl font-medium text-ideark-dark-gray">${stats.servicios.valorTotal?.toLocaleString('es-ES') || 0}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-ideark-warning" />
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-ideark-error/10 to-red-100 rounded-modern">
                  <div>
                    <p className="text-sm text-ideark-dark-gray font-light">Notificaciones Pendientes</p>
                    <p className="text-2xl font-medium text-ideark-error">{stats.notificaciones.noLeidas}</p>
                  </div>
                  <Bell className="w-8 h-8 text-ideark-error" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div>
          <GlassCard className="p-6">
            <h2 className="text-xl font-medium text-ideark-dark-gray mb-6 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Acciones Rápidas</span>
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start"
                onClick={() => navigate('/propiedades')}
              >
                <Building2 className="w-4 h-4 mr-3" />
                Nueva Propiedad
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/arrendatarios')}
              >
                <Users className="w-4 h-4 mr-3" />
                Nuevo Arrendatario
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/servicios')}
              >
                <Zap className="w-4 h-4 mr-3" />
                Nuevo Servicio
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/notificaciones')}
              >
                <Bell className="w-4 h-4 mr-3" />
                Ver Notificaciones
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default Dashboard