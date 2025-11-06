import { supabase } from './supabaseClient'

export const serviciosService = {
  // Obtener todos los servicios
  async getAll() {
    const { data, error } = await supabase
      .from('servicios')
      .select(`
        *,
        propiedades (
          id,
          nombre,
          direccion
        )
      `)
      .order('fecha_pago', { ascending: false })
    
    return { data, error }
  },

  // Obtener servicio por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('servicios')
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

  // Crear nuevo servicio
  async create(servicio) {
    const { data, error } = await supabase
      .from('servicios')
      .insert([servicio])
      .select()
    
    return { data, error }
  },

  // Actualizar servicio
  async update(id, servicio) {
    const { data, error } = await supabase
      .from('servicios')
      .update(servicio)
      .eq('id', id)
      .select()
    
    return { data, error }
  },

  // Eliminar servicio
  async delete(id) {
    const { data, error } = await supabase
      .from('servicios')
      .delete()
      .eq('id', id)
    
    return { data, error }
  },

  // Obtener servicios por propiedad
  async getByProperty(propiedadId) {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('propiedad_id', propiedadId)
      .order('fecha_pago', { ascending: false })
    
    return { data, error }
  },

  // Calcular división de servicios entre arrendatarios
  async calculateServiceDivision(servicioId) {
    try {
      // Obtener el servicio
      const { data: servicio, error: servicioError } = await this.getById(servicioId)
      if (servicioError) {
        console.error('Error obteniendo servicio:', servicioError)
        return { data: null, error: servicioError }
      }

      if (!servicio) {
        return { data: null, error: { message: 'Servicio no encontrado' } }
      }

      console.log('Servicio encontrado:', servicio)

      // Obtener arrendatarios de la propiedad
      const { data: arrendatarios, error: arrendatariosError } = await supabase
        .from('arrendatarios')
        .select('*')
        .eq('propiedad_id', servicio.propiedad_id)

      console.log('Arrendatarios encontrados:', arrendatarios)

      if (arrendatariosError) {
        console.error('Error obteniendo arrendatarios:', arrendatariosError)
        return { data: null, error: arrendatariosError }
      }

      if (!arrendatarios || arrendatarios.length === 0) {
        return { data: [], error: { message: 'No hay arrendatarios en esta propiedad' } }
      }

      const valorPorArrendatario = Math.round(servicio.valor_total / arrendatarios.length)

      const division = arrendatarios.map(arrendatario => ({
        arrendatario_id: arrendatario.id,
        arrendatario_nombre: arrendatario.nombre,
        valor_asignado: valorPorArrendatario,
        servicio_id: servicioId,
        contacto: arrendatario.contacto,
        telefono: arrendatario.contacto?.telefono || 'Sin teléfono',
        email: arrendatario.contacto?.correo || 'Sin email'
      }))

      return { data: division, error: null }
    } catch (error) {
      console.error('Error en calculateServiceDivision:', error)
      return { data: null, error: { message: 'Error al calcular división: ' + error.message } }
    }
  },

  // Obtener arrendatarios por propiedad
  async getArrendatariosByProperty(propiedadId) {
    const { data, error } = await supabase
      .from('arrendatarios')
      .select('*')
      .eq('propiedad_id', propiedadId)
      .order('nombre', { ascending: true })
    
    return { data, error }
  },

  // Obtener estadísticas
  async getStats() {
    const { data, error } = await supabase
      .from('servicios')
      .select('valor_total')
    
    if (error) return { data: null, error }
    
    const stats = {
      total: data.length,
      valorTotal: data.reduce((sum, s) => sum + (s.valor_total || 0), 0),
      pendientes: data.length, // Todos los servicios están registrados
      pagados: 0
    }
    
    return { data: stats, error: null }
  }
}