import { supabase } from './supabaseClient'

export const propiedadesService = {
  // Obtener todas las propiedades
  async getAll() {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Obtener propiedad por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Crear nueva propiedad
  async create(propiedad) {
    const { data, error } = await supabase
      .from('propiedades')
      .insert([propiedad])
      .select()
    
    return { data, error }
  },

  // Actualizar propiedad
  async update(id, propiedad) {
    const { data, error } = await supabase
      .from('propiedades')
      .update(propiedad)
      .eq('id', id)
      .select()
    
    return { data, error }
  },

  // Eliminar propiedad
  async delete(id) {
    const { data, error } = await supabase
      .from('propiedades')
      .delete()
      .eq('id', id)
    
    return { data, error }
  },

  // Obtener estadísticas
  async getStats() {
    const { data, error } = await supabase
      .from('propiedades')
      .select('estado')
    
    if (error) return { data: null, error }
    
    const stats = {
      total: data.length,
      disponibles: data.filter(p => p.estado === 'disponible').length,
      ocupadas: data.filter(p => p.estado === 'ocupado').length,
      mantenimiento: data.filter(p => p.estado === 'mantenimiento').length
    }
    
    return { data: stats, error: null }
  }
}