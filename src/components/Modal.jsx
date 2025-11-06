import { useEffect } from 'react'
import { X } from 'lucide-react'
import GlassCard from './ui/GlassCard'

const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop with glassmorphism */}
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`
          relative w-full ${sizeClasses[size]} 
          animate-scale-in transform transition-all duration-300
        `}>
          <GlassCard 
            className="p-0 overflow-hidden"
            opacity={0.95}
            blur={25}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-ideark-light-gray/30">
                {title && (
                  <h3 className="text-xl font-semibold text-ideark-dark-gray">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="
                      p-2 rounded-soft text-ideark-medium-gray 
                      hover:text-ideark-dark-gray hover:bg-ideark-light-gray/30
                      transition-all duration-200 transform hover:scale-110
                    "
                    aria-label="Cerrar modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default Modal