# 📊 Dashboard de Gestión de Tiempo

Sistema interactivo de gestión y visualización de distribución de tiempo por áreas de trabajo y actividades específicas, con persistencia de datos y generación de reportes PDF.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-green)

## ✨ Características

### 🎯 Gestión de Tiempo
- **4 Áreas Predefinidas**: CIC, Administración, Soporte, Implementación
- **Asignación Porcentual**: Control deslizante para ajustar % de tiempo por área (0-100%)
- **Validación Automática**: Alerta visual cuando el total no suma 100%
- **Actividades Dinámicas**: Agrega, edita y elimina actividades dentro de cada área

### 📈 Visualización
- **Vista Grid**: Tarjetas expandibles/colapsables por área
- **Vista Matriz**: Tabla completa con cálculos de porcentajes reales
- **Gráfico de Pastel**: Distribución visual interactiva con Recharts
- **Barra de Resumen**: Visualización rápida de distribución general

### 💾 Persistencia de Datos
- **SQLite Database**: Almacenamiento local con better-sqlite3
- **Auto-guardado**: Los cambios se guardan automáticamente cada 2 segundos
- **Guardado Manual**: Botón de guardado instantáneo
- **Carga Automática**: Los datos se recuperan al iniciar la aplicación

### 📄 Generación de Reportes
- **Exportar a PDF**: Genera reportes profesionales con un clic
- **Contenido Completo**: 
  - Resumen general con fecha
  - Distribución por áreas con colores
  - Matriz detallada de todas las actividades
  - Cálculo de porcentajes reales
  - Resumen visual de tiempo por área
  - Paginación automática
- **Formato Profesional**: Diseño limpio y estructurado

### 🎨 Diseño UI/UX
- **Tema Claro/Oscuro**: Soporte completo con next-themes
- **Diseño Responsive**: Adaptable a móviles, tablets y escritorio
- **Animaciones Suaves**: Transiciones fluidas entre vistas
- **Backdrop Blur**: Efectos visuales modernos
- **Notificaciones Toast**: Feedback visual de acciones

## 🏗️ Arquitectura

### Stack Tecnológico

```
Frontend:
├── Next.js 16 (App Router)
├── React 19
├── TypeScript 5.9
├── Tailwind CSS 4
└── shadcn/ui + Radix UI

Backend:
├── Next.js API Routes
├── better-sqlite3
└── jsPDF

Visualización:
├── Recharts
└── html2canvas
```

### Estructura del Proyecto

```
action-time-dashboard/
├── app/
│   ├── api/
│   │   ├── areas/route.ts          # CRUD de áreas
│   │   ├── export-pdf/route.ts     # Generación de PDF
│   │   └── snapshots/route.ts      # Snapshots históricos
│   ├── layout.tsx                   # Layout principal
│   ├── page.tsx                     # Página principal
│   └── globals.css                  # Estilos globales
├── components/
│   ├── area-card.tsx               # Tarjeta de área individual
│   ├── overview-chart.tsx          # Gráfico de pastel
│   ├── percentage-matrix.tsx       # Tabla de matriz
│   ├── time-dashboard.tsx          # Componente principal
│   └── ui/                         # Componentes shadcn/ui
├── lib/
│   ├── db.ts                       # Funciones de base de datos
│   ├── types.ts                    # Tipos TypeScript
│   └── utils.ts                    # Utilidades
├── data/
│   └── timetracker.db              # Base de datos SQLite (auto-generada)
└── hooks/
    └── use-toast.ts                # Hook para notificaciones
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) / npm / yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DSArevalo4/dashboardMAtrix.git
cd dashboardMAtrix/action-time-dashboard

# Instalar dependencias
pnpm install

# Aprobar scripts de build (necesario para SQLite)
pnpm approve-builds

# Ejecutar en modo desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
# Crear build optimizado
pnpm build

# Ejecutar en producción
pnpm start
```

## 📖 Uso

### 1. Gestión de Áreas

1. **Ajustar Porcentajes**: Usa el control deslizante para asignar % de tiempo a cada área
2. **Validar Total**: Asegúrate que la suma sea 100% (indicador visual en header)
3. **Expandir/Colapsar**: Haz clic en el ícono de chevron para mostrar/ocultar detalles

### 2. Gestión de Actividades

1. **Agregar Actividad**: 
   - Escribe el nombre en el campo de entrada
   - Presiona Enter o haz clic en el botón "+"
   
2. **Editar Actividad**:
   - Haz clic en el nombre de la actividad para editarlo
   - Ajusta el porcentaje con el slider
   
3. **Eliminar Actividad**: Haz clic en el ícono de papelera

### 3. Visualización

- **Vista Grid**: Muestra tarjetas de áreas + gráfico de resumen
- **Vista Matriz**: Muestra tabla completa con cálculos detallados
- Alterna entre vistas con los botones del header

### 4. Guardado de Datos

- **Auto-guardado**: Los cambios se guardan automáticamente cada 2 segundos
- **Guardado Manual**: Haz clic en el botón "Guardar" para guardar inmediatamente
- **Indicador Visual**: Verás "Guardando..." durante el proceso

### 5. Exportar a PDF

1. Haz clic en el botón "Exportar PDF" en el header
2. Espera la notificación "Generando PDF..."
3. El archivo se descargará automáticamente con nombre: `reporte-tiempo-YYYY-MM-DD.pdf`

## 💾 Base de Datos

### Schema SQLite

```sql
-- Tabla de áreas
CREATE TABLE areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  color TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de actividades
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  area_id TEXT NOT NULL,
  name TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
);

-- Tabla de snapshots (para historial)
CREATE TABLE snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Ubicación

La base de datos se crea automáticamente en:
```
action-time-dashboard/data/timetracker.db
```

## 🎨 Personalización

### Colores de Áreas

Edita los colores en [components/time-dashboard.tsx](action-time-dashboard/components/time-dashboard.tsx):

```typescript
const AREA_COLORS = {
  cic: "#22c55e",           // Verde
  admin: "#3b82f6",         // Azul
  soporte: "#f97316",       // Naranja
  implementacion: "#a855f7", // Morado
}
```

### Tema

El tema se gestiona automáticamente con `next-themes`. Los usuarios pueden cambiar entre claro/oscuro según sus preferencias del sistema.

## 📊 Cálculo de Porcentajes

### Porcentaje Real

El porcentaje real de cada actividad se calcula como:

```
% Real = (% Área × % Actividad) / 100
```

**Ejemplo:**
- Área "Soporte" = 30%
- Actividad "Tickets" = 60%
- % Real = (30 × 60) / 100 = 18%

### Validación

- La suma de todas las áreas debe ser 100%
- La suma de actividades dentro de un área debe ser 100%
- Indicadores visuales alertan si no se cumple

## 🔧 Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo (puerto 3000)
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Ejecutar ESLint
```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'better-sqlite3'"

```bash
pnpm approve-builds
pnpm install
```

### Base de datos no se crea

Verifica que el directorio `data/` tenga permisos de escritura:

```bash
mkdir -p action-time-dashboard/data
chmod 755 action-time-dashboard/data
```

### PDF no se genera

Asegúrate de que todas las dependencias estén instaladas:

```bash
pnpm install jspdf html2canvas
```

## 🔐 Seguridad

- La base de datos es local y no se comparte
- No hay autenticación (aplicación de uso individual)
- Los datos se almacenan solo en tu máquina

## 🚧 Roadmap

- [ ] Agregar áreas personalizables (no solo las 4 predefinidas)
- [ ] Sistema de autenticación multi-usuario
- [ ] Sincronización en la nube
- [ ] Exportar a Excel/CSV
- [ ] Gráficos adicionales (barras, líneas temporales)
- [ ] Comparación de períodos históricos
- [ ] API REST pública
- [ ] Dashboard analytics avanzado

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

**DSArevalo4**

- GitHub: [@DSArevalo4](https://github.com/DSArevalo4)
- Repository: [dashboardMAtrix](https://github.com/DSArevalo4/dashboardMAtrix)

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Radix UI](https://www.radix-ui.com/) - Primitivas accesibles
- [Recharts](https://recharts.org/) - Librería de gráficos
- [jsPDF](https://github.com/parallax/jsPDF) - Generación de PDF
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Base de datos SQLite

---

**Hecho con ❤️ usando Next.js y TypeScript**
