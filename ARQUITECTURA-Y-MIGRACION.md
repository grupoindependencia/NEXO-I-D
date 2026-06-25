# Arquitectura y guía de migración · cii-comunicaciones

Documento técnico para **migrar el proyecto a un servidor**. Describe cómo está montado hoy (base de datos + web)
y entrega un runbook paso a paso para dejarlo corriendo en producción.

> Resumen en una línea: **3 piezas** — una base de datos PostgreSQL, una API Node/Express, y una SPA React estática.
> No hay estado en disco fuera de la base de datos (las imágenes y los STL son archivos estáticos del frontend).

---

## 1. Stack

| Capa | Tecnología | Puerto (dev) |
|------|-----------|--------------|
| **Frontend** | React 18 + Vite 5 + TypeScript + React Router + Zustand + lucide-react + three.js | 5173 |
| **Backend** | Node 20 + Express 4 + Prisma 5 (cliente) / 5.22 (CLI) | 4000 |
| **Base de datos** | PostgreSQL 16 (nativo, fuera de Docker) | 5432 |
| **Auth** | Email + bcrypt + JWT (access + refresh) | — |
| **Admin BD** | pgAdmin (solo dev, vía Docker) | 5050 |

Build de producción: el **frontend** compila a archivos estáticos (`frontend/dist`) y el **backend** compila a JS
(`backend/dist`) que se ejecuta con `node dist/index.js`.

---

## 2. Diagrama de arquitectura

### Producción (objetivo de la migración — VM Linux única)

```
                         ┌─────────────────────────────────────────────────────┐
   Internet  ─── 443 ───▶│  nginx (TLS / reverse proxy)                        │
                         │                                                     │
                         │   /            ──▶  archivos estáticos  (frontend)  │
                         │   /api/*       ──▶  http://127.0.0.1:4000 (backend) │
                         └───────────────┬─────────────────────────────────────┘
                                         │ proxy_pass
                                         ▼
                         ┌─────────────────────────────────────────────────────┐
                         │  Node/Express  (PM2 o systemd)  ── puerto 4000       │
                         │  Prisma Client                                       │
                         └───────────────┬─────────────────────────────────────┘
                                         │ DATABASE_URL (TCP 5432)
                                         ▼
                         ┌─────────────────────────────────────────────────────┐
                         │  PostgreSQL 16   (localhost o servidor dedicado)     │
                         │  BD: cii_comunicaciones                              │
                         └─────────────────────────────────────────────────────┘
```

### Desarrollo actual (Windows + Docker)

```
  navegador ─▶ Vite dev (5173, contenedor) ─▶ API (4000, contenedor) ─▶ PostgreSQL nativo Windows (5432)
                                                  via host.docker.internal:5432
  pgAdmin (5050, contenedor) ─────────────────────────────────────────▶ host.docker.internal:5432
```

> Nota: PostgreSQL **no** está en Docker; corre nativo en el host y los contenedores lo alcanzan por
> `host.docker.internal`. En el servidor esto desaparece: la API apunta directo a `localhost:5432` (o a la IP de la BD).

---

## 3. Base de datos (PostgreSQL + Prisma)

- **Motor**: PostgreSQL 16. Base de datos: `cii_comunicaciones`.
- **ORM**: Prisma. Esquema en [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).
- **Convención**: tablas/columnas en `snake_case` (mapeadas a `camelCase` en TS con `@map`/`@@map`).
- **Auditoría**: `created_by / created_at / modified_by / modified_at` en las entidades principales.
- **Soft delete**: `is_deleted / deleted_at / deleted_by` en entidades críticas (Proyecto, Obra, Nodo).

### Modelos (tablas)

`usuarios`, `refresh_tokens`, `proyectos`, `protocolo_secciones`, `obras`, `nodos`, `nodo_metricas`,
`checklists_diarios`, `reportes_semanales`, `checklist_plantillas`, `checklist_plantilla_items`,
`checklist_ejecuciones`, `checklist_respuestas`, `incidentes`.

### Migraciones

Carpeta [`backend/prisma/migrations/`](backend/prisma/migrations/) — **3 migraciones** versionadas:
`20260610064459_init`, `20260610121039_add_proyecto_titulo`, `20260610164318_item_recurrente`.
En el servidor se aplican con `prisma migrate deploy` (idempotente, no destruye datos).

### Seed

[`backend/prisma/seed.ts`](backend/prisma/seed.ts) crea/actualiza (upsert) los datos base: usuarios del equipo,
el proyecto `netsensor` (mostrado como "Conectividad"), las secciones del protocolo, obras y plantillas de checklist.
Es **idempotente**. Solo es necesario la primera vez (o para refrescar datos base).

- Credenciales iniciales del seed: `rodrigo.solis@cindependencia.cl` / `Independencia2026`.

### Migrar los datos existentes

Si quieres conservar los datos actuales (usuarios, checklists ejecutados, etc.) en vez de re-sembrar:

```bash
# En el equipo actual (origen)
pg_dump -h localhost -U postgres -d cii_comunicaciones -Fc -f cii_comunicaciones.dump

# En el servidor (destino)
createdb -U postgres cii_comunicaciones
pg_restore -h localhost -U postgres -d cii_comunicaciones --no-owner cii_comunicaciones.dump
```

> Si la BD destino se crea desde cero, basta `prisma migrate deploy` + `npm run seed` y **no** necesitas el dump.

---

## 4. Backend (Node + Express + Prisma)

Carpeta [`backend/`](backend/). Entry point: [`backend/src/index.ts`](backend/src/index.ts).

- **Servidor**: Express. Middlewares: `helmet`, `cors` (origen configurable), `express.json` (límite 10 MB),
  `cookie-parser`, `morgan` (solo si `NODE_ENV !== production`).
- **Healthcheck**: `GET /api/health`.
- **Grupos de rutas**:
  - `/api/auth` — login, refresh, logout, `me` (JWT).
  - `/api/proyectos` — lista/detalle de proyectos y secciones de protocolo.
  - `/api/nodos` — nodos NetSensor.
  - `/api/checklists` — plantillas, ejecuciones, respuestas.
- **Auth**: bcrypt para password; JWT de acceso (`JWT_EXPIRES_IN`, def. 2h) + refresh (`JWT_REFRESH_EXPIRES_IN`, def. 7d).
  Middleware `requireAuth` (header `Authorization: Bearer <token>`) y `requireRole(...)`.
- **Prisma Client**: singleton en [`backend/src/lib/prisma.ts`](backend/src/lib/prisma.ts).
- **Puerto**: `process.env.PORT || 4000`.

### Scripts (`backend/package.json`)

| Script | Comando | Uso |
|--------|---------|-----|
| `dev` | `tsx watch src/index.ts` | desarrollo |
| `build` | `tsc` → `dist/` | producción |
| `start` | `node dist/index.js` | producción |
| `prisma:deploy` | `prisma migrate deploy` | aplicar migraciones en server |
| `seed` | `tsx prisma/seed.ts` | datos base |

> **Gotcha de migración**: el `start` corre `dist/index.js`, pero Prisma necesita el **cliente generado**
> (`prisma generate`) y las variables de entorno cargadas. `index.ts` hace `import 'dotenv/config'`, así que
> un archivo `backend/.env` en el server es suficiente; **el `seed.ts` NO carga dotenv solo** — pásale
> `DATABASE_URL` por entorno al ejecutarlo.

---

## 5. Frontend (React + Vite)

Carpeta [`frontend/`](frontend/). Entry: `src/main.tsx` → `src/App.tsx`.

- **Ruteo**: React Router con `BrowserRouter` (rutas del lado del cliente, ej. `/proyectos/netsensor/activacion`).
  ⚠️ Requiere **fallback a `index.html`** en el servidor estático (si no, recargar una ruta profunda da 404).
- **Estado de auth**: Zustand. El **access token y refresh token se guardan en `localStorage`**
  (`cii_access_token`, `cii_refresh_token`). El cliente HTTP ([`src/lib/api.ts`](frontend/src/lib/api.ts)) agrega
  el `Bearer` y hace auto-refresh ante un 401.
- **URL de la API**: `import.meta.env.VITE_API_URL` (default `http://localhost:4000`). **Se hornea en el build** →
  hay que fijarla **antes** de `npm run build`.
- **Contenido del protocolo**: vive en el **código** (`src/pages/protocolo/sections/*.tsx`), no en la BD. La BD solo
  aporta el banner del proyecto (título/eyebrow/subtítulo) y los datos dinámicos (checklists, usuarios).
- **Assets**: `frontend/public/` (logos y `cad/stl_data.js` con los modelos 3D en base64).
- **Dependencia externa en runtime**: la sección *Hardware* carga **three.js/OrbitControls/STLLoader desde CDN**
  (`cdnjs`/`jsdelivr`). Si el servidor o los clientes no tienen salida a esos CDN, el visor 3D no carga (el resto sí).
  Considerar self-hostear esos scripts.

### Scripts (`frontend/package.json`)

| Script | Comando | Uso |
|--------|---------|-----|
| `dev` | `vite` | desarrollo (5173) |
| `build` | `tsc -b && vite build` → `dist/` | producción (estáticos) |
| `preview` | `vite preview` | previsualizar build |

---

## 6. Variables de entorno

Plantilla en [`.env.example`](.env.example). En el servidor conviene **separar** las del backend de las del frontend.

### Backend (`backend/.env`)

| Variable | Ejemplo / default | Notas |
|----------|-------------------|-------|
| `DATABASE_URL` | `postgresql://postgres:PASS@localhost:5432/cii_comunicaciones` | **Cambiar** `host.docker.internal` → `localhost`/IP de la BD |
| `JWT_SECRET` | (aleatorio largo) | `openssl rand -base64 64` |
| `JWT_REFRESH_SECRET` | (otro aleatorio) | distinto al anterior |
| `JWT_EXPIRES_IN` | `2h` | |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | |
| `BCRYPT_COST` | `10` (subir a 12 en prod) | |
| `CORS_ORIGIN` | `https://conectividad.tudominio.cl` | origen público del frontend (coma-separado si varios) |
| `PORT` | `4000` | puerto interno de la API |
| `NODE_ENV` | `production` | desactiva morgan y logs verbosos |

### Frontend (build-time)

| Variable | Ejemplo | Notas |
|----------|---------|-------|
| `VITE_API_URL` | `https://conectividad.tudominio.cl` | si nginx hace proxy de `/api`, usar el **mismo origen** (sin `:4000`) |

> Recomendado: servir frontend y API bajo **el mismo dominio** y que nginx enrute `/api`. Así `VITE_API_URL`
> puede ser la raíz del sitio y se evitan problemas de CORS y de mixed content.

---

## 7. Runbook de migración (VM Linux — opción recomendada)

Asume Ubuntu/Debian, un solo servidor con la BD local. Ajustar usuarios/paths según tu entorno.

### 7.1 Provisionar

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 16 + nginx
sudo apt-get install -y postgresql-16 nginx
sudo npm install -g pm2          # gestor de procesos para el backend
```

### 7.2 Base de datos

```bash
sudo -u postgres psql -c "CREATE DATABASE cii_comunicaciones;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'PASS_FUERTE';"
# (o crear un usuario dedicado con permisos sobre la BD)
```

### 7.3 Backend

```bash
cd /opt/cii-comunicaciones/backend
# crear backend/.env con las variables de la sección 6
npm ci
npx prisma generate
npx prisma migrate deploy        # crea el esquema
npm run seed                     # solo la primera vez (o restaurar dump, sección 3)
npm run build                    # compila a dist/
pm2 start dist/index.js --name cii-api --update-env
pm2 save && pm2 startup          # arranque automático
```

### 7.4 Frontend

```bash
cd /opt/cii-comunicaciones/frontend
echo 'VITE_API_URL=https://conectividad.tudominio.cl' > .env.production
npm ci
npm run build                    # genera dist/ con estáticos
sudo mkdir -p /var/www/cii && sudo cp -r dist/* /var/www/cii/
```

### 7.5 nginx (reverse proxy + SPA fallback + proxy de API)

```nginx
server {
    listen 80;
    server_name conectividad.tudominio.cl;

    root /var/www/cii;
    index index.html;

    # SPA: cualquier ruta desconocida cae a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API → backend Node
    location /api/ {
        proxy_pass         http://127.0.0.1:4000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cii /etc/nginx/sites-enabled/cii
sudo nginx -t && sudo systemctl reload nginx
# TLS gratis:
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d conectividad.tudominio.cl
```

### 7.6 Verificación

```bash
curl -s https://conectividad.tudominio.cl/api/health      # {"ok":true,...}
# Abrir el sitio, login con las credenciales del seed, recargar una ruta profunda (no debe dar 404).
```

---

## 8. Checklist de seguridad para producción

- [ ] `JWT_SECRET` y `JWT_REFRESH_SECRET` aleatorios y distintos (no los del `.env.example`).
- [ ] `BCRYPT_COST` ≥ 12.
- [ ] `CORS_ORIGIN` = dominio real (no `*`, no `localhost`).
- [ ] `NODE_ENV=production`.
- [ ] TLS (HTTPS) habilitado; redirigir 80 → 443.
- [ ] PostgreSQL **no** expuesto a internet (solo localhost o red privada); password fuerte.
- [ ] Cambiar la contraseña del usuario admin tras el primer login.
- [ ] Backups automáticos de PostgreSQL (`pg_dump` por cron).
- [ ] Firewall: abrir solo 80/443 (y 22 restringido).

---

## 9. Deuda técnica / notas relevantes para la migración

- **`DATABASE_URL` con `host.docker.internal`**: es un artefacto de desarrollo en Windows+Docker. En el servidor
  debe ser `localhost`/IP de la BD.
- **Dockerfiles actuales son solo de desarrollo** (`Dockerfile.dev`, comando `npm run dev`). Para desplegar en
  contenedores de producción hay que crear Dockerfiles multi-stage (build + runtime) — no existen aún.
- **Tokens en `localStorage`**: simple pero expuesto a XSS. Si se requiere endurecer, migrar a cookies `httpOnly`.
- **three.js desde CDN** en la sección Hardware: depende de salida a `cdnjs`/`jsdelivr`. Self-hostear si el entorno
  es cerrado.
- **No hay endpoint de cambio de contraseña** en el flujo actual; el seed fija una inicial. Conviene agregarlo.
- **Sin Docker en la BD**: la BD vive fuera de los contenedores; al migrar, decidir si la BD va en la misma VM o en
  un servidor/servicio gestionado aparte (ajustar `DATABASE_URL` y reglas de red).

---

**Responsable**: Rodrigo Solís · Jefe I+D Hardware · rodrigo.solis@cindependencia.cl
