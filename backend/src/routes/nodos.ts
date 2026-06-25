import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

/**
 * GET /api/nodos
 * Lista todos los nodos. Filtro opcional por proyecto (?proyecto=netsensor)
 */
router.get('/', async (req: Request, res: Response) => {
  const proyectoCodigo = req.query.proyecto as string | undefined;
  const where: any = { isDeleted: false };
  if (proyectoCodigo) {
    const p = await prisma.proyecto.findUnique({ where: { proyectoCodigo } });
    if (!p) return res.json([]);
    where.proyectoId = p.proyectoId;
  }
  const nodos = await prisma.nodo.findMany({
    where,
    orderBy: { nodoUltimoVisto: 'desc' },
    include: { obra: { select: { obraNombre: true, obraCodigo: true } } },
  });
  res.json(nodos);
});

/**
 * GET /api/nodos/:mac
 * Detalle de un nodo por MAC.
 */
router.get('/:mac', async (req: Request, res: Response) => {
  const nodo = await prisma.nodo.findUnique({
    where: { nodoMac: req.params.mac },
    include: { obra: true, proyecto: true },
  });
  if (!nodo || nodo.isDeleted) return res.status(404).json({ error: 'Nodo no encontrado' });
  res.json(nodo);
});

/**
 * GET /api/nodos/:mac/metricas
 * Últimas N métricas de un nodo (?limit=100)
 */
router.get('/:mac/metricas', async (req: Request, res: Response) => {
  const limit = Math.min(parseInt((req.query.limit as string) || '100', 10), 500);
  const nodo = await prisma.nodo.findUnique({ where: { nodoMac: req.params.mac } });
  if (!nodo) return res.status(404).json({ error: 'Nodo no encontrado' });
  const metricas = await prisma.nodoMetrica.findMany({
    where: { nodoId: nodo.nodoId },
    orderBy: { metricaTimestamp: 'desc' },
    take: limit,
  });
  res.json(metricas);
});

export default router;
