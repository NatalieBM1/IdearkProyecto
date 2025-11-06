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
      // Buscar usuario por correo y contraseña (sin hash por ahora para simplificar)
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', correo)
        .eq('clave', clave)
        .single()

      if (error || !usuarios) {
        return { data: null, error: { message: 'Credenciales incorrectas' } }
      }

      // Crear objeto de usuario sin la contraseña
      const userData = {
        id: usuarios.id,
        nombre: usuarios.nombre,
        correo: usuarios.correo,
        rol: usuarios.rol,
        created_at: usuarios.created_at
      }

      setUser(userData)
      localStorage.setItem('ideark_user', JSON.stringify(userData))

      return { data: userData, error: null }
    } catch (error) {
      return { data: null, error: { message: 'Error al iniciar sesión' } }
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

      // Crear nuevo usuario (sin hash por ahora)
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nombre,
          correo,
          clave, // Sin hash por simplicidad
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