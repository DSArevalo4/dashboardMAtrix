# 📝 Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-01-28

### 🎉 Lanzamiento Inicial

#### ✨ Agregado
- **Gestión de Áreas de Trabajo**
  - 4 áreas predefinidas: CIC, Administración, Soporte, Implementación
  - Control deslizante para ajustar porcentajes (0-100%)
  - Colores distintivos por área
  - Validación de suma total = 100%

- **Gestión de Actividades**
  - Agregar actividades dinámicamente a cada área
  - Editar nombre de actividades inline
  - Ajustar porcentajes con sliders
  - Eliminar actividades
  - Cálculo automático de porcentaje real

- **Visualización de Datos**
  - Vista Grid: Tarjetas expandibles/colapsables
  - Vista Matriz: Tabla completa con cálculos detallados
  - Gráfico de pastel (donut chart) con Recharts
  - Barra de resumen con distribución visual
  - Tooltips informativos
  - Leyendas interactivas

- **Persistencia de Datos**
  - Base de datos SQLite local
  - Auto-guardado cada 2 segundos
  - Guardado manual con botón
  - Carga automática al iniciar
  - Sistema de snapshots para respaldos históricos

- **Generación de Reportes PDF**
  - Exportación a PDF profesional
  - Incluye resumen general con fecha
  - Distribución por áreas con colores
  - Matriz detallada de actividades
  - Cálculos de porcentajes reales
  - Resumen visual por área
  - Paginación automática
  - Numeración de páginas

- **API REST**
  - `GET /api/areas` - Obtener áreas
  - `POST /api/areas` - Guardar áreas
  - `GET /api/snapshots` - Listar snapshots
  - `POST /api/snapshots` - Crear snapshot
  - `DELETE /api/snapshots` - Eliminar snapshot
  - `POST /api/export-pdf` - Generar PDF

- **Sistema de Notificaciones**
  - Toast notifications con shadcn/ui
  - Feedback visual de acciones
  - Indicadores de estado (guardando, cargando)
  - Mensajes de error y éxito

- **UI/UX**
  - Diseño responsive (móvil, tablet, escritorio)
  - Tema claro/oscuro con next-themes
  - Animaciones suaves y transiciones
  - Backdrop blur effects
  - Componentes accesibles (Radix UI)
  - Iconografía con Lucide React

- **Documentación**
  - README completo con instrucciones
  - Guía rápida de inicio
  - Documentación de API
  - Ejemplos de uso
  - Troubleshooting guide

#### 🏗️ Arquitectura
- Next.js 16 con App Router
- React 19 con TypeScript
- Tailwind CSS 4
- SQLite con better-sqlite3
- jsPDF para generación de PDFs
- shadcn/ui + Radix UI para componentes

#### 🛡️ Seguridad
- Validación de datos en API
- Transacciones de base de datos
- Sanitización de inputs
- Manejo de errores robusto

#### 📚 Recursos
- Estructura de proyecto clara
- Código comentado
- Tipos TypeScript completos
- Componentes reutilizables

---

## [Unreleased]

### 🔮 En Planificación

#### Próximas Características
- [ ] Áreas personalizables (agregar/editar/eliminar)
- [ ] Autenticación de usuarios
- [ ] Múltiples proyectos
- [ ] Sincronización en la nube
- [ ] Exportar a Excel/CSV
- [ ] Gráficos adicionales (barras, líneas)
- [ ] Comparación histórica
- [ ] Dashboard analytics
- [ ] API pública REST
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Integración con calendarios
- [ ] Reportes programados
- [ ] Temas personalizados

#### Mejoras Planificadas
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Docker support
- [ ] Optimización de performance
- [ ] Caché avanzado
- [ ] Lazy loading de componentes
- [ ] Internacionalización (i18n)
- [ ] Accesibilidad mejorada (WCAG 2.1)
- [ ] SEO optimization
- [ ] Analytics tracking

---

## Formato de Versiones

El formato de las versiones es: `MAJOR.MINOR.PATCH`

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Corrección de bugs compatibles

### Tipos de Cambios

- **Agregado** (`✨ Added`): Nuevas características
- **Cambiado** (`🔄 Changed`): Cambios en funcionalidades existentes
- **Obsoleto** (`⚠️ Deprecated`): Características que serán removidas
- **Removido** (`🗑️ Removed`): Características removidas
- **Corregido** (`🐛 Fixed`): Corrección de bugs
- **Seguridad** (`🛡️ Security`): Parches de seguridad

---

## Mantenimiento

### Cómo Reportar Bugs

1. Busca si el bug ya fue reportado en [Issues](https://github.com/DSArevalo4/dashboardMAtrix/issues)
2. Si no existe, crea un [nuevo issue](https://github.com/DSArevalo4/dashboardMAtrix/issues/new)
3. Incluye:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es relevante
   - Información del entorno (OS, navegador, versión)

### Cómo Solicitar Features

1. Abre un [issue de feature request](https://github.com/DSArevalo4/dashboardMAtrix/issues/new)
2. Describe claramente:
   - El problema que resuelve
   - La solución propuesta
   - Casos de uso
   - Alternativas consideradas

---

## Enlaces

- **Repositorio**: [github.com/DSArevalo4/dashboardMAtrix](https://github.com/DSArevalo4/dashboardMAtrix)
- **Issues**: [github.com/DSArevalo4/dashboardMAtrix/issues](https://github.com/DSArevalo4/dashboardMAtrix/issues)
- **Releases**: [github.com/DSArevalo4/dashboardMAtrix/releases](https://github.com/DSArevalo4/dashboardMAtrix/releases)

---

**Última actualización**: 28 de enero de 2026
