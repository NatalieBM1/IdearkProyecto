import { TrendingUp, TrendingDown } from 'lucide-react'

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'primary',
  gradient,
  onClick 
}) => {
  const colorClasses = {
    primary: 'from-ideark-slate-600 to-ideark-slate-700',
    secondary: 'from-ideark-slate-500 to-ideark-slate-600',
    success: 'from-ideark-primary to-ideark-secondary',
    warning: 'from-ideark-warning to-amber-400',
    error: 'from-ideark-error to-red-400',
    info: 'from-ideark-info to-blue-400'
  }

  const isPositiveChange = change && change.startsWith('+')
  const isNegativeChange = change && change.startsWith('-')

  return (
    <div 
      className={`stat-card group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Icon Container */}
      <div className="flex items-center justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-soft flex items-center justify-center
          bg-gradient-to-br ${gradient || colorClasses[color]}
          shadow-soft group-hover:shadow-floating transition-all duration-300
        `}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        
        {/* Change Indicator */}
        {change && (
          <div className={`
            flex items-center space-x-1 px-2 py-1 rounded-pill text-xs font-medium
            ${isPositiveChange ? 'bg-ideark-success text-white' : ''}
            ${isNegativeChange ? 'bg-ideark-error text-white' : ''}
            ${!isPositiveChange && !isNegativeChange ? 'bg-ideark-medium-gray text-ideark-dark-gray' : ''}
          `}>
            {isPositiveChange && <TrendingUp className="w-3 h-3" />}
            {isNegativeChange && <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-2xl font-medium text-ideark-dark-gray group-hover:text-ideark-darker-gray transition-colors duration-300">
          {value}
        </h3>
        <p className="text-sm text-ideark-dark-gray font-light">
          {title}
        </p>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-modern pointer-events-none" />
    </div>
  )
}

export default StatCard