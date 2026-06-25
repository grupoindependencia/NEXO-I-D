# cii-comunicaciones

Plataforma de gestión de proyectos de I+D Hardware · **Constructora Independencia**.

Punto de partida: protocolos operativos del proyecto **NetSensor** (monitoreo de calidad de red en obras). La estructura está pensada para escalar a los demás proyectos del departamento (LPR, Face Recognition, Cubicación, IVR).

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript + lucide-react |
| Backend | Node 20 + Express + Prisma |
| Base de datos | **PostgreSQL 16 nativo en host** (NO en Docker) |
| Contenedores | Docker + Docker Compose (frontend, backend, pgAdmin) |
| Autenticación | Login email + bcrypt + JWT (preparado para Google SSO) |

Reglas técnicas vinculantes: ver `CLAUDE.md` en la raíz del repositorio de proyectos.

---

## Requisitos previos

1. **Docker Desktop** instalado y corriendo en Windows.
2. **PostgreSQL 16** instalado nativamente en Windows (no en Docker). Puerto por defecto `5432`. Crear base de datos `cii_comunicaciones`.
3. **Node.js 20** y `npm` (solo si se quiere ejecutar fuera de Docker).
4. **pgAdmin** (ya viene en docker-compose en `http://localhost:5050`).

---

## Setup en 5 pasos

### 1. Crear base de datos local

Abre `psql` o pgAdmin y ejecuta:

```sql
CREATE DATABASE cii_comunicaciones;
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con la contraseña real de PostgreSQL en `DATABASE_URL`.

### 3. Levantar contenedores

```bash
docker compose up -d
```

Esto inicia:
- **Backend** en `http://localhost:4000`
- **Frontend** en `http://localhost:5173`
- **pgAdmin** en `http://localhost:5050`

### 4. Aplicar migraciones de Prisma

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed
```

El `seed` crea el usuario administrador inicial:
- **Email**: `rodrigo.solis@cindependencia.cl`
- **Password**: `Independencia2026` (cambiar al primer login)

### 5. Acceder al sistema

Abrir `http://localhost:5173` en el navegador.

---

## Estructura

```
cii-comunicaciones/
├── backend/                 # Node + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── routes/          # Endpoints REST
│   │   ├── middleware/      # JWT, errores, CORS
│   │   ├── services/        # Lógica de negocio
│   │   ├── lib/             # Helpers (prisma client, jwt, bcrypt)
│   │   └── index.ts
│   ├── Dockerfile.dev
│   └── package.json
├── frontend/                # React + Vite + TS
│   ├── public/
│   │   ├── logo.png
│   │   ├── logo-icon.png
│   │   └── cad/             # STLs base64
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # AppLayout, Sidebar, PageHeader
│   │   │   └── ui/          # Card, Button, Callout
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── protocolo/   # Secciones del protocolo
│   │   ├── hooks/
│   │   ├── lib/             # API client, auth context
│   │   └── App.tsx
│   ├── Dockerfile.dev
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Comandos útiles

```bash
# Ver logs en vivo
docker compose logs -f backend
docker compose logs -f frontend

# Abrir shell del backend
docker compose exec backend sh

# Crear nueva migración
docker compose exec backend npx prisma migrate dev --name nombre_descriptivo

# Prisma Studio (GUI de BD)
docker compose exec backend npx prisma studio

# Reconstruir contenedores tras cambio en package.json
docker compose up -d --build

# Detener todo
docker compose down
```

---

## Conexión a PostgreSQL desde pgAdmin

Al abrir pgAdmin (`localhost:5050`) y agregar un nuevo servidor:

- **Name**: cii-comunicaciones
- **Host**: `host.docker.internal`
- **Port**: 5432
- **Database**: cii_comunicaciones
- **Username**: postgres
- **Password**: (la de tu PostgreSQL nativo)

---

## Roadmap

- [x] Protocolo NetSensor (estático en HTML)
- [ ] Migración a React (Fase 4 en curso)
- [ ] Backend con auth + CRUD proyectos / nodos
- [ ] Importar checklist diario / reporte semanal automatizado
- [ ] Google SSO (Fase 2)
- [ ] LPR, Face Recognition, Cubicación, IVR

---

**Responsable**: Rodrigo Solís · Jefe I+D Hardware
**Contacto**: rodrigo.solis@cindependencia.cl
