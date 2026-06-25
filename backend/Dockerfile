# ── Producción: Backend NEXO I+D ────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl python3 make g++

COPY package*.json tsconfig.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate && npm run build

EXPOSE 4000

# Aplica migraciones pendientes y arranca el servidor compilado
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
