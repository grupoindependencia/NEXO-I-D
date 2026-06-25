import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// Roles válidos del sistema (ver schema.prisma · usuarioRol)
const ROLES = ['Admin', 'DataOwner', 'Steward', 'Analyst', 'Viewer'] as const;
const BCRYPT_COST = parseInt(process.env.BCRYPT_COST || '10', 10);

// Campos seguros (nunca exponer usuarioPassword)
const safeSelect = {
  usuarioId: true,
  usuarioCorreo: true,
  usuarioNombre: true,
  usuarioRol: true,
  usuarioCargo: true,
  usuarioDepartamento: true,
  usuarioActivo: true,
  usuarioProveedorAuth: true,
  usuarioFechaCreacion: true,
  usuarioUltimoLogin: true,
} as const;

/**
 * GET /api/usuarios
 * Lista todos los usuarios (activos primero). Solo Admin / DataOwner.
 */
router.get('/', requireRole('Admin', 'DataOwner'), async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany({
    select: safeSelect,
    orderBy: [{ usuarioActivo: 'desc' }, { usuarioNombre: 'asc' }],
  });
  res.json(usuarios);
});

const createSchema = z.object({
  correo: z.string().email(),
  nombre: z.string().min(2).max(255),
  password: z.string().min(8).max(72), // bcrypt opera sobre los primeros 72 bytes
  rol: z.enum(ROLES),
  cargo: z.string().max(150).nullish(),
  departamento: z.string().max(100).nullish(),
});

/**
 * POST /api/usuarios
 * Crea un usuario con password local (bcrypt). Solo Admin / DataOwner.
 */
router.post('/', requireRole('Admin', 'DataOwner'), async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.errors });
  }
  const { correo, nombre, password, rol, cargo, departamento } = parsed.data;

  try {
    const usuario = await prisma.usuario.create({
      data: {
        usuarioCorreo: correo.toLowerCase().trim(),
        usuarioNombre: nombre.trim(),
        usuarioPassword: await bcrypt.hash(password, BCRYPT_COST),
        usuarioRol: rol,
        usuarioCargo: cargo?.trim() || null,
        usuarioDepartamento: departamento?.trim() || null,
        usuarioActivo: true,
      },
      select: safeSelect,
    });
    res.status(201).json(usuario);
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
    }
    console.error('[POST /usuarios]', e);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

const updateSchema = z.object({
  nombre: z.string().min(2).max(255).optional(),
  rol: z.enum(ROLES).optional(),
  cargo: z.string().max(150).nullish(),
  departamento: z.string().max(100).nullish(),
  activo: z.boolean().optional(),
  password: z.string().min(8).max(72).optional(),
});

/**
 * PATCH /api/usuarios/:id
 * Edita datos, estado (activo) o resetea password. Solo Admin / DataOwner.
 */
router.patch('/:id', requireRole('Admin', 'DataOwner'), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.errors });
  }
  const { nombre, rol, cargo, departamento, activo, password } = parsed.data;

  const target = await prisma.usuario.findUnique({ where: { usuarioId: id } });
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });

  // Guardas anti-lockout sobre la propia cuenta
  if (id === req.usuario!.usuarioId) {
    if (activo === false) return res.status(409).json({ error: 'No puedes desactivar tu propia cuenta' });
    if (rol && rol !== req.usuario!.rol) {
      return res.status(409).json({ error: 'No puedes cambiar tu propio rol' });
    }
  }

  const data: any = {};
  if (nombre !== undefined) data.usuarioNombre = nombre.trim();
  if (rol !== undefined) data.usuarioRol = rol;
  if (cargo !== undefined) data.usuarioCargo = cargo?.trim() || null;
  if (departamento !== undefined) data.usuarioDepartamento = departamento?.trim() || null;
  if (activo !== undefined) {
    data.usuarioActivo = activo;
    data.usuarioFechaDesactivacion = activo ? null : new Date();
  }
  if (password !== undefined) data.usuarioPassword = await bcrypt.hash(password, BCRYPT_COST);

  const usuario = await prisma.usuario.update({
    where: { usuarioId: id },
    data,
    select: safeSelect,
  });
  res.json(usuario);
});

export default router;
