import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

/**
 * GET /api/checklists/plantillas?proyecto=netsensor
 * Lista las plantillas del proyecto indicado.
 */
router.get('/plantillas', async (req: Request, res: Response) => {
  const proyectoCodigo = req.query.proyecto as string | undefined;
  const where: any = { plantillaActiva: true };
  if (proyectoCodigo) {
    const p = await prisma.proyecto.findUnique({ where: { proyectoCodigo } });
    if (!p) return res.json([]);
    where.proyectoId = p.proyectoId;
  }
  const plantillas = await prisma.checklistPlantilla.findMany({
    where,
    orderBy: [{ plantillaFrecuencia: 'asc' }, { plantillaTitulo: 'asc' }],
    include: {
      items: {
        where: { itemActivo: true },
        orderBy: { itemOrden: 'asc' },
        include: { creador: { select: { usuarioNombre: true } } },
      },
      responsable: { select: { usuarioId: true, usuarioNombre: true, usuarioCargo: true } },
      supervisor:  { select: { usuarioId: true, usuarioNombre: true, usuarioCargo: true } },
    },
  });
  res.json(plantillas);
});

/**
 * POST /api/checklists/plantillas/:codigo/items
 * Agrega una tarea a una plantilla. Recurrente o única.
 * Body: { titulo, descripcion?, tipo?, obligatorio?, recurrente? }
 */
router.post('/plantillas/:codigo/items', async (req: Request, res: Response) => {
  const { titulo, descripcion, tipo, obligatorio, recurrente } = req.body;
  if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
    return res.status(400).json({ error: 'Título requerido' });
  }
  const plantilla = await prisma.checklistPlantilla.findUnique({
    where: { plantillaCodigo: req.params.codigo },
  });
  if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });

  // Calcular siguiente orden
  const last = await prisma.checklistPlantillaItem.findFirst({
    where: { plantillaId: plantilla.plantillaId },
    orderBy: { itemOrden: 'desc' },
  });
  const nextOrden = (last?.itemOrden || 0) + 1;

  const item = await prisma.checklistPlantillaItem.create({
    data: {
      plantillaId: plantilla.plantillaId,
      itemOrden: nextOrden,
      itemTitulo: titulo.trim(),
      itemDescripcion: descripcion?.trim() || null,
      itemTipo: tipo || 'check',
      itemObligatorio: obligatorio !== false,
      itemRecurrente: recurrente !== false,
      itemCreadoPor: req.usuario!.usuarioId,
    },
    include: { creador: { select: { usuarioNombre: true } } },
  });
  res.json(item);
});

/**
 * PUT /api/checklists/plantillas/items/:id
 * Edita un item de plantilla. Solo Admin/DataOwner o responsable de la plantilla.
 */
router.put('/plantillas/items/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const item = await prisma.checklistPlantillaItem.findUnique({
    where: { itemId: id },
    include: { plantilla: true },
  });
  if (!item) return res.status(404).json({ error: 'Item no encontrado' });
  const usuarioId = req.usuario!.usuarioId;
  const rol = req.usuario!.rol;
  const puede = item.itemCreadoPor === usuarioId
             || item.plantilla.responsableId === usuarioId
             || ['Admin', 'DataOwner'].includes(rol);
  if (!puede) return res.status(403).json({ error: 'Sin permisos' });

  const { titulo, descripcion, tipo, obligatorio, recurrente, orden } = req.body;
  const updated = await prisma.checklistPlantillaItem.update({
    where: { itemId: id },
    data: {
      ...(titulo !== undefined && { itemTitulo: titulo }),
      ...(descripcion !== undefined && { itemDescripcion: descripcion }),
      ...(tipo !== undefined && { itemTipo: tipo }),
      ...(obligatorio !== undefined && { itemObligatorio: obligatorio }),
      ...(recurrente !== undefined && { itemRecurrente: recurrente }),
      ...(orden !== undefined && { itemOrden: orden }),
    },
    include: { creador: { select: { usuarioNombre: true } } },
  });
  res.json(updated);
});

/**
 * DELETE /api/checklists/plantillas/items/:id
 * Archiva un item (soft delete). Solo el creador o un Admin/DataOwner.
 */
router.delete('/plantillas/items/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const item = await prisma.checklistPlantillaItem.findUnique({
    where: { itemId: id },
    include: { plantilla: true },
  });
  if (!item) return res.status(404).json({ error: 'Item no encontrado' });

  const usuarioId = req.usuario!.usuarioId;
  const rol = req.usuario!.rol;
  const puede = item.itemCreadoPor === usuarioId
             || item.plantilla.responsableId === usuarioId
             || ['Admin', 'DataOwner'].includes(rol);
  if (!puede) return res.status(403).json({ error: 'Sin permisos para archivar este item' });

  await prisma.checklistPlantillaItem.update({
    where: { itemId: id },
    data: { itemActivo: false },
  });
  res.json({ ok: true });
});

/**
 * GET /api/checklists/ejecuciones?proyecto=netsensor&estado=pendiente
 * Lista ejecuciones filtradas. Por defecto: las del usuario actual (como ejecutor o supervisor).
 */
router.get('/ejecuciones', async (req: Request, res: Response) => {
  const proyectoCodigo = req.query.proyecto as string | undefined;
  const estado = req.query.estado as string | undefined;
  const mias = req.query.mias === 'true';
  const usuarioId = req.usuario!.usuarioId;

  const where: any = {};
  if (estado) where.ejecucionEstado = estado;
  if (proyectoCodigo) {
    const p = await prisma.proyecto.findUnique({ where: { proyectoCodigo } });
    if (!p) return res.json([]);
    where.plantilla = { proyectoId: p.proyectoId };
  }
  if (mias) {
    where.OR = [
      { plantilla: { responsableId: usuarioId } },
      { plantilla: { supervisorId: usuarioId } },
      { ejecutadoPor: usuarioId },
    ];
  }

  const ejecuciones = await prisma.checklistEjecucion.findMany({
    where,
    orderBy: { ejecucionFechaProgramada: 'desc' },
    take: 100,
    include: {
      plantilla: {
        include: {
          responsable: { select: { usuarioNombre: true, usuarioCargo: true } },
          supervisor:  { select: { usuarioNombre: true, usuarioCargo: true } },
        },
      },
      ejecutor: { select: { usuarioId: true, usuarioNombre: true } },
      revisor:  { select: { usuarioId: true, usuarioNombre: true } },
    },
  });
  res.json(ejecuciones);
});

/**
 * GET /api/checklists/ejecuciones/:id
 * Detalle con items + respuestas.
 */
router.get('/ejecuciones/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const ejecucion = await prisma.checklistEjecucion.findUnique({
    where: { ejecucionId: id },
    include: {
      plantilla: {
        include: {
          items: { orderBy: { itemOrden: 'asc' } },
          responsable: { select: { usuarioNombre: true, usuarioCargo: true } },
          supervisor:  { select: { usuarioNombre: true, usuarioCargo: true } },
        },
      },
      respuestas: true,
      ejecutor: { select: { usuarioId: true, usuarioNombre: true } },
      revisor:  { select: { usuarioId: true, usuarioNombre: true } },
    },
  });
  if (!ejecucion) return res.status(404).json({ error: 'Ejecución no encontrada' });
  res.json(ejecucion);
});

/**
 * POST /api/checklists/plantillas/:codigo/ejecutar
 * Crea una nueva ejecución para la fecha indicada (o hoy por defecto).
 */
router.post('/plantillas/:codigo/ejecutar', async (req: Request, res: Response) => {
  const plantilla = await prisma.checklistPlantilla.findUnique({
    where: { plantillaCodigo: req.params.codigo },
  });
  if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });

  const fechaProgramada = req.body.fechaProgramada
    ? new Date(req.body.fechaProgramada)
    : new Date();
  fechaProgramada.setHours(0, 0, 0, 0);

  // Auto-archivar items NO recurrentes que ya fueron usados en una ejecución previa
  // (es decir, tareas únicas que ya cumplieron su ciclo y no deben aparecer en la próxima)
  await prisma.checklistPlantillaItem.updateMany({
    where: {
      plantillaId: plantilla.plantillaId,
      itemRecurrente: false,
      itemActivo: true,
      respuestas: { some: {} }, // tuvo al menos una respuesta = ya se usó
    },
    data: { itemActivo: false },
  });

  const ejecucion = await prisma.checklistEjecucion.create({
    data: {
      plantillaId: plantilla.plantillaId,
      ejecucionFechaProgramada: fechaProgramada,
      ejecucionEstado: 'en_progreso',
      ejecucionFechaInicio: new Date(),
      ejecutadoPor: req.usuario!.usuarioId,
    },
  });
  res.json(ejecucion);
});

/**
 * PUT /api/checklists/ejecuciones/:id/respuestas
 * Guarda/actualiza respuestas de items (autosave).
 * Body: { respuestas: [{ itemId, valor, comentario }] }
 */
router.put('/ejecuciones/:id/respuestas', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { respuestas } = req.body;
  if (!Array.isArray(respuestas)) return res.status(400).json({ error: 'respuestas debe ser array' });

  const ejecucion = await prisma.checklistEjecucion.findUnique({ where: { ejecucionId: id } });
  if (!ejecucion) return res.status(404).json({ error: 'Ejecución no encontrada' });
  if (ejecucion.ejecucionEstado === 'revisada') {
    return res.status(409).json({ error: 'Ejecución ya revisada, no se puede modificar' });
  }

  // Upsert cada respuesta
  for (const r of respuestas) {
    await prisma.checklistRespuesta.upsert({
      where: { ejecucionId_itemId: { ejecucionId: id, itemId: r.itemId } },
      update: { respuestaValor: r.valor ?? null, respuestaComentario: r.comentario ?? null },
      create: {
        ejecucionId: id,
        itemId: r.itemId,
        respuestaValor: r.valor ?? null,
        respuestaComentario: r.comentario ?? null,
      },
    });
  }

  res.json({ ok: true });
});

/**
 * POST /api/checklists/ejecuciones/:id/completar
 * El ejecutor marca como completada (lista para revisión).
 */
router.post('/ejecuciones/:id/completar', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { observaciones } = req.body;

  const ejecucion = await prisma.checklistEjecucion.update({
    where: { ejecucionId: id },
    data: {
      ejecucionEstado: 'completada',
      ejecucionFechaCompletada: new Date(),
      ejecucionObservaciones: observaciones || null,
      ejecutadoPor: req.usuario!.usuarioId,
    },
  });
  res.json(ejecucion);
});

/**
 * POST /api/checklists/ejecuciones/:id/revisar
 * Solo el supervisor designado puede aprobar/rechazar.
 * Body: { aprobado: boolean, comentario?: string }
 */
router.post('/ejecuciones/:id/revisar', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { aprobado, comentario } = req.body;
  const usuarioId = req.usuario!.usuarioId;

  const ejecucion = await prisma.checklistEjecucion.findUnique({
    where: { ejecucionId: id },
    include: { plantilla: true },
  });
  if (!ejecucion) return res.status(404).json({ error: 'Ejecución no encontrada' });
  if (ejecucion.plantilla.supervisorId !== usuarioId) {
    return res.status(403).json({ error: 'Solo el supervisor designado puede revisar' });
  }
  if (ejecucion.ejecucionEstado !== 'completada') {
    return res.status(409).json({ error: 'Solo se pueden revisar ejecuciones completadas' });
  }

  const updated = await prisma.checklistEjecucion.update({
    where: { ejecucionId: id },
    data: {
      ejecucionEstado: aprobado ? 'revisada' : 'rechazada',
      ejecucionFechaRevisada: new Date(),
      ejecucionComentarioRevisor: comentario || null,
      revisadoPor: usuarioId,
    },
  });
  res.json(updated);
});

/**
 * POST /api/checklists/plantillas
 * Crea una nueva plantilla. Solo Admin / DataOwner.
 * Body: { codigo, titulo, descripcion?, frecuencia, cargo, responsableId, supervisorId, proyectoCodigo }
 */
router.post('/plantillas', async (req: Request, res: Response) => {
  if (!['Admin', 'DataOwner'].includes(req.usuario!.rol)) {
    return res.status(403).json({ error: 'Solo Admin/DataOwner puede crear plantillas' });
  }
  const { codigo, titulo, descripcion, frecuencia, cargo, responsableId, supervisorId, proyectoCodigo } = req.body;
  if (!codigo || !titulo || !frecuencia || !cargo || !responsableId || !supervisorId || !proyectoCodigo) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  const proyecto = await prisma.proyecto.findUnique({ where: { proyectoCodigo } });
  if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });

  try {
    const plantilla = await prisma.checklistPlantilla.create({
      data: {
        plantillaCodigo: codigo,
        plantillaTitulo: titulo,
        plantillaDescripcion: descripcion || null,
        plantillaFrecuencia: frecuencia,
        plantillaCargo: cargo,
        proyectoId: proyecto.proyectoId,
        responsableId: parseInt(responsableId, 10),
        supervisorId: parseInt(supervisorId, 10),
        createdBy: req.usuario!.usuarioId,
      },
    });
    res.json(plantilla);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Código de plantilla ya existe' });
    throw e;
  }
});

/**
 * PUT /api/checklists/plantillas/:codigo
 * Edita una plantilla existente. Solo Admin/DataOwner o responsable actual.
 */
router.put('/plantillas/:codigo', async (req: Request, res: Response) => {
  const plantilla = await prisma.checklistPlantilla.findUnique({
    where: { plantillaCodigo: req.params.codigo },
  });
  if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });

  const usuarioId = req.usuario!.usuarioId;
  const puede = plantilla.responsableId === usuarioId
             || ['Admin', 'DataOwner'].includes(req.usuario!.rol);
  if (!puede) return res.status(403).json({ error: 'Sin permisos' });

  const { titulo, descripcion, frecuencia, cargo, responsableId, supervisorId, activa } = req.body;
  const updated = await prisma.checklistPlantilla.update({
    where: { plantillaCodigo: req.params.codigo },
    data: {
      ...(titulo !== undefined && { plantillaTitulo: titulo }),
      ...(descripcion !== undefined && { plantillaDescripcion: descripcion }),
      ...(frecuencia !== undefined && { plantillaFrecuencia: frecuencia }),
      ...(cargo !== undefined && { plantillaCargo: cargo }),
      ...(responsableId !== undefined && { responsableId: parseInt(responsableId, 10) }),
      ...(supervisorId !== undefined && { supervisorId: parseInt(supervisorId, 10) }),
      ...(activa !== undefined && { plantillaActiva: !!activa }),
      modifiedBy: usuarioId,
    },
  });
  res.json(updated);
});

/**
 * DELETE /api/checklists/plantillas/:codigo
 * Archiva una plantilla (soft delete vía plantillaActiva=false). Solo Admin/DataOwner.
 */
router.delete('/plantillas/:codigo', async (req: Request, res: Response) => {
  if (!['Admin', 'DataOwner'].includes(req.usuario!.rol)) {
    return res.status(403).json({ error: 'Solo Admin/DataOwner puede archivar plantillas' });
  }
  const plantilla = await prisma.checklistPlantilla.findUnique({
    where: { plantillaCodigo: req.params.codigo },
  });
  if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });
  await prisma.checklistPlantilla.update({
    where: { plantillaCodigo: req.params.codigo },
    data: { plantillaActiva: false, modifiedBy: req.usuario!.usuarioId },
  });
  res.json({ ok: true });
});

/**
 * GET /api/checklists/usuarios
 * Lista usuarios activos para selectores (responsable/supervisor). Cualquier autenticado.
 */
router.get('/usuarios', async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany({
    where: { usuarioActivo: true },
    select: {
      usuarioId: true,
      usuarioNombre: true,
      usuarioCorreo: true,
      usuarioCargo: true,
      usuarioRol: true,
    },
    orderBy: { usuarioNombre: 'asc' },
  });
  res.json(usuarios);
});

export default router;
