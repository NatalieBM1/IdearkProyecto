import { FileX, Loader2 } from 'lucide-react'
import GlassCard from './ui/GlassCard'

const Table = ({ columns, data, actions, loading = false, emptyMessage = "No hay datos para mostrar" }) => {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-ideark-light-gray rounded-modern w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-ideark-light-gray rounded-modern"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-ideark-light-gray rounded-full flex items-center justify-center">
            <FileX className="w-8 h-8 text-ideark-medium-gray" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-ideark-dark-gray mb-2">Sin datos</h3>
            <p className="text-ideark-dark-gray font-light">{emptyMessage}</p>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-ideark-light-gray to-ideark-medium-gray/30 border-b border-ideark-light-gray">
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-4 text-left text-sm font-medium text-ideark-dark-gray uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-left text-sm font-medium text-ideark-dark-gray uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-ideark-light-gray">
            {data.map((row, index) => (
              <tr 
                key={row.id || index} 
                className="hover:bg-ideark-light-gray/30 transition-colors duration-200 group"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className="px-6 py-4 text-sm text-ideark-dark-gray border-b border-ideark-light-gray/50"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-sm border-b border-ideark-light-gray/50">
                    <div className="flex space-x-2 opacity-100 transition-opacity duration-200">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(row)}
                          className={`
                            px-3 py-1.5 rounded-pill text-xs font-medium 
                            transition-all duration-200 transform hover:scale-105
                            flex items-center space-x-1
                            ${action.variant === 'danger' 
                              ? 'bg-gradient-to-r from-ideark-error to-red-400 text-white hover:shadow-soft' 
                              : action.variant === 'warning'
                              ? 'bg-gradient-to-r from-ideark-warning to-orange-400 text-white hover:shadow-soft'
                              : action.variant === 'success'
                              ? 'bg-gradient-to-r from-ideark-success to-ideark-secondary text-white hover:shadow-soft'
                              : 'bg-gradient-to-r from-ideark-primary to-ideark-secondary text-white hover:shadow-soft'
                            }
                          `}
                          title={action.title}
                        >
                          {action.icon && <span>{action.icon}</span>}
                          {action.label && <span>{action.label}</span>}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

export default Table