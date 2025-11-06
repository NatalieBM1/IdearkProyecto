import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'

const schema = yup.object({
  correo: yup.string().email('Email inválido').required('El email es requerido'),
  clave: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('clave')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  nombre: yup.string().required('El nombre completo es requerido'),
  rol: yup.string().required('El rol es requerido')
})

const Register = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await signUp(data.nombre, data.correo, data.clave, data.rol)
      
      if (error) throw error
      
      toast.success('Registro exitoso. Ya puedes iniciar sesión.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ideark-primary to-ideark-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">IDEARK</h1>
          <h2 className="text-xl text-blue-100 mb-8">Dashboard Administrativo</h2>
          <p className="text-blue-200">Crea tu cuenta para acceder al sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                {...register('nombre')}
                type="text"
                className="input-field"
                placeholder="Tu nombre completo"
                disabled={loading}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('correo')}
                type="email"
                className="input-field"
                placeholder="tu@email.com"
                disabled={loading}
              />
              {errors.correo && (
                <p className="text-red-500 text-sm mt-1">{errors.correo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select {...register('rol')} className="input-field" disabled={loading}>
                <option value="">Seleccionar rol</option>
                <option value="admin">Administrador</option>
                <option value="auxiliar">Auxiliar Administrativo</option>
              </select>
              {errors.rol && (
                <p className="text-red-500 text-sm mt-1">{errors.rol.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                {...register('clave')}
                type="password"
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.clave && (
                <p className="text-red-500 text-sm mt-1">{errors.clave.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registrando...
                </div>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-ideark-primary hover:text-ideark-secondary font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-blue-200">
            © 2024 Ideark. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register