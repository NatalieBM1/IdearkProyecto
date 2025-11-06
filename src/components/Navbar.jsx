import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Bell, Search, Settings, ChevronDown, LogOut } from 'lucide-react'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notificationCount] = useState(3) // Placeholder for notification count

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await signOut()
      navigate('/login')
    }
  }

  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="navbar-glass px-6 py-4 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        {/* Left Section - Welcome */}
        <div className="flex items-center space-x-6">
          <div>
            <h2 className="text-xl font-medium text-ideark-dark-gray">
              Bienvenido, {user?.nombre?.split(' ')[0]}
            </h2>
            <p className="text-sm text-ideark-dark-gray font-light">
              {currentDate}
            </p>
          </div>
          
          
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-4">
          {/* Time Display */}
          <div className="hidden lg:block text-right">
            <p className="text-sm font-medium text-ideark-dark-gray">{currentTime}</p>
            <p className="text-xs text-ideark-dark-gray font-light">Hora actual</p>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 rounded-soft hover:bg-ideark-light-gray/50 transition-colors duration-200">
              <Bell className="w-5 h-5 text-ideark-dark-gray" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-ideark-error to-red-400 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 rounded-soft hover:bg-ideark-light-gray/50 transition-colors duration-200">
            <Settings className="w-5 h-5 text-ideark-dark-gray" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-soft hover:bg-ideark-light-gray/50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-ideark-slate-600 to-ideark-slate-700 rounded-full flex items-center justify-center shadow-soft">
                <span className="text-sm font-semibold text-white">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-ideark-dark-gray">
                  {user?.nombre}
                </p>
                <p className="text-xs text-ideark-dark-gray font-light">
                  {user?.rol === 'admin' ? 'Administrador' : 'Auxiliar'}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-ideark-dark-gray transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-modern shadow-floating border border-ideark-light-gray py-2 animate-scale-in">
                <div className="px-4 py-2 border-b border-ideark-light-gray">
                  <p className="text-sm font-medium text-ideark-dark-gray">{user?.nombre}</p>
                  <p className="text-xs text-ideark-dark-gray font-light">{user?.correo}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar