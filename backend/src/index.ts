import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import proyectosRoutes from './routes/proyectos';
import nodosRoutes from './routes/nodos';
import checklistsRoutes from './routes/checklists';
import usuariosRoutes from './routes/usuarios';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middlewares
// CSP/COEP desactivados: este servicio también sirve el SPA (y three.js desde CDN),
// que el Content-Security-Policy por defecto de helmet bloquearía.
// COOP en 'same-origin-allow-popups': el COOP 'same-origin' por defecto rompe el
// popup de Google Sign-In (corta window.opener y el popup queda en blanco).
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  }),
);
app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/nodos', nodosRoutes);
app.use('/api/checklists', checklistsRoutes);
app.use('/api/usuarios', usuariosRoutes);

// 404 solo para rutas de API no encontradas
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado', path: req.path });
});

// ============================================================
//  Frontend estático (SPA) servido por el mismo servicio
//  En producción el build de Vite se copia a ../client (ver Dockerfile raíz).
//  CLIENT_DIR permite sobrescribir la ruta si se requiere.
// ============================================================
const clientDir = process.env.CLIENT_DIR || path.join(__dirname, '../client');
app.use(express.static(clientDir, { index: false, maxAge: '1y' }));

// Fallback SPA: cualquier otra ruta devuelve index.html (React Router del lado del cliente)
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
});

app.listen(PORT, () => {
  console.log(`[cii-backend] API escuchando en :${PORT}`);
  console.log(`[cii-backend] CORS habilitado para: ${CORS_ORIGIN}`);
  console.log(`[cii-backend] SPA servido desde: ${clientDir}`);
});
