import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  correo: z.string().email(),
  password: z.string().min(6),
});

// ── Google SSO (Identity Services · verificación de ID token) ────────────────
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_HOSTED_DOMAIN = process.env.GOOGLE_HOSTED_DOMAIN || '';
// Auto-provisiona usuarios nuevos del dominio como Viewer. Poner 'false' para modo allowlist.
const GOOGLE_AUTO_PROVISION = (process.env.GOOGLE_AUTO_PROVISION ?? 'true') !== 'false';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

type UsuarioSesion = {
  usuarioId: number;
  usuarioCorreo: string;
  usuarioNombre: string;
  usuarioRol: string;
  usuarioCargo: string | null;
  usuarioDepartamento: string | null;
};

/** Firma access+refresh, persiste el refresh, actualiza último login y responde. */
async function emitirSesion(usuario: UsuarioSesion, res: Response) {
  const payload = {
    usuarioId: usuario.usuarioId,
    correo: usuario.usuarioCorreo,
    rol: usuario.usuarioRol,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

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

  return res.json({
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
}

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

  return emitirSesion(usuario, res);
});

/**
 * POST /api/auth/google
 * Body: { credential }  ← ID token de Google Identity Services
 * Verifica el token, restringe al dominio corporativo, vincula/crea el usuario y emite sesión.
 */
router.post('/google', async (req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: 'Google SSO no está configurado' });
  }
  const { credential } = req.body;
  if (!credential || typeof credential !== 'string') {
    return res.status(400).json({ error: 'credential requerido' });
  }

  let ticketPayload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    ticketPayload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: 'Token de Google inválido' });
  }

  if (!ticketPayload?.email || !ticketPayload.email_verified) {
    return res.status(401).json({ error: 'Correo de Google no verificado' });
  }
  const correo = ticketPayload.email.toLowerCase();

  // Restricción de dominio corporativo (si está configurado)
  if (GOOGLE_HOSTED_DOMAIN) {
    const dominioOk = ticketPayload.hd === GOOGLE_HOSTED_DOMAIN || correo.endsWith(`@${GOOGLE_HOSTED_DOMAIN}`);
    if (!dominioOk) {
      return res.status(403).json({ error: `Solo se permiten cuentas @${GOOGLE_HOSTED_DOMAIN}` });
    }
  }

  let usuario = await prisma.usuario.findUnique({ where: { usuarioCorreo: correo } });

  if (usuario && !usuario.usuarioActivo) {
    return res.status(401).json({ error: 'Cuenta desactivada. Contacta al administrador.' });
  }

  if (!usuario) {
    if (!GOOGLE_AUTO_PROVISION) {
      return res.status(403).json({ error: 'Usuario no autorizado. Contacta al administrador.' });
    }
    usuario = await prisma.usuario.create({
      data: {
        usuarioCorreo: correo,
        usuarioNombre: ticketPayload.name || correo.split('@')[0],
        usuarioRol: 'Viewer',
        usuarioProveedorAuth: 'google',
        usuarioProveedorId: ticketPayload.sub,
        usuarioActivo: true,
      },
    });
  } else if (!usuario.usuarioProveedorId) {
    // Vincular la identidad de Google a una cuenta existente (sin tocar su rol ni su password local)
    usuario = await prisma.usuario.update({
      where: { usuarioId: usuario.usuarioId },
      data: { usuarioProveedorId: ticketPayload.sub },
    });
  }

  return emitirSesion(usuario, res);
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
