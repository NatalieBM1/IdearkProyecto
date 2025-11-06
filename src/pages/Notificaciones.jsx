import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import NotificationCard from '../components/NotificationCard'
import { notificacionesService } from '../services/notificacionesService'

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, urgent

  useEffect(() => {
    loadNotificaciones()
  }, [])

  const loadNotificaciones = async () => {
    try {
      const { data, error } = await notificacionesService.getAll()
      if (error) throw error
      setNotificaciones(data || [])
    } catch (error) {
      toast.error('Error al cargar notificaciones')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      const { error } = await notificacionesService.markAsRead(id)
      if (error) throw error
      
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      )
      toast.success('Notificación marcada como leída')
    } catch (error) {
      toast.error('Error al marcar notificación')
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta notificación?')) {
      try {
        const { error } = await notificacionesService.delete(id)
        if (error) throw error
        
        setNotificaciones(prev => prev.filter(notif => notif.id !== id))
        toast.success('Notificación eliminada')
      } catch (error) {
        toast.error('Error al eliminar notificación')
        console.error(error)
      }
    }
  }

  const handleGenerateNotifications = async () => {
    try {
      const { data, error } = await notificacionesService.generateServiceNotifications()
      if (error) throw error
      
      if (data && data.length > 0) {
        toast.success(`${data.length} notificación(es) generada(s)`)
        loadNotificaciones()
      } else {
        toast.info('No hay servicios próximos a vencer')
      }
    } catch (error) {
      toast.error('Error al generar notificaciones')
      console.error(error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notificaciones.filter(n => !n.leida)
    
    if (unreadNotifications.length === 0) {
      toast.info('No hay notificaciones sin leer')
      return
    }

    try {
      await Promise.all(
        unreadNotifications.map(notif => 
          notificacionesService.markAsRead(notif.id)
        )
      )
      
      setNotificaciones(prev => 
        prev.map(notif => ({ ...notif, leida: true }))
      )
      toast.success('Todas las notificaciones marcadas como leídas')
    } catch (error) {
      toast.error('Error al marcar notificaciones')
      console.error(error)
    }
  }

  const filteredNotifications = notificaciones.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.leida
      case 'urgent':
        return notif.tipo === 'urgente'
      default:
        return true
    }
  })

  const stats = {
    total: notificaciones.length,
    unread: notificaciones.filter(n => !n.leida).length,
    urgent: notificaciones.filter(n => n.tipo === 'urgente').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleGenerateNotifications}
            className="btn-secondary"
          >
            🔄 Generar Automáticas
          </button>
          <button
            onClick={handleMarkAllAsRead}
            className="btn-secondary"
            disabled={stats.unread === 0}
          >
            ✓ Marcar Todas como Leídas
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-sm font-medium text-gray-600">Total</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500 text-white mr-4">
              <span className="text-xl">📬</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.unread}</h3>
              <p className="text-sm font-medium text-gray-600">Sin Leer</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500 text-white mr-4">
              <span className="text-xl">🚨</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.urgent}</h3>
              <p className="text-sm font-medium text-gray-600">Urgentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            filter === 'all' 
              ? 'bg-ideark-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({stats.total})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            filter === 'unread' 
              ? 'bg-ideark-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sin Leer ({stats.unread})
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            filter === 'urgent' 
              ? 'bg-ideark-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Urgentes ({stats.urgent})
        </button>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No hay notificaciones' : 
               filter === 'unread' ? 'No hay notificaciones sin leer' :
               'No hay notificaciones urgentes'}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Las notificaciones aparecerán aquí cuando se generen automáticamente o manualmente.'
                : 'Cambia el filtro para ver otras notificaciones.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notificaciones