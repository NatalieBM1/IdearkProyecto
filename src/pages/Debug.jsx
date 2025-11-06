import React, { useState } from 'react'
import { supabase } from '../services/supabaseClient'

const Debug = () => {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      // Primero probar conexión básica
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables')
        .catch(() => ({ data: null, error: 'RPC not available' }))

      // Luego probar consulta a usuarios
      const { data: usuarios, error: usuariosError } = await supabase
        .from('usuarios')
        .select('id, nombre, correo, rol, created_at')
        .limit(10)

      setResult(JSON.stringify({ 
        connection: 'OK',
        tables: { data: tables, error: tablesError },
        usuarios: { data: usuarios, error: usuariosError },
        config: {
          url: import.meta.env.VITE_SUPABASE_URL,
          hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      }, null, 2))
    } catch (error) {
      setResult(JSON.stringify({ 
        connection: 'ERROR',
        error: error.message,
        stack: error.stack 
      }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', 'admin@ideark.com')
        .eq('clave', '123456')

      setResult(JSON.stringify({ data, error }, null, 2))
    } catch (error) {
      setResult(JSON.stringify({ error: error.message }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const insertTestUser = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nombre: 'Test User',
          correo: 'test@test.com',
          clave: '123456',
          rol: 'admin'
        }])
        .select()

      setResult(JSON.stringify({ data, error }, null, 2))
    } catch (error) {
      setResult(JSON.stringify({ error: error.message }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Supabase Connection</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="btn-primary mr-4"
        >
          Test Connection
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="btn-primary mr-4"
        >
          Test Login Query
        </button>
        
        <button
          onClick={insertTestUser}
          disabled={loading}
          className="btn-primary"
        >
          Insert Test User
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Result:</h3>
        <pre className="text-sm overflow-auto">
          {loading ? 'Loading...' : result || 'No result yet'}
        </pre>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Environment Variables:</h3>
        <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
        <p><strong>Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
      </div>
    </div>
  )
}

export default Debug