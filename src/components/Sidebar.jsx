import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Zap, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

const Sidebar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await signOut()
      navigate('/login')
    }
  }

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/propiedades', label: 'Propiedades', icon: Building2 },
    { path: '/arrendatarios', label: 'Arrendatarios', icon: Users },
    { path: '/servicios', label: 'Servicios', icon: Zap },
    { path: '/notificaciones', label: 'Notificaciones', icon: Bell }
  ]

  return (
    <div className={`
      bg-gradient-to-b from-ideark-slate-800 via-ideark-slate-700 to-ideark-slate-900
      text-white min-h-screen flex flex-col transition-all duration-300 relative
      ${isCollapsed ? 'w-20' : 'w-72'}
      shadow-floating
    `}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full shadow-soft flex items-center justify-center text-ideark-slate-600 hover:scale-110 transition-transform duration-200"
      >
        {isCollapsed ? <Menu className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </button>

      {/* Logo Section */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-soft flex items-center justify-center backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="animate-slide-up">
              <h1 className="text-xl font-semibold">IDEARK</h1>
              <p className="text-xs text-white/70 font-light">Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-item group relative ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium animate-slide-up">{item.label}</span>
                  )}
                  
                  {/* Active Indicator */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/20">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-soft bg-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-ideark-primary to-ideark-secondary rounded-full flex items-center justify-center shadow-soft">
              <span className="text-sm font-semibold text-white">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.nombre}
              </p>
              <p className="text-xs text-white/70">
                {user?.rol === 'admin' ? 'Administrador' : 'Auxiliar'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-ideark-primary to-ideark-secondary rounded-full flex items-center justify-center shadow-soft">
              <span className="text-sm font-semibold text-white">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center space-x-3 p-3 rounded-soft
            text-white/80 hover:text-white hover:bg-red-500/20
            transition-all duration-300 group
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          {!isCollapsed && (
            <span className="font-medium">Cerrar Sesión</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar