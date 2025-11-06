import { supabase } from './supabaseClient'
import dayjs from 'dayjs'

export const notificacionesService = {
  // Obtener todas las notificaciones
  async getAll() {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Crear notificación
  async create(notificacion) {
    const { data, error } = await supabase
      .from('notificaciones')
      .insert([notificacion])
      .select()
    
    return { data, error }
  },

  // Marcar como leída
  async markAsRead(id) {
    const { data, error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id)
      .select()
    
    return { data, error }
  },

  // Eliminar notificación
  async delete(id) {
    const { data, error } = await supabase
      .from('notificaciones')
      .delete()
      .eq('id', id)
    
    return { data, error }
  },

  // Generar notificaciones automáticas de servicios próximos a vencer
  async generateServiceNotifications() {
    const { data: servicios, error } = await supabase
      .from('servicios')
      .select(`
        *,
        propiedades (nombre)
      `)
      .eq('estado', 'pendiente')
    
    if (error) return { data: null, error }

    const notifications = []
    const today = dayjs()

    for (const servicio of servicios) {
      const fechaVencimiento = dayjs(servicio.fecha_vencimiento)
      const diasRestantes = fechaVencimiento.diff(today, 'day')

      // Notificar 7 días antes y el día del vencimiento
      if (diasRestantes === 7 || diasRestantes === 0) {
        const mensaje = diasRestantes === 0 
          ? `El servicio "${servicio.nombre}" vence HOY en la propiedad ${servicio.propiedades?.nombre}`
          : `El servicio "${servicio.nombre}" vence en ${diasRestantes} días en la propiedad ${servicio.propiedades?.nombre}`

        notifications.push({
          titulo: diasRestantes === 0 ? 'Servicio Vencido' : 'Servicio Próximo a Vencer',
          mensaje,
          tipo: diasRestantes === 0 ? 'urgente' : 'advertencia',
          servicio_id: servicio.id,
          leida: false
        })
      }
    }

    if (notifications.length > 0) {
      const { data, error: insertError } = await supabase
        .from('notificaciones')
        .insert(notifications)
        .select()
      
      return { data, error: insertError }
    }

    return { data: [], error: null }
  },

  // Obtener notificaciones no leídas
  async getUnread() {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('leida', false)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Obtener estadísticas
  async getStats() {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('leida, tipo')
    
    if (error) return { data: null, error }
    
    const stats = {
      total: data.length,
      noLeidas: data.filter(n => !n.leida).length,
      urgentes: data.filter(n => n.tipo === 'urgente').length,
      advertencias: data.filter(n => n.tipo === 'advertencia').length
    }
    
    return { data: stats, error: null }
  }
}