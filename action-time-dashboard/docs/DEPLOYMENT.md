# 🚀 Guía de Despliegue

Esta guía te ayudará a desplegar el Dashboard de Gestión de Tiempo en diferentes plataformas.

---

## 📋 Pre-requisitos para Despliegue

- [ ] Proyecto compilado sin errores (`pnpm build`)
- [ ] Base de datos SQLite funcionando localmente
- [ ] Todas las dependencias instaladas
- [ ] Variables de entorno configuradas (si aplica)

---

## 🌐 Opción 1: Vercel (Recomendado)

### Ventajas
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS gratis
- ✅ CI/CD integrado
- ✅ Previews de Pull Requests

### Limitaciones
⚠️ **Importante**: Vercel es serverless, por lo que SQLite no persistirá entre despliegues.

**Solución**: Migrar a PostgreSQL/MySQL o usar Vercel KV/Postgres.

### Pasos para Desplegar

1. **Conectar con GitHub**
   ```bash
   # Asegúrate de tener el código en GitHub
   git add .
   git commit -m "feat: add SQLite persistence and PDF export"
   git push origin main
   ```

2. **Importar en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Import Project"
   - Selecciona tu repositorio `dashboardMAtrix`
   - Configura:
     - Root Directory: `action-time-dashboard`
     - Framework: Next.js
     - Build Command: `pnpm build`
     - Output Directory: `.next`

3. **Variables de Entorno** (opcional)
   ```env
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! 🎉

### Migrar a Vercel Postgres

```typescript
// lib/db.ts (modificado para Vercel)
import { sql } from '@vercel/postgres';

export async function loadAreas() {
  const { rows } = await sql`
    SELECT * FROM areas ORDER BY id
  `;
  // ... resto de la lógica
}
```

---

## 🐳 Opción 2: Docker + Servidor Propio

### Ventajas
- ✅ SQLite persiste en volumen
- ✅ Control completo
- ✅ No hay límites de serverless

### Pasos

1. **Crear Dockerfile**

```dockerfile
# /workspaces/dashboardMAtrix/action-time-dashboard/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Crear directorio para base de datos
RUN mkdir -p data && chmod 755 data

# Build de producción
RUN pnpm build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "start"]
```

2. **Crear docker-compose.yml**

```yaml
# docker-compose.yml
version: '3.8'

services:
  dashboard:
    build: ./action-time-dashboard
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

3. **Construir y Ejecutar**

```bash
# Construir imagen
docker-compose build

# Iniciar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

4. **Acceder**
   - URL: `http://tu-servidor:3000`

---

## ☁️ Opción 3: Railway

### Ventajas
- ✅ Despliegue simple desde GitHub
- ✅ Soporte para SQLite con volúmenes
- ✅ Plan gratuito disponible

### Pasos

1. **Conectar GitHub**
   - Ve a [railway.app](https://railway.app)
   - Login con GitHub
   - "New Project" → "Deploy from GitHub repo"
   - Selecciona `dashboardMAtrix`

2. **Configurar**
   ```
   Root Directory: action-time-dashboard
   Build Command: pnpm install && pnpm build
   Start Command: pnpm start
   ```

3. **Agregar Volumen**
   - En Settings → Volumes
   - Mount Path: `/app/data`
   - Esto persiste la base de datos

4. **Deploy**
   - Railway despliega automáticamente
   - Obtienes un dominio: `tu-app.railway.app`

---

## 🔥 Opción 4: Servidor VPS (DigitalOcean, AWS, etc.)

### Ventajas
- ✅ Control total
- ✅ SQLite funciona perfecto
- ✅ Escalable

### Pasos

1. **Preparar Servidor**

```bash
# Conectar por SSH
ssh root@tu-servidor

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar PM2 (process manager)
npm install -g pm2
```

2. **Clonar Repositorio**

```bash
cd /var/www
git clone https://github.com/DSArevalo4/dashboardMAtrix.git
cd dashboardMAtrix/action-time-dashboard
```

3. **Instalar y Construir**

```bash
pnpm install
pnpm build
```

4. **Configurar PM2**

```bash
# Crear ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'dashboard',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/dashboardMAtrix/action-time-dashboard',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js

# Configurar para inicio automático
pm2 startup
pm2 save
```

5. **Configurar Nginx (Reverse Proxy)**

```bash
# Instalar Nginx
apt-get install -y nginx

# Configurar
cat > /etc/nginx/sites-available/dashboard << 'EOF'
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Activar sitio
ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

6. **SSL con Let's Encrypt**

```bash
# Instalar Certbot
apt-get install -y certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d tu-dominio.com

# Renovación automática
certbot renew --dry-run
```

---

## 🔒 Configuración de Seguridad

### Variables de Entorno

```bash
# .env.production
NODE_ENV=production
DATABASE_PATH=/app/data/timetracker.db
MAX_FILE_SIZE=10485760
ALLOWED_ORIGINS=https://tu-dominio.com
```

### Rate Limiting

```typescript
// middleware.ts (crear)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'unknown'
  const now = Date.now()
  const windowMs = 60000 // 1 minuto
  const maxRequests = 100

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return NextResponse.next()
  }

  const data = rateLimit.get(ip)

  if (now > data.resetTime) {
    data.count = 1
    data.resetTime = now + windowMs
  } else {
    data.count++
  }

  if (data.count > maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## 📊 Monitoreo y Analytics

### Opción 1: Vercel Analytics (Gratis)

Ya incluido en el proyecto:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next'

<Analytics />
```

### Opción 2: Google Analytics

```bash
pnpm add @next/third-parties
```

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

### Opción 3: Sentry (Error Tracking)

```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.config.js
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "tu-sentry-dsn",
  tracesSampleRate: 1.0,
})
```

---

## 🔄 Actualizaciones y Mantenimiento

### Actualizar en Producción

#### Vercel/Railway
```bash
# Simplemente push a main
git add .
git commit -m "fix: update feature"
git push origin main
# Auto-deploy se activa automáticamente
```

#### VPS con PM2
```bash
# SSH al servidor
cd /var/www/dashboardMAtrix/action-time-dashboard

# Pull cambios
git pull origin main

# Instalar dependencias nuevas
pnpm install

# Rebuild
pnpm build

# Restart
pm2 restart dashboard

# Ver logs
pm2 logs dashboard
```

### Backup de Base de Datos

```bash
# Backup automático diario (VPS)
cat > /etc/cron.daily/backup-dashboard << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
cp /var/www/dashboardMAtrix/action-time-dashboard/data/timetracker.db \
   /backups/timetracker-$DATE.db
# Mantener solo últimos 30 días
find /backups -name "timetracker-*.db" -mtime +30 -delete
EOF

chmod +x /etc/cron.daily/backup-dashboard
```

---

## 🧪 Checklist Pre-Producción

- [ ] Build exitoso localmente
- [ ] Todas las funcionalidades testeadas
- [ ] Base de datos funciona correctamente
- [ ] PDFs se generan sin errores
- [ ] Variables de entorno configuradas
- [ ] SSL/HTTPS habilitado
- [ ] Backup automático configurado
- [ ] Monitoreo activo
- [ ] Rate limiting implementado
- [ ] Logs configurados
- [ ] Dominio apuntando correctamente
- [ ] README actualizado con URL de producción

---

## 🆘 Troubleshooting en Producción

### Error: "Cannot find module 'better-sqlite3'"

**Solución para Vercel**: No soportado, migrar a Vercel Postgres

**Solución para VPS/Docker**:
```bash
pnpm rebuild better-sqlite3
```

### Error: "Permission denied writing to /data"

```bash
# En el servidor
chmod 755 data/
chown -R node:node data/
```

### PDF no se genera

Verificar memory limits:
```javascript
// next.config.mjs
export default {
  experimental: {
    serverComponentsExternalPackages: ['jspdf'],
  },
}
```

---

## 📈 Escalabilidad

### Migrar a Base de Datos Remota

Para alta disponibilidad, considera:

1. **PostgreSQL** (Recomendado)
   - Vercel Postgres
   - Supabase
   - Railway Postgres

2. **MySQL**
   - PlanetScale
   - Railway MySQL

3. **MongoDB**
   - MongoDB Atlas

### Ejemplo: Migración a PostgreSQL

```typescript
// lib/db-postgres.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function saveAreas(areas: WorkArea[]) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM activities')
    await client.query('DELETE FROM areas')
    
    for (const area of areas) {
      await client.query(
        'INSERT INTO areas (id, name, percentage, color) VALUES ($1, $2, $3, $4)',
        [area.id, area.name, area.percentage, area.color]
      )
      
      for (const activity of area.activities) {
        await client.query(
          'INSERT INTO activities (id, area_id, name, percentage) VALUES ($1, $2, $3, $4)',
          [activity.id, area.id, activity.name, activity.percentage]
        )
      }
    }
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
```

---

## 🎯 Recomendaciones Finales

### Para Uso Personal/Demo
✅ **Vercel** - Más simple, gratis, rápido

### Para Producción Pequeña
✅ **Railway** - Soporte SQLite, económico

### Para Producción Empresarial
✅ **VPS + PostgreSQL** - Control total, escalable

---

**¿Necesitas ayuda con el despliegue?**  
Abre un issue en el [repositorio](https://github.com/DSArevalo4/dashboardMAtrix/issues)
