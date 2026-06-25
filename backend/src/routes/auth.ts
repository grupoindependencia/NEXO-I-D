import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  correo: z.string().email(),
  password: z.string().min(6),
});

/**
 * POST /api/auth/login
 * Body: { correo, password }
 * Retorna: { accessToken, refreshToken, usuario }
 */
router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.errors });
  }
  const { correo, password } = parsed.data;

  const usuario = await prisma.usuario.findUnique({ where: { usuarioCorreo: correo.toLowerCase() } });
  if (!usuario || !usuario.usuarioActivo) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  if (!usuario.usuarioPassword) {
    return res.status(401).json({ error: 'Esta cuenta usa SSO, no password' });
  }

  const valid = await bcrypt.compare(password, usuario.usuarioPassword);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const payload = {
    usuarioId: usuario.usuarioId,
    correo: usuario.usuarioCorreo,
    rol: usuario.usuarioRol,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Persistir refresh token
  await prisma.refreshToken.create({
    data: {
      refreshTokenToken: refreshToken,
      refreshTokenExpira: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      usuarioId: usuario.usuarioId,
    },
  });

  await prisma.usuario.update({
    where: { usuarioId: usuario.usuarioId },
    data: { usuarioUltimoLogin: new Date() },
  });

  res.json({
    accessToken,
    refreshToken,
    usuario: {
      usuarioId: usuario.usuarioId,
      correo: usuario.usuarioCorreo,
      nombre: usuario.usuarioNombre,
      rol: usuario.usuarioRol,
      cargo: usuario.usuarioCargo,
      departamento: usuario.usuarioDepartamento,
    },
  });
});

/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 */
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken requerido' });

  try {
    const payload = verifyRefreshToken(refreshToken);
    const stored = await prisma.refreshToken.findUnique({ where: { refreshTokenToken: refreshToken } });
    if (!stored || stored.refreshTokenRevocado || stored.refreshTokenExpira < new Date()) {
      return res.status(401).json({ error: 'Refresh token inválido o expirado' });
    }
    const accessToken = signAccessToken({
      usuarioId: payload.usuarioId,
      correo: payload.correo,
      rol: payload.rol,
    });
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
});

/**
 * POST /api/auth/logout
 * Header: Authorization: Bearer <accessToken>
 * Body: { refreshToken }
 */
router.post('/logout', requireAuth, async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { refreshTokenToken: refreshToken },
      data: { refreshTokenRevocado: true },
    });
  }
  res.json({ ok: true });
});

/**
 * GET /api/auth/me
 * Retorna datos del usuario autenticado.
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const usuario = await prisma.usuario.findUnique({
    where: { usuarioId: req.usuario!.usuarioId },
    select: {
      usuarioId: true,
      usuarioCorreo: true,
      usuarioNombre: true,
      usuarioRol: true,
      usuarioCargo: true,
      usuarioDepartamento: true,
      usuarioUltimoLogin: true,
    },
  });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({
    usuarioId: usuario.usuarioId,
    correo: usuario.usuarioCorreo,
    nombre: usuario.usuarioNombre,
    rol: usuario.usuarioRol,
    cargo: usuario.usuarioCargo,
    departamento: usuario.usuarioDepartamento,
    ultimoLogin: usuario.usuarioUltimoLogin,
  });
});

export default router;
