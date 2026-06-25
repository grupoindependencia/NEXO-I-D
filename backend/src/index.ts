import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import proyectosRoutes from './routes/proyectos';
import nodosRoutes from './routes/nodos';
import checklistsRoutes from './routes/checklists';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middlewares
app.use(helmet());
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

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado', path: req.path });
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
});

app.listen(PORT, () => {
  console.log(`[cii-backend] API escuchando en :${PORT}`);
  console.log(`[cii-backend] CORS habilitado para: ${CORS_ORIGIN}`);
});
