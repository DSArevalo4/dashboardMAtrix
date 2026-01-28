# 📚 Documentación de la API

Esta documentación detalla los endpoints disponibles en la API del Dashboard de Gestión de Tiempo.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Áreas

#### GET `/api/areas`

Obtiene todas las áreas con sus actividades.

**Respuesta exitosa (200):**
```json
{
  "areas": [
    {
      "id": "cic",
      "name": "CIC",
      "percentage": 25,
      "color": "#22c55e",
      "activities": [
        {
          "id": "uuid-1",
          "name": "Actividad 1",
          "percentage": 50
        }
      ]
    }
  ]
}
```

**Error (500):**
```json
{
  "error": "Failed to load areas"
}
```

#### POST `/api/areas`

Guarda o actualiza todas las áreas.

**Request Body:**
```json
{
  "areas": [
    {
      "id": "cic",
      "name": "CIC",
      "percentage": 25,
      "color": "#22c55e",
      "activities": []
    }
  ]
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Areas saved successfully"
}
```

**Error (400):**
```json
{
  "error": "Invalid areas data"
}
```

---

### 2. Snapshots

#### GET `/api/snapshots`

Obtiene la lista de todos los snapshots guardados.

**Respuesta exitosa (200):**
```json
{
  "snapshots": [
    {
      "id": 1,
      "name": "Backup 2026-01-28",
      "created_at": "2026-01-28T10:30:00.000Z"
    }
  ]
}
```

#### GET `/api/snapshots?id={id}`

Obtiene un snapshot específico por ID.

**Query Params:**
- `id` (number): ID del snapshot

**Respuesta exitosa (200):**
```json
{
  "snapshot": [
    {
      "id": "cic",
      "name": "CIC",
      "percentage": 25,
      "color": "#22c55e",
      "activities": []
    }
  ]
}
```

#### POST `/api/snapshots`

Crea un nuevo snapshot.

**Request Body:**
```json
{
  "name": "Backup 2026-01-28",
  "areas": [
    {
      "id": "cic",
      "name": "CIC",
      "percentage": 25,
      "color": "#22c55e",
      "activities": []
    }
  ]
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Snapshot saved successfully"
}
```

#### DELETE `/api/snapshots?id={id}`

Elimina un snapshot.

**Query Params:**
- `id` (number): ID del snapshot a eliminar

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Snapshot deleted successfully"
}
```

---

### 3. Exportar PDF

#### POST `/api/export-pdf`

Genera un PDF con el reporte completo.

**Request Body:**
```json
{
  "areas": [
    {
      "id": "cic",
      "name": "CIC",
      "percentage": 25,
      "color": "#22c55e",
      "activities": [
        {
          "id": "uuid-1",
          "name": "Actividad 1",
          "percentage": 50
        }
      ]
    }
  ]
}
```

**Respuesta exitosa (200):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="reporte-tiempo-YYYY-MM-DD.pdf"`
- Body: Binary PDF data

**Error (400):**
```json
{
  "error": "Invalid areas data"
}
```

**Error (500):**
```json
{
  "error": "Failed to generate PDF"
}
```

---

## Tipos de Datos

### WorkArea

```typescript
interface WorkArea {
  id: string              // Identificador único del área
  name: string            // Nombre del área
  percentage: number      // Porcentaje de tiempo asignado (0-100)
  color: string           // Color hex (#rrggbb)
  activities: Activity[]  // Array de actividades
}
```

### Activity

```typescript
interface Activity {
  id: string          // Identificador único de la actividad
  name: string        // Nombre de la actividad
  percentage: number  // Porcentaje dentro del área (0-100)
}
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200    | Operación exitosa |
| 400    | Datos inválidos en la petición |
| 404    | Recurso no encontrado |
| 500    | Error interno del servidor |

---

## Ejemplos de Uso

### JavaScript/Fetch

```javascript
// Obtener áreas
const getAreas = async () => {
  const response = await fetch('/api/areas')
  const data = await response.json()
  return data.areas
}

// Guardar áreas
const saveAreas = async (areas) => {
  const response = await fetch('/api/areas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ areas }),
  })
  return await response.json()
}

// Exportar PDF
const exportPDF = async (areas) => {
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ areas }),
  })
  
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'reporte-tiempo.pdf'
  a.click()
}
```

### cURL

```bash
# Obtener áreas
curl http://localhost:3000/api/areas

# Guardar áreas
curl -X POST http://localhost:3000/api/areas \
  -H "Content-Type: application/json" \
  -d '{"areas":[{"id":"cic","name":"CIC","percentage":25,"color":"#22c55e","activities":[]}]}'

# Exportar PDF
curl -X POST http://localhost:3000/api/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"areas":[...]}' \
  --output reporte.pdf
```

---

## Consideraciones

1. **Validación**: Todos los endpoints validan los datos de entrada
2. **Transacciones**: Las operaciones de base de datos usan transacciones
3. **Errores**: Los errores se logean en la consola del servidor
4. **CORS**: No hay restricciones CORS (aplicación monolítica)
5. **Rate Limiting**: No implementado (uso individual)

---

## Seguridad

⚠️ **Importante**: Esta API no tiene autenticación ni autorización. Es para uso individual local. Si despliegas en producción, considera:

- Implementar autenticación (JWT, OAuth)
- Validar permisos de usuario
- Implementar rate limiting
- Sanitizar inputs
- Encriptar datos sensibles

---

## Changelog

### v1.0.0 (2026-01-28)
- Endpoint inicial de áreas (GET/POST)
- Endpoint de snapshots (GET/POST/DELETE)
- Endpoint de exportación PDF (POST)
- Documentación completa de API
