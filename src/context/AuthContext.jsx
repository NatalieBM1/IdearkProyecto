import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('ideark_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (correo, clave) => {
    try {
      console.log('🔍 Intentando login con:', { correo, clave })
      
      // Test básico de conexión primero
      const { data: testData, error: testError } = await supabase
        .from('usuarios')
        .select('count')
        .limit(1)

      console.log('🔗 Test de conexión:', { testData, testError })

      if (testError) {
        console.error('❌ Error de conexión:', testError)
        return { 
          data: null, 
          error: { 
            message: `Error de conexión: ${testError.message}. Verifica que las tablas estén creadas en Supabase.` 
          } 
        }
      }

      // Buscar usuario específico
      const { data: usuarios, error: searchError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', correo)

      console.log('👤 Búsqueda de usuario:', { usuarios, searchError })

      if (searchError) {
        console.error('❌ Error en búsqueda:', searchError)
        return { 
          data: null, 
          error: { 
            message: `Error en búsqueda: ${searchError.message}` 
          } 
        }
      }

      if (!usuarios || usuarios.length === 0) {
        return { data: null, error: { message: 'Usuario no encontrado' } }
      }

      // Verificar contraseña
      const usuario = usuarios[0]
      console.log('🔐 Verificando contraseña para usuario:', usuario.nombre)
      
      if (usuario.clave !== clave) {
        return { data: null, error: { message: 'Contraseña incorrecta' } }
      }

      // Login exitoso
      const userData = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        created_at: usuario.created_at
      }

      console.log('✅ Login exitoso:', userData)
      setUser(userData)
      localStorage.setItem('ideark_user', JSON.stringify(userData))

      return { data: userData, error: null }
    } catch (error) {
      console.error('💥 Error crítico en signIn:', error)
      return { 
        data: null, 
        error: { 
          message: `Error crítico: ${error.message}. Verifica la configuración de Supabase.` 
        } 
      }
    }
  }

  const signUp = async (nombre, correo, clave, rol) => {
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('correo')
        .eq('correo', correo)
        .single()

      if (existingUser) {
        return { data: null, error: { message: 'El usuario ya existe' } }
      }

      // Crear nuevo usuario
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nombre,
          correo,
          clave,
          rol
        }])
        .select()
        .single()

      if (error) {
        return { data: null, error }
      }

      // Crear objeto de usuario sin la contraseña
      const userData = {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo,
        rol: data.rol,
        created_at: data.created_at
      }

      return { data: userData, error: null }
    } catch (error) {
      return { data: null, error: { message: 'Error al registrar usuario' } }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('ideark_user')
    return { error: null }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}