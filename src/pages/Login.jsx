import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, Building2, ArrowRight, Loader2 } from 'lucide-react'

const schema = yup.object({
  correo: yup.string().email('Email inválido').required('El email es requerido'),
  clave: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida')
})

const Login = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await signIn(data.correo, data.clave)
      if (error) throw error
      
      toast.success('Inicio de sesión exitoso')
      navigate('/')
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-ideark-primary/10 via-transparent to-ideark-secondary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,175,80,0.1),transparent_50%)]"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-ideark-primary to-ideark-secondary rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-light text-white mb-2 tracking-wide">IDEARK</h1>
          <h2 className="text-lg text-slate-300 mb-2 font-light">Dashboard Administrativo</h2>
          <p className="text-slate-400 text-sm">Gestión inteligente de propiedades</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="mb-6">
            <h3 className="text-2xl font-light text-slate-800 text-center">Iniciar Sesión</h3>
            <p className="text-slate-600 text-center text-sm mt-2">Accede a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('correo')}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-ideark-primary/20 focus:border-ideark-primary transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
              {errors.correo && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.correo.message}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('clave')}
                  type="password"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-ideark-primary/20 focus:border-ideark-primary transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              {errors.clave && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.clave.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-ideark-primary to-ideark-secondary hover:from-ideark-secondary hover:to-ideark-primary text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-ideark-primary hover:text-ideark-secondary font-medium transition-colors duration-200 hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            © 2024 Ideark. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login