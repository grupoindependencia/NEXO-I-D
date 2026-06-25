import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Secciones por proyecto (usadas como metadata en DB; el contenido vive en TSX)
const SECCIONES: Record<string, { codigo: string; titulo: string; orden: number }[]> = {
  conectividad: [
    { codigo: 'resumen',      titulo: 'Resumen ejecutivo',         orden: 1 },
    { codigo: 'roles',        titulo: 'Roles y RACI',              orden: 2 },
    { codigo: 'activacion',   titulo: 'Activación',                orden: 3 },
    { codigo: 'sitio',        titulo: 'Preparación del sitio',     orden: 4 },
    { codigo: 'starlink',     titulo: 'Instalación Starlink',      orden: 5 },
    { codigo: 'checkterreno', titulo: 'Checklist terreno',         orden: 6 },
    { codigo: 'topologia',    titulo: 'Topología de red',          orden: 7 },
    { codigo: 'energia',      titulo: 'Energía y continuidad',     orden: 8 },
    { codigo: 'enlace',       titulo: 'Soporte de enlace',         orden: 9 },
    { codigo: 'preventivo',   titulo: 'Mantenimiento preventivo',  orden: 10 },
    { codigo: 'correctivo',   titulo: 'Mantenimiento correctivo',  orden: 11 },
    { codigo: 'reporte',      titulo: 'Reporte semanal',           orden: 12 },
    { codigo: 'firmware',     titulo: 'Actualización de firmware', orden: 13 },
    { codigo: 'manual',       titulo: 'Manual de usuario',         orden: 14 },
    { codigo: 'contactos',    titulo: 'Contactos',                 orden: 15 },
    { codigo: 'glosario',     titulo: 'Glosario',                  orden: 16 },
  ],
  netsensor: [
    { codigo: 'resumen',      titulo: 'Resumen ejecutivo',         orden: 1 },
    { codigo: 'hardware',     titulo: 'Diseño físico',             orden: 2 },
    { codigo: 'instalacion',  titulo: 'Instalación del nodo',      orden: 3 },
    { codigo: 'uso',          titulo: 'Uso en obra',               orden: 4 },
    { codigo: 'diagnostico',  titulo: 'Diagnóstico',               orden: 5 },
    { codigo: 'remoto',       titulo: 'Soporte remoto',            orden: 6 },
    { codigo: 'desconexion',  titulo: 'Flujo de desconexión',      orden: 7 },
    { codigo: 'reporte',      titulo: 'Reporte semanal',           orden: 8 },
    { codigo: 'contactos',    titulo: 'Contactos',                 orden: 9 },
    { codigo: 'glosario',     titulo: 'Glosario',                  orden: 10 },
  ],
};

async function main() {
  console.log('[seed] Iniciando...');

  // --- Usuarios del equipo I+D ---
  const cost = parseInt(process.env.BCRYPT_COST || '10', 10);
  const passwordDefault = await bcrypt.hash('Independencia2026', cost);

  const usuarios = [
    {
      correo: 'rodrigo.solis@cindependencia.cl',
      nombre: 'Rodrigo Solís',
      rol: 'Admin',
      cargo: 'Jefe I+D Hardware',
      departamento: 'I+D Hardware',
    },
    {
      correo: 'julio.sepulveda@cindependencia.cl',
      nombre: 'Julio Sepúlveda',
      rol: 'DataOwner',
      cargo: 'Coordinador de Soporte y Equipos',
      departamento: 'Servicios y Capacitación',
    },
    {
      correo: 'axel.munoz@cindependencia.cl',
      nombre: 'Axel Muñoz',
      rol: 'Analyst',
      cargo: 'Técnico de Soporte Integral',
      departamento: 'Soporte TI',
    },
    {
      correo: 'rodrigo.rojas@cindependencia.cl',
      nombre: 'Rodrigo Rojas',
      rol: 'Analyst',
      cargo: 'Técnico de Soporte y Mantenimiento',
      departamento: 'Soporte TI',
    },
  ];

  const usuariosCreados: Record<string, number> = {};
  for (const u of usuarios) {
    const usuario = await prisma.usuario.upsert({
      where: { usuarioCorreo: u.correo },
      update: {
        usuarioNombre: u.nombre,
        usuarioRol: u.rol,
        usuarioCargo: u.cargo,
        usuarioDepartamento: u.departamento,
      },
      create: {
        usuarioCorreo: u.correo,
        usuarioNombre: u.nombre,
        usuarioPassword: passwordDefault,
        usuarioRol: u.rol,
        usuarioCargo: u.cargo,
        usuarioDepartamento: u.departamento,
        usuarioActivo: true,
      },
    });
    usuariosCreados[u.correo] = usuario.usuarioId;
    console.log(`[seed]  ✓ Usuario ${u.nombre} (id ${usuario.usuarioId})`);
  }

  const adminId = usuariosCreados['rodrigo.solis@cindependencia.cl'];

  // --- Proyectos I+D ---
  // lifecycle: investigacion | desarrollo | piloto | operativo | pausa
  const proyectos = [
    {
      codigo: 'conectividad', nombre: 'Conectividad en Obra', orden: 1,
      titulo: 'Conectividad en Obra · Enlace Starlink + BAM',
      eyebrow: 'Protocolo de conectividad', lifecycle: 'operativo', relacionado: 'netsensor',
      subtitulo: 'Instalación y operación de enlaces Starlink y BAM en faenas de construcción.',
    },
    {
      codigo: 'netsensor', nombre: 'NetSensor', orden: 2,
      titulo: 'NetSensor · Monitor de Calidad de Red',
      eyebrow: 'Hardware I+D', lifecycle: 'piloto', relacionado: 'conectividad',
      subtitulo: 'Nodo IoT de monitoreo de conectividad. Fabricación, despliegue y operación en obra.',
    },
    {
      codigo: 'lpr', nombre: 'Cámaras LPR', orden: 3,
      titulo: 'Cámaras LPR · Reconocimiento de Patentes',
      eyebrow: 'Hardware I+D', lifecycle: 'investigacion', relacionado: 'cubicacion',
      subtitulo: 'Reconocimiento automático de patentes en accesos vehiculares. Trazabilidad de flota.',
    },
    {
      codigo: 'dumper', nombre: 'Control de Dumper', orden: 4,
      titulo: 'Control de Dumper · Telemetría en Faena',
      eyebrow: 'Hardware I+D', lifecycle: 'desarrollo', relacionado: null,
      subtitulo: 'Telemetría y control para dumpers articulados en faena. Registro de ciclos y alertas.',
    },
    {
      codigo: 'cubicacion', nombre: 'Cubicación', orden: 5,
      titulo: 'Cubicación · Medición Volumétrica',
      eyebrow: 'Hardware I+D', lifecycle: 'pausa', relacionado: 'lpr',
      subtitulo: 'Medición volumétrica automatizada de acopios y movimientos de tierra en obra.',
    },
  ];

  // Retirar proyectos que no son parte del portfolio (face, ivr, etc.)
  const codigosVigentes = proyectos.map((p) => p.codigo);
  const retirados = await prisma.proyecto.updateMany({
    where: { proyectoCodigo: { notIn: codigosVigentes }, isDeleted: false },
    data: { isDeleted: true, deletedAt: new Date(), deletedBy: adminId },
  });
  if (retirados.count > 0) console.log(`[seed]  ✓ ${retirados.count} proyectos fuera de portfolio retirados`);

  // Restaurar proyectos que vuelven al portfolio (lpr, cubicacion)
  await prisma.proyecto.updateMany({
    where: { proyectoCodigo: { in: codigosVigentes }, isDeleted: true },
    data: { isDeleted: false, deletedAt: null, deletedBy: null },
  });

  for (const p of proyectos) {
    const proyecto = await prisma.proyecto.upsert({
      where: { proyectoCodigo: p.codigo },
      update: {
        proyectoNombre: p.nombre,
        proyectoTitulo: p.titulo,
        proyectoEyebrow: p.eyebrow,
        proyectoSubtitulo: p.subtitulo,
        proyectoOrden: p.orden,
        proyectoLifecycle: p.lifecycle,
        proyectoRelacionado: p.relacionado ?? null,
        modifiedBy: adminId,
      },
      create: {
        proyectoCodigo: p.codigo,
        proyectoNombre: p.nombre,
        proyectoTitulo: p.titulo,
        proyectoEyebrow: p.eyebrow,
        proyectoSubtitulo: p.subtitulo,
        proyectoOrden: p.orden,
        proyectoLifecycle: p.lifecycle,
        proyectoRelacionado: p.relacionado ?? null,
        createdBy: adminId,
      },
    });
    console.log(`[seed]  ✓ Proyecto ${p.nombre} [${p.lifecycle}]`);

    // Secciones de protocolo para proyectos definidos
    const secciones = SECCIONES[p.codigo];
    if (secciones) {
      for (const s of secciones) {
        await prisma.protocoloSeccion.upsert({
          where: { proyectoId_seccionCodigo: { proyectoId: proyecto.proyectoId, seccionCodigo: s.codigo } },
          update: {},
          create: {
            proyectoId: proyecto.proyectoId,
            seccionCodigo: s.codigo,
            seccionTitulo: s.titulo,
            seccionOrden: s.orden,
            createdBy: adminId,
          },
        });
      }
      console.log(`[seed]    + ${secciones.length} secciones`);
    }
  }

  // --- Obras NetSensor (datos reales del dashboard) ---
  const proyectoNet = await prisma.proyecto.findUnique({ where: { proyectoCodigo: 'netsensor' } });
  const obras = [
    { codigo: 'oficina_central',       nombre: 'Oficina Central',                       lat: -35.42946, lon: -71.62627 },
    { codigo: 'paseo_hacienda_ii',     nombre: 'Talca, Paseo Hacienda II',              lat: -35.44316, lon: -71.60046 },
    { codigo: 'hacienda_esmeralda',    nombre: 'Condominio Hacienda Esmeralda 44 viv.', lat: -35.44390, lon: -71.60090 },
    { codigo: 'parque_sol',            nombre: 'Talca, Parque del Sol Urb. Sepúlveda',  lat: -35.43951, lon: -71.59585 },
    { codigo: 'parque_country',        nombre: 'Talca, Parque del Country 28 viv.',     lat: -35.41391, lon: -71.60068 },
    { codigo: 'bicentenario_iii',      nombre: 'Talca, Parque Bicentenario III ET 4',   lat: -35.40766, lon: -71.59983 },
    { codigo: 'bicentenario_iv',       nombre: 'Talca, Bicentenario Batalla de Lircay II', lat: -35.40672, lon: -71.60397 },
    { codigo: 'sala_ventas_hacienda',  nombre: 'Sala de Ventas Paseo Hacienda II',      lat: -35.44109, lon: -71.59628 },
  ];
  for (const o of obras) {
    await prisma.obra.upsert({
      where: { obraCodigo: o.codigo },
      update: {},
      create: {
        obraCodigo: o.codigo,
        obraNombre: o.nombre,
        obraCiudad: 'Talca',
        obraLatitud: o.lat,
        obraLongitud: o.lon,
        proyectoId: proyectoNet!.proyectoId,
        createdBy: adminId,
      },
    });
  }
  console.log(`[seed]  ✓ ${obras.length} obras NetSensor cargadas`);

  // --- Plantillas de checklist para NetSensor ---
  const adminUserId = usuariosCreados['rodrigo.solis@cindependencia.cl'];
  const julioId     = usuariosCreados['julio.sepulveda@cindependencia.cl'];
  const axelId      = usuariosCreados['axel.munoz@cindependencia.cl'];
  const rojasId     = usuariosCreados['rodrigo.rojas@cindependencia.cl'];

  const plantillas = [
    {
      codigo: 'netsensor_checklist_diario',
      titulo: 'Revisión diaria del dashboard NetSensor',
      descripcion: 'Inspección de mañana y tarde del estado de la flota de nodos.',
      frecuencia: 'diaria',
      cargo: 'Técnico de Soporte Integral',
      responsableId: axelId,
      supervisorId: julioId,
      items: [
        { titulo: 'Abrir comunicacionesti.cindependencia.cl/esp32 (Estado de internet)', tipo: 'check' },
        { titulo: 'Anotar cantidad de nodos activos / conectados / desconectados', tipo: 'texto' },
        { titulo: 'Revisar nodos sin reporte > 1 hora', tipo: 'check' },
        { titulo: 'Activar flujo de desconexión para cada nodo en alerta', tipo: 'check' },
        { titulo: 'Repetir revisión a las 16:00 hrs', tipo: 'check' },
        { titulo: 'Observaciones / hallazgos del día', tipo: 'texto', obligatorio: false },
      ],
    },
    {
      codigo: 'netsensor_checklist_semanal',
      titulo: 'Revisión semanal de KPI de red',
      descripcion: 'Evaluación de tendencias semanales y preparación del reporte del viernes.',
      frecuencia: 'semanal',
      cargo: 'Coordinador de Soporte y Equipos',
      responsableId: julioId,
      supervisorId: adminUserId,
      items: [
        { titulo: 'Revisar RSSI promedio de cada obra (últimos 7 días)', tipo: 'check' },
        { titulo: 'Identificar nodos con > 5 reconexiones esta semana', tipo: 'texto' },
        { titulo: 'Verificar nodos sin reporte > 72 h', tipo: 'check' },
        { titulo: 'Validar borrador del reporte semanal del viernes', tipo: 'check' },
        { titulo: 'Aprobar envío del reporte', tipo: 'si_no_na' },
      ],
    },
    {
      codigo: 'netsensor_checklist_mensual',
      titulo: 'Auditoría mensual de inventario y KPI',
      descripcion: 'Cierre mensual del proyecto: inventario, KPI, decisiones de firmware.',
      frecuencia: 'mensual',
      cargo: 'Jefe I+D Hardware',
      responsableId: adminUserId,
      supervisorId: adminUserId,
      items: [
        { titulo: 'Cruzar MACs registradas en plataforma vs. MACs reportando', tipo: 'check' },
        { titulo: 'Calcular % uptime de la flota del mes', tipo: 'numero' },
        { titulo: 'Listar obras con más incidencias', tipo: 'texto' },
        { titulo: 'Evaluar si corresponde actualizar firmware', tipo: 'si_no_na' },
        { titulo: 'Publicar KPI en la plataforma', tipo: 'check' },
        { titulo: 'Decisiones de mejora del mes', tipo: 'texto' },
      ],
    },
    {
      codigo: 'netsensor_checklist_trimestral',
      titulo: 'Inspección física trimestral en terreno',
      descripcion: 'Visita a obras críticas para revisión física de los nodos NetSensor.',
      frecuencia: 'trimestral',
      cargo: 'Técnico de Soporte y Mantenimiento',
      responsableId: rojasId,
      supervisorId: julioId,
      items: [
        { titulo: 'Verificar LED encendido y color esperado', tipo: 'check' },
        { titulo: 'Verificar fijación del dispositivo y fuente', tipo: 'check' },
        { titulo: 'Limpiar polvo con paño seco', tipo: 'check' },
        { titulo: 'Verificar etiqueta MAC y manual visible', tipo: 'check' },
        { titulo: 'Validar con jefe de obra que no haya habido incidencias', tipo: 'check' },
        { titulo: 'Foto del estado del dispositivo (URL o adjunto)', tipo: 'texto' },
        { titulo: 'Stock de repuestos suficiente (>20%)', tipo: 'si_no_na' },
      ],
    },
  ];

  for (const pl of plantillas) {
    const plantilla = await prisma.checklistPlantilla.upsert({
      where: { plantillaCodigo: pl.codigo },
      update: {
        plantillaTitulo: pl.titulo,
        plantillaDescripcion: pl.descripcion,
        plantillaFrecuencia: pl.frecuencia,
        plantillaCargo: pl.cargo,
        responsableId: pl.responsableId,
        supervisorId: pl.supervisorId,
        modifiedBy: adminUserId,
      },
      create: {
        plantillaCodigo: pl.codigo,
        plantillaTitulo: pl.titulo,
        plantillaDescripcion: pl.descripcion,
        plantillaFrecuencia: pl.frecuencia,
        plantillaCargo: pl.cargo,
        proyectoId: proyectoNet!.proyectoId,
        responsableId: pl.responsableId,
        supervisorId: pl.supervisorId,
        createdBy: adminUserId,
      },
    });
    // Recrear items (delete + insert para garantizar orden y contenido)
    await prisma.checklistPlantillaItem.deleteMany({ where: { plantillaId: plantilla.plantillaId } });
    for (let i = 0; i < pl.items.length; i++) {
      const it = pl.items[i];
      await prisma.checklistPlantillaItem.create({
        data: {
          plantillaId: plantilla.plantillaId,
          itemOrden: i + 1,
          itemTitulo: it.titulo,
          itemTipo: it.tipo,
          itemObligatorio: it.obligatorio !== false,
          itemRecurrente: true,   // los items del seed son recurrentes por defecto
          itemActivo: true,
          itemCreadoPor: adminUserId,
        },
      });
    }
    console.log(`[seed]  ✓ Plantilla checklist "${pl.titulo}" (${pl.items.length} items)`);
  }

  console.log('[seed] ✓ Completado.');
  console.log('[seed] Credenciales iniciales:');
  console.log('[seed]   correo : rodrigo.solis@cindependencia.cl');
  console.log('[seed]   password: Independencia2026');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
