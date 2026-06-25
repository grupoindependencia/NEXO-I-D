import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

/**
 * GET /api/proyectos
 * Lista todos los proyectos activos (no eliminados).
 */
router.get('/', async (_req: Request, res: Response) => {
  const proyectos = await prisma.proyecto.findMany({
    where: { isDeleted: false },
    orderBy: { proyectoOrden: 'asc' },
    include: {
      _count: {
        select: { nodos: { where: { isDeleted: false } }, obras: { where: { isDeleted: false } } },
      },
    },
  });
  res.json(proyectos);
});

/**
 * GET /api/proyectos/:codigo
 * Detalle de un proyecto por código (ej. "netsensor").
 */
router.get('/:codigo', async (req: Request, res: Response) => {
  const proyecto = await prisma.proyecto.findUnique({
    where: { proyectoCodigo: req.params.codigo },
    include: {
      secciones: {
        where: { seccionVisible: true },
        orderBy: { seccionOrden: 'asc' },
      },
    },
  });
  if (!proyecto || proyecto.isDeleted) {
    return res.status(404).json({ error: 'Proyecto no encontrado' });
  }
  res.json(proyecto);
});

/**
 * GET /api/proyectos/:codigo/secciones/:seccionCodigo
 * Detalle de una sección del protocolo.
 */
router.get('/:codigo/secciones/:seccionCodigo', async (req: Request, res: Response) => {
  const proyecto = await prisma.proyecto.findUnique({
    where: { proyectoCodigo: req.params.codigo },
  });
  if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
  const seccion = await prisma.protocoloSeccion.findUnique({
    where: { proyectoId_seccionCodigo: { proyectoId: proyecto.proyectoId, seccionCodigo: req.params.seccionCodigo } },
  });
  if (!seccion) return res.status(404).json({ error: 'Sección no encontrada' });
  res.json(seccion);
});

/**
 * POST /api/proyectos
 * Crea un nuevo proyecto con sección resumen por defecto.
 * Solo Admin y DataOwner.
 */
router.post('/', requireRole('Admin', 'DataOwner'), async (req: Request, res: Response) => {
  try {
    const { nombre, codigo, eyebrow, lifecycle } = req.body;
    if (!nombre?.trim() || !codigo?.trim()) {
      return res.status(400).json({ error: 'Nombre y código son obligatorios' });
    }
    const slugCodigo = (codigo as string).toLowerCase().trim();
    const existing = await prisma.proyecto.findUnique({ where: { proyectoCodigo: slugCodigo } });
    if (existing) {
      return res.status(409).json({ error: `El código "${slugCodigo}" ya está en uso` });
    }
    const maxOrden = await prisma.proyecto.aggregate({ _max: { proyectoOrden: true } });
    const orden = (maxOrden._max.proyectoOrden ?? 0) + 1;
    const proyecto = await prisma.proyecto.create({
      data: {
        proyectoCodigo:   slugCodigo,
        proyectoNombre:   nombre.trim(),
        proyectoEyebrow:  eyebrow?.trim() || 'Hardware I+D',
        proyectoLifecycle: lifecycle || 'investigacion',
        proyectoOrden:    orden,
        createdBy:        req.usuario!.usuarioId,
      },
    });
    await prisma.protocoloSeccion.create({
      data: {
        proyectoId:    proyecto.proyectoId,
        seccionCodigo: 'resumen',
        seccionTitulo: 'Resumen',
        seccionOrden:  1,
        createdBy:     req.usuario!.usuarioId,
      },
    });
    res.status(201).json(proyecto);
  } catch (err) {
    console.error('[POST /proyectos]', err);
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
});

/**
 * PATCH /api/proyectos/:codigo
 * Actualiza campos editables de un proyecto (lifecycle, relacionado).
 * Solo Admin y DataOwner.
 */
router.patch('/:codigo', requireRole('Admin', 'DataOwner'), async (req: Request, res: Response) => {
  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { proyectoCodigo: req.params.codigo },
    });
    if (!proyecto || proyecto.isDeleted) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const { lifecycle, relacionado, nombre, eyebrow } = req.body;
    const updated = await prisma.proyecto.update({
      where: { proyectoCodigo: req.params.codigo },
      data: {
        ...(lifecycle   !== undefined && { proyectoLifecycle:   lifecycle }),
        ...(relacionado !== undefined && { proyectoRelacionado: relacionado ?? null }),
        ...(nombre      !== undefined && { proyectoNombre:      nombre }),
        ...(eyebrow     !== undefined && { proyectoEyebrow:     eyebrow }),
        modifiedBy: req.usuario!.usuarioId,
        modifiedAt: new Date(),
      },
    });
    res.json(updated);
  } catch (err) {
    console.error('[PATCH /proyectos/:codigo]', err);
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
});

export default router;
