#!/bin/sh
# ============================================================
#  Entrypoint del backend cii-comunicaciones (desarrollo)
#  - Espera que PostgreSQL esté listo
#  - Aplica migraciones Prisma
#  - Siembra datos iniciales si la BD está vacía
#  - Arranca el dev server
# ============================================================
set -e

echo "[entrypoint] Esperando PostgreSQL..."
# El depends_on con healthcheck ya garantiza esto, pero por las dudas
for i in $(seq 1 30); do
  if npx --yes prisma db execute --stdin <<< "SELECT 1" >/dev/null 2>&1; then
    break
  fi
  echo "[entrypoint] PostgreSQL aún no listo (intento $i/30)..."
  sleep 2
done

echo "[entrypoint] Aplicando migraciones Prisma..."
# migrate deploy aplica migraciones existentes; si no hay carpeta de migraciones,
# usamos db push para sincronizar el schema directamente (modo dev sin migraciones formales)
if [ -d "/app/prisma/migrations" ] && [ -n "$(ls -A /app/prisma/migrations 2>/dev/null)" ]; then
  npx prisma migrate deploy
else
  echo "[entrypoint] Sin migraciones previas. Ejecutando db push..."
  npx prisma db push --skip-generate
fi

echo "[entrypoint] Verificando si hay que sembrar datos..."
USER_COUNT=$(npx --yes prisma db execute --stdin <<< "SELECT COUNT(*) FROM usuarios" 2>/dev/null | grep -E '^\s*[0-9]+' | head -1 | tr -d ' ' || echo "0")

# Heurística simple: si no podemos contar o el conteo es 0, sembramos
if ! npx --yes prisma db execute --stdin <<< "SELECT 1 FROM usuarios LIMIT 1" >/dev/null 2>&1; then
  echo "[entrypoint] Tabla usuarios vacía o sin datos. Sembrando..."
  npm run seed
else
  echo "[entrypoint] Tabla usuarios ya contiene datos. Saltando seed."
fi

echo "[entrypoint] Arrancando dev server..."
exec npm run dev
