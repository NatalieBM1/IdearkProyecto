import { supabase } from './supabaseClient'

export const arrendatariosService = {
  // Obtener todos los arrendatarios
  async getAll() {
    const { data, error } = await supabase
      .from('arrendatarios')
      .select(`
        *,
        propiedades (
          id,
          nombre,
          direccion
        )
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Obtener arrendatario por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('arrendatarios')
      .select(`
        *,
        propiedades (
          id,
          nombre,
          direccion
        )
      `)
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Crear nuevo arrendatario
  async create(arrendatario) {
    const { data, error } = await supabase
      .from('arrendatarios')
      .insert([arrendatario])
      .select()
    
    return { data, error }
  },

  // Actualizar arrendatario
  async update(id, arrendatario) {
    const { data, error } = await supabase
      .from('arrendatarios')
      .update(arrendatario)
      .eq('id', id)
      .select()
    
    return { data, error }
  },

  // Eliminar arrendatario
  async delete(id) {
    const { data, error } = await supabase
      .from('arrendatarios')
      .delete()
      .eq('id', id)
    
    return { data, error }
  },

  // Obtener arrendatarios por propiedad
  async getByProperty(propiedadId) {
    const { data, error } = await supabase
      .from('arrendatarios')
      .select('*')
      .eq('propiedad_id', propiedadId)
    
    return { data, error }
  },

  // Obtener estadísticas
  async getStats() {
    const { data, error } = await supabase
      .from('arrendatarios')
      .select('*')
    
    if (error) return { data: null, error }
    
    const stats = {
      total: data.length,
      activos: data.length, 
      inactivos: 0
    }
    
    return { data: stats, error: null }
  }
}