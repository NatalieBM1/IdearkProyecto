import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.extend(relativeTime)
dayjs.locale('es')

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const getTypeStyles = (tipo) => {
    switch (tipo) {
      case 'urgente':
        return 'border-l-red-500 bg-red-50'
      case 'advertencia':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'info':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'urgente':
        return '🚨'
      case 'advertencia':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${getTypeStyles(notification.tipo)} ${!notification.leida ? 'shadow-md' : 'opacity-75'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-xl">{getTypeIcon(notification.tipo)}</span>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">
              {notification.titulo}
              {!notification.leida && (
                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              {notification.mensaje}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {dayjs(notification.created_at).fromNow()}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          {!notification.leida && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-blue-600 hover:text-blue-800 text-sm"
              title="Marcar como leída"
            >
              ✓
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="text-red-600 hover:text-red-800 text-sm"
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard