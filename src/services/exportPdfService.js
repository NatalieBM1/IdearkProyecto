import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const exportToPdf = (title, columns, rows, username) => {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(30, 58, 138) 
  doc.text('IDEARK', 14, 20)
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(title, 14, 35)
  
  // Metadata
  doc.setFontSize(10)
  doc.text(`Generado por: ${username}`, 14, 45)
  doc.text(`Fecha: ${new Date().toLocaleString('es-ES')}`, 14, 52)
  
  // Table
  doc.autoTable({
    startY: 60,
    head: [columns],
    body: rows,
    styles: { 
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [30, 58, 138], 
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] 
    }
  })
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10)
  }
  
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`)
}

export const exportUsersToPdf = (users, currentUser) => {
  const columns = ['Nombre', 'Email', 'Rol', 'Fecha Creación']
  const rows = users.map(user => [
    user.nombre,
    user.correo,
    user.rol === 'admin' ? 'Administrador' : 'Auxiliar',
    new Date(user.created_at).toLocaleDateString('es-ES')
  ])
  
  exportToPdf('Listado de Usuarios', columns, rows, currentUser?.nombre || 'Sistema')
}

export const exportPropertiesToPdf = (properties, currentUser) => {
  const columns = ['Nombre', 'Dirección', 'Valor', 'Estado']
  const rows = properties.map(property => [
    property.nombre,
    property.direccion,
    `$${property.valor?.toLocaleString('es-ES') || 0}`,
    property.estado || 'Disponible'
  ])
  
  exportToPdf('Listado de Propiedades', columns, rows, currentUser?.nombre || 'Sistema')
}

export const exportTenantsToPdf = (tenants, currentUser) => {
  const columns = ['Nombre', 'Email', 'Teléfono', 'Propiedad']
  const rows = tenants.map(tenant => [
    tenant.nombre,
    tenant.contacto?.correo || 'Sin email',
    tenant.contacto?.telefono || 'Sin teléfono',
    tenant.propiedades?.nombre || 'Sin asignar'
  ])
  
  exportToPdf('Listado de Arrendatarios', columns, rows, currentUser?.nombre || 'Sistema')
}

export const exportServicesToPdf = (services, currentUser) => {
  const columns = ['Tipo', 'Propiedad', 'Valor Total', 'Fecha de Pago']
  const rows = services.map(service => [
    service.tipo,
    service.propiedades?.nombre || 'Sin asignar',
    `$${service.valor_total?.toLocaleString('es-ES') || 0}`,
    new Date(service.fecha_pago).toLocaleDateString('es-ES')
  ])
  
  exportToPdf('Listado de Servicios', columns, rows, currentUser?.nombre || 'Sistema')
}