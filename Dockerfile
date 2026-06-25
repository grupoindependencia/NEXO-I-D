# ============================================================
#  NEXO I+D · Imagen única para Cloud Run
#  Un solo proceso Node/Express sirve la API (/api/*) y el SPA (client/).
#  Contexto de build = raíz del monorepo.
# ============================================================

# ── Stage 1: Build del frontend (Vite → estáticos) ──────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /fe

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

# VITE_API_URL="" → el cliente llama a /api/... en el mismo origen (lo sirve Express).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
# Client ID público de Google (habilita el botón SSO en el frontend)
ARG VITE_GOOGLE_CLIENT_ID=""
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build      # genera /fe/dist

# ── Stage 2: Build del backend (TypeScript + Prisma Client) ─────────────────
FROM node:20-alpine AS backend
WORKDIR /app
RUN apk add --no-cache openssl python3 make g++

COPY backend/package*.json backend/tsconfig.json ./
RUN npm ci

COPY backend/prisma ./prisma
COPY backend/src ./src
RUN npx prisma generate && npm run build   # genera /app/dist

# ── Stage 3: Runtime ────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# Dependencias (incluye Prisma Client generado, prisma CLI y tsx para migrate/seed)
COPY backend/package*.json ./
COPY --from=backend /app/node_modules ./node_modules
COPY --from=backend /app/dist ./dist
COPY --from=backend /app/prisma ./prisma

# Frontend compilado servido por Express en ../client (ver backend/src/index.ts)
COPY --from=frontend /fe/dist ./client

EXPOSE 8080

# Aplica migraciones pendientes (advisory-lock de Prisma → seguro) y arranca el server.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
