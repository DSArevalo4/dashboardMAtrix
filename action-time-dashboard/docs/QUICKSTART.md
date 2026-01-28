# 🚀 Guía Rápida de Inicio

Esta guía te ayudará a poner en marcha el Dashboard de Gestión de Tiempo en menos de 5 minutos.

## ⚡ Inicio Rápido

### 1. Instalar dependencias

```bash
cd action-time-dashboard
pnpm install
```

### 2. Aprobar build scripts

```bash
pnpm approve-builds
```

Selecciona las opciones cuando se te pregunte y aprueba (Y).

### 3. Iniciar servidor de desarrollo

```bash
pnpm dev
```

### 4. Abrir navegador

Visita: `http://localhost:3000`

¡Listo! 🎉

---

## 📋 Primeros Pasos

### Configurar tu primera distribución

1. **Ajusta los porcentajes de cada área** usando los sliders
   - CIC: 25%
   - Administración: 25%
   - Soporte: 25%
   - Implementación: 25%

2. **Asegúrate que sumen 100%** (verás un indicador verde en el header)

3. **Agrega actividades** a cada área:
   - Haz clic en una tarjeta de área
   - Escribe el nombre de la actividad
   - Presiona Enter o clic en "+"
   - Ajusta el porcentaje de cada actividad

4. **Guarda tus cambios**:
   - Los cambios se guardan automáticamente cada 2 segundos
   - O haz clic en el botón "Guardar"

### Ver tus datos

- **Vista Grid**: Ver tarjetas de áreas + gráfico
- **Vista Matriz**: Ver tabla completa con cálculos

### Exportar reporte

1. Haz clic en "Exportar PDF"
2. Espera unos segundos
3. El PDF se descargará automáticamente

---

## 💡 Tips Útiles

### ✅ Validación de Porcentajes

- **Áreas**: La suma debe ser 100%
- **Actividades**: La suma dentro de cada área debe ser 100%
- Los indicadores cambiarán de color:
  - 🟢 Verde = 100% (correcto)
  - 🔴 Rojo = ≠ 100% (revisar)

### 📊 Cálculo del Tiempo Real

El porcentaje real de cada actividad se calcula automáticamente:

```
% Real = (% Área × % Actividad) / 100
```

**Ejemplo:**
- Soporte = 30%
- Tickets = 60%
- **Tiempo Real en Tickets = 18%**

### 💾 Persistencia de Datos

- Los datos se guardan en SQLite
- Ubicación: `action-time-dashboard/data/timetracker.db`
- Los datos persisten entre sesiones
- No necesitas hacer backup manual (pero puedes usar snapshots)

### 🎨 Cambiar Tema

El tema se ajusta automáticamente según las preferencias de tu sistema operativo:
- Claro ☀️
- Oscuro 🌙

---

## 🔧 Solución Rápida de Problemas

### ❌ Error al instalar

```bash
# Limpia cache y reinstala
rm -rf node_modules
pnpm install
```

### ❌ Base de datos no funciona

```bash
# Asegura permisos
mkdir -p data
chmod 755 data
```

### ❌ PDF no se genera

```bash
# Reinstala dependencias de PDF
pnpm add jspdf html2canvas
```

### ❌ Puerto 3000 ocupado

```bash
# Usa otro puerto
PORT=3001 pnpm dev
```

---

## 📱 Uso en Móvil

El dashboard es completamente responsive. Funciona perfecto en:
- 📱 Smartphones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Escritorio

---

## 🎯 Casos de Uso Típicos

### 1. Distribución Básica (Sin Actividades)

```
CIC: 25%
Administración: 25%
Soporte: 25%
Implementación: 25%
```

### 2. Distribución con Actividades Detalladas

```
Soporte (40%):
  ├─ Tickets: 60% → Real: 24%
  ├─ Consultas: 30% → Real: 12%
  └─ Emergencias: 10% → Real: 4%

CIC (30%):
  ├─ Proyectos: 70% → Real: 21%
  └─ Reuniones: 30% → Real: 9%
```

### 3. Distribución Desigual

```
Implementación: 50%
Soporte: 30%
Administración: 15%
CIC: 5%
```

---

## 🎓 Recursos Adicionales

- 📖 [README completo](../README.md)
- 📚 [Documentación de API](API.md)
- 🐛 [Reportar un bug](https://github.com/DSArevalo4/dashboardMAtrix/issues)

---

## ✨ Atajos de Teclado

| Acción | Atajo |
|--------|-------|
| Agregar actividad | `Enter` en el input |
| Colapsar/Expandir | Clic en chevron |
| Cambiar vista | Botones en header |

---

## 🤝 ¿Necesitas Ayuda?

1. Revisa la [documentación completa](../README.md)
2. Busca en [issues existentes](https://github.com/DSArevalo4/dashboardMAtrix/issues)
3. Abre un [nuevo issue](https://github.com/DSArevalo4/dashboardMAtrix/issues/new)

---

**¡Feliz gestión de tiempo! ⏰✨**
