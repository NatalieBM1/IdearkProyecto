# 🏢 IDEARK Dashboard Administrativo

Sistema web completo para la gestión administrativa de arrendamientos de inmuebles y control de servicios asociados para la empresa **Ideark**.

## 🚀 Características Principales

- ✅ **Gestión de Propiedades**: CRUD completo con exportación a PDF
- ✅ **Gestión de Arrendatarios**: Registro y control de inquilinos
- ✅ **Gestión de Servicios**: División automática entre arrendatarios
- ✅ **Sistema de Notificaciones**: Alertas automáticas de vencimientos
- ✅ **Autenticación Segura**: Login/registro con Supabase Auth
- ✅ **Exportación PDF**: Reportes profesionales con jsPDF
- ✅ **Dashboard Interactivo**: KPIs y estadísticas en tiempo real
- ✅ **Diseño Responsive**: Compatible con móviles y escritorio

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (Base de datos, Auth, Storage)
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Yup
- **Notificaciones**: React Toastify
- **PDF**: jsPDF + jsPDF-AutoTable
- **Fechas**: Day.js
- **Rutas**: React Router DOM

## 📋 Requisitos Previos

- Node.js 16+ 
- npm o yarn
- Cuenta en Supabase

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ideark-dashboard
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://cyuzubkmrkinxnbzylrn.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

4. **Configurar base de datos en Supabase**

Ejecutar las siguientes consultas SQL en el editor de Supabase:

```sql
-- Tabla de propiedades
CREATE TABLE propiedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  direccion TEXT NOT NULL,
  valor DECIMAL(12,2),
  estado VARCHAR DEFAULT 'activa' CHECK (estado IN ('activa', 'inactiva', 'mantenimiento')),
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de arrendatarios
CREATE TABLE arrendatarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  telefono VARCHAR,
  propiedad_id UUID REFERENCES propiedades(id) ON DELETE SET NULL,
  estado VARCHAR DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  fecha_inicio DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  propiedad_id UUID REFERENCES propiedades(id) ON DELETE CASCADE,
  valor_total DECIMAL(12,2) NOT NULL,
  fecha DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado VARCHAR DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado')),
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR DEFAULT 'info' CHECK (tipo IN ('info', 'advertencia', 'urgente')),
  leida BOOLEAN DEFAULT FALSE,
  servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE arrendatarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (permitir todo para usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden ver propiedades" ON propiedades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar propiedades" ON propiedades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar propiedades" ON propiedades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden eliminar propiedades" ON propiedades FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden ver arrendatarios" ON arrendatarios FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar arrendatarios" ON arrendatarios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar arrendatarios" ON arrendatarios FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden eliminar arrendatarios" ON arrendatarios FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden ver servicios" ON servicios FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar servicios" ON servicios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar servicios" ON servicios FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden eliminar servicios" ON servicios FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden ver notificaciones" ON notificaciones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar notificaciones" ON notificaciones FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar notificaciones" ON notificaciones FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden eliminar notificaciones" ON notificaciones FOR DELETE USING (auth.role() = 'authenticated');
```

5. **Ejecutar el proyecto**
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── assets/                 # Recursos estáticos
├── components/            # Componentes reutilizables
│   ├── Sidebar.jsx       # Barra lateral de navegación
│   ├── Navbar.jsx        # Barra superior
│   ├── Table.jsx         # Tabla reutilizable
│   ├── Modal.jsx         # Modal reutilizable
│   └── NotificationCard.jsx # Tarjeta de notificación
├── pages/                # Páginas principales
│   ├── Dashboard.jsx     # Panel principal con KPIs
│   ├── Propiedades.jsx   # Gestión de propiedades
│   ├── Arrendatarios.jsx # Gestión de arrendatarios
│   ├── Servicios.jsx     # Gestión de servicios
│   ├── Notificaciones.jsx # Centro de notificaciones
│   ├── Login.jsx         # Página de inicio de sesión
│   └── Register.jsx      # Página de registro
├── layouts/              # Layouts de la aplicación
│   └── MainLayout.jsx    # Layout principal con sidebar
├── context/              # Contextos de React
│   └── AuthContext.jsx   # Contexto de autenticación
├── hooks/                # Hooks personalizados
│   └── useAuth.js        # Hook de autenticación
├── services/             # Servicios y APIs
│   ├── supabaseClient.js # Cliente de Supabase
│   ├── propiedadesService.js # Servicio de propiedades
│   ├── arrendatariosService.js # Servicio de arrendatarios
│   ├── serviciosService.js # Servicio de servicios
│   ├── notificacionesService.js # Servicio de notificaciones
│   └── exportPdfService.js # Servicio de exportación PDF
├── routes/               # Configuración de rutas
│   └── AppRouter.jsx     # Router principal
├── styles/               # Estilos globales
│   └── globals.css       # Estilos CSS con Tailwind
├── App.jsx              # Componente principal
└── main.jsx             # Punto de entrada
```

## 🎯 Funcionalidades Detalladas

### 🏠 Gestión de Propiedades
- Crear, editar, eliminar y visualizar propiedades
- Campos: nombre, dirección, valor, estado, descripción
- Estados: activa, inactiva, mantenimiento
- Exportación a PDF con logo de Ideark

### 👥 Gestión de Arrendatarios
- Registro completo de inquilinos
- Asociación con propiedades específicas
- Control de estados (activo/inactivo)
- Exportación de listados por propiedad

### ⚡ Gestión de Servicios
- Registro de servicios (agua, luz, gas, internet, etc.)
- División automática entre arrendatarios activos
- Control de fechas de vencimiento
- Generación de recibos individuales en PDF

### 🔔 Sistema de Notificaciones
- Alertas automáticas 7 días antes del vencimiento
- Notificaciones urgentes el día del vencimiento
- Filtros por tipo (todas, sin leer, urgentes)
- Marcado masivo como leídas

### 📊 Dashboard Interactivo
- KPIs en tiempo real
- Estadísticas de propiedades, arrendatarios y servicios
- Acciones rápidas para crear registros
- Resumen financiero

### 🔐 Autenticación y Seguridad
- Login/registro con Supabase Auth
- Roles: Administrador y Auxiliar Administrativo
- Rutas protegidas por autenticación
- Row Level Security en base de datos

## 📄 Exportación PDF

Todos los módulos incluyen exportación a PDF con:
- Logo de Ideark
- Fecha y usuario que genera el reporte
- Tablas formateadas con colores corporativos
- Paginación automática
- Metadatos del documento

## 🎨 Diseño y UX

- **Colores Corporativos**: Azul oscuro (#1e3a8a) y acentos cálidos
- **Responsive Design**: Adaptable a móviles y tablets
- **Componentes Reutilizables**: Consistencia visual
- **Feedback Visual**: Toasts para confirmaciones y errores
- **Loading States**: Indicadores de carga en todas las operaciones

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

## 🔧 Configuración Adicional

### Variables de Entorno
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### Configuración de Supabase
- **Organization**: PROYECTO
- **Project name**: IdearkDB
- **Region**: America
- **URL**: https://cyuzubkmrkinxnbzylrn.supabase.co

## 📱 Uso del Sistema

1. **Registro/Login**: Crear cuenta o iniciar sesión
2. **Dashboard**: Ver estadísticas generales
3. **Propiedades**: Gestionar inmuebles
4. **Arrendatarios**: Registrar inquilinos
5. **Servicios**: Crear servicios y dividir costos
6. **Notificaciones**: Revisar alertas automáticas
7. **Exportar**: Generar reportes PDF desde cualquier módulo

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@ideark.com
- Documentación: [Wiki del proyecto]

## 📄 Licencia

Este proyecto es propiedad de **Ideark** y está protegido por derechos de autor.

---

**Desarrollado con ❤️ para Ideark**