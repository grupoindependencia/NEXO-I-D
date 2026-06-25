import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardCheck, Clock, ShieldCheck, Play, CheckCircle2, Plus, Repeat, Zap, Pencil, Trash2, Archive, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';
import { ChecklistDetail } from './ChecklistDetail';
import { AgregarTarea } from './AgregarTarea';
import { EditarPlantilla } from './EditarPlantilla';
import { EditarItem } from './EditarItem';
import './Checklists.css';

export interface Plantilla {
  plantillaId: number;
  plantillaCodigo: string;
  plantillaTitulo: string;
  plantillaDescripcion?: string;
  plantillaFrecuencia: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  plantillaCargo: string;
  responsableId: number;
  supervisorId: number;
  responsable: { usuarioId: number; usuarioNombre: string; usuarioCargo?: string };
  supervisor:  { usuarioId: number; usuarioNombre: string; usuarioCargo?: string };
  items: Array<{ itemId: number; itemOrden: number; itemTitulo: string; itemTipo: string; itemObligatorio: boolean; itemRecurrente: boolean; creador?: { usuarioNombre: string } | null }>;
}

export interface Ejecucion {
  ejecucionId: number;
  ejecucionFechaProgramada: string;
  ejecucionEstado: 'pendiente' | 'en_progreso' | 'completada' | 'revisada' | 'rechazada';
  ejecucionFechaCompletada?: string;
  ejecucionFechaRevisada?: string;
  plantilla: Plantilla;
  ejecutor?: { usuarioId: number; usuarioNombre: string };
  revisor?:  { usuarioId: number; usuarioNombre: string };
}

const FREC_LABEL: Record<string, string> = {
  diaria: 'Diaria', semanal: 'Semanal', mensual: 'Mensual', trimestral: 'Trimestral', anual: 'Anual',
};
const FREC_PILL: Record<string, 'c' | 'i' | 'a' | 'r'> = {
  diaria: 'c', semanal: 'i', mensual: 'a', trimestral: 'r', anual: 'r',
};

export function ChecklistsSection() {
  const { codigo } = useParams<{ codigo: string }>();
  const { usuario } = useAuth();
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [ejecuciones, setEjecuciones] = useState<Ejecucion[]>([]);
  const [ejecucionAbierta, setEjecucionAbierta] = useState<number | null>(null);
  const [agregarA, setAgregarA] = useState<{ codigo: string; titulo: string } | null>(null);
  const [editandoPlantilla, setEditandoPlantilla] = useState<Plantilla | null>(null);
  const [creandoPlantilla, setCreandoPlantilla] = useState(false);
  const [editandoItem, setEditandoItem] = useState<any | null>(null);
  const [cargando, setCargando] = useState(true);

  const esAdmin = usuario?.rol === 'Admin' || usuario?.rol === 'DataOwner';

  const puedeEditarPlantilla = (p: Plantilla) =>
    esAdmin || p.responsableId === usuario?.usuarioId;

  const archivarPlantilla = async (p: Plantilla) => {
    if (!confirm(`¿Archivar plantilla "${p.plantillaTitulo}"? Ya no aparecerá en la lista pero el historial se conserva.`)) return;
    await api.delete(`/api/checklists/plantillas/${p.plantillaCodigo}`);
    await cargar();
  };

  const eliminarItem = async (itemId: number, titulo: string) => {
    if (!confirm(`¿Archivar la tarea "${titulo}"?`)) return;
    await api.delete(`/api/checklists/plantillas/items/${itemId}`);
    await cargar();
  };

  const cargar = useCallback(async () => {
    if (!codigo) return;
    setCargando(true);
    try {
      const [pls, ejs] = await Promise.all([
        api.get<Plantilla[]>(`/api/checklists/plantillas?proyecto=${codigo}`),
        api.get<Ejecucion[]>(`/api/checklists/ejecuciones?proyecto=${codigo}`),
      ]);
      setPlantillas(pls);
      setEjecuciones(ejs);
    } finally { setCargando(false); }
  }, [codigo]);

  useEffect(() => { cargar(); }, [cargar]);

  const iniciarEjecucion = async (plantillaCodigo: string) => {
    const ej = await api.post(`/api/checklists/plantillas/${plantillaCodigo}/ejecutar`);
    setEjecucionAbierta(ej.ejecucionId);
    await cargar();
  };

  const ejecucionesPendientesRevision = ejecuciones.filter(
    (e) => e.ejecucionEstado === 'completada' && e.plantilla.supervisorId === usuario?.usuarioId
  );
  const misEnProgreso = ejecuciones.filter(
    (e) => e.ejecucionEstado === 'en_progreso' && e.ejecutor?.usuarioId === usuario?.usuarioId
  );
  const historial = ejecuciones.filter(
    (e) => e.ejecucionEstado === 'revisada' || e.ejecucionEstado === 'rechazada'
  ).slice(0, 20);

  if (cargando) return <div className="proto-loading">Cargando checklists…</div>;

  return (
    <>
      <PageHeader
        titulo="Checklists periódicos"
        subtitulo="Verificaciones programadas por cargo. Cada checklist debe ser ejecutado por el responsable y revisado por el supervisor como respaldo formal del trabajo realizado."
        tag="Operativo"
      />

      {/* Resumen de cuentas */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="chk-counter">
          <div className="chk-counter-icon" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><ClipboardCheck size={20} /></div>
          <div>
            <div className="chk-counter-k">{plantillas.length}</div>
            <div className="chk-counter-l">Plantillas activas</div>
          </div>
        </div>
        <div className="chk-counter">
          <div className="chk-counter-icon" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}><Clock size={20} /></div>
          <div>
            <div className="chk-counter-k">{misEnProgreso.length}</div>
            <div className="chk-counter-l">En progreso (mías)</div>
          </div>
        </div>
        <div className="chk-counter">
          <div className="chk-counter-icon" style={{ background: 'var(--crit-soft)', color: 'var(--crit)' }}><ShieldCheck size={20} /></div>
          <div>
            <div className="chk-counter-k">{ejecucionesPendientesRevision.length}</div>
            <div className="chk-counter-l">Pendientes de revisión</div>
          </div>
        </div>
      </div>

      {/* Alerta para supervisor */}
      {ejecucionesPendientesRevision.length > 0 && (
        <Callout tipo="warn" titulo={`Tienes ${ejecucionesPendientesRevision.length} checklist(s) esperando tu revisión`}>
          Como supervisor designado, eres responsable de validar el trabajo realizado por tu equipo. Revisa y aprueba o rechaza cada uno desde la lista de abajo.
        </Callout>
      )}

      {/* Mis ejecuciones en progreso */}
      {misEnProgreso.length > 0 && (
        <>
          <PageHeader titulo="Mis checklists en progreso" subtitulo="Continúa donde lo dejaste." />
          <div className="chk-list">
            {misEnProgreso.map((e) => (
              <div key={e.ejecucionId} className="chk-row chk-row-progress" onClick={() => setEjecucionAbierta(e.ejecucionId)}>
                <div className="chk-row-main">
                  <div className="chk-row-title">{e.plantilla.plantillaTitulo}</div>
                  <div className="chk-row-meta">
                    <Pill tipo={FREC_PILL[e.plantilla.plantillaFrecuencia]}>{FREC_LABEL[e.plantilla.plantillaFrecuencia]}</Pill>
                    <span className="chk-row-date">Iniciada · {new Date(e.ejecucionFechaProgramada).toLocaleDateString('es-CL')}</span>
                  </div>
                </div>
                <div className="chk-row-status">Continuar →</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pendientes de revisión */}
      {ejecucionesPendientesRevision.length > 0 && (
        <>
          <PageHeader titulo="Por revisar" subtitulo="Ejecuciones completadas por el equipo que requieren tu aprobación." />
          <div className="chk-list">
            {ejecucionesPendientesRevision.map((e) => (
              <div key={e.ejecucionId} className="chk-row chk-row-review" onClick={() => setEjecucionAbierta(e.ejecucionId)}>
                <div className="chk-row-main">
                  <div className="chk-row-title">{e.plantilla.plantillaTitulo}</div>
                  <div className="chk-row-meta">
                    <Pill tipo={FREC_PILL[e.plantilla.plantillaFrecuencia]}>{FREC_LABEL[e.plantilla.plantillaFrecuencia]}</Pill>
                    <span className="chk-row-date">Completada por <strong>{e.ejecutor?.usuarioNombre || '—'}</strong> · {e.ejecucionFechaCompletada ? new Date(e.ejecucionFechaCompletada).toLocaleString('es-CL') : '—'}</span>
                  </div>
                </div>
                <div className="chk-row-status chk-status-warn">Revisar →</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Plantillas disponibles · ahora son cards expandibles con sus items */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
        <PageHeader titulo="Plantillas disponibles" subtitulo="Cada plantilla es un checklist con sus items. Puedes agregar tareas extra recurrentes o de una sola vez." />
        {esAdmin && (
          <button className="chk-btn-primary" onClick={() => setCreandoPlantilla(true)} style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <Plus size={14} /> Nueva plantilla
          </button>
        )}
      </div>
      <div className="chk-plantilla-list">
        {plantillas.map((p) => {
          const esResponsable = p.responsableId === usuario?.usuarioId;
          return (
            <div key={p.plantillaId} className="chk-plantilla">
              <div className="chk-plantilla-h">
                <div className="chk-plantilla-info">
                  <div className="chk-plantilla-row">
                    <Pill tipo={FREC_PILL[p.plantillaFrecuencia]}>{FREC_LABEL[p.plantillaFrecuencia]}</Pill>
                    <h3>{p.plantillaTitulo}</h3>
                  </div>
                  {p.plantillaDescripcion && <p>{p.plantillaDescripcion}</p>}
                  <div className="chk-plantilla-meta">
                    <span><strong>{p.plantillaCargo}</strong> · {p.responsable.usuarioNombre}</span>
                    <span>Supervisor: {p.supervisor.usuarioNombre}</span>
                    <span>{p.items.length} ítem{p.items.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="chk-plantilla-actions">
                  <button
                    className="chk-action-btn"
                    onClick={() => setAgregarA({ codigo: p.plantillaCodigo, titulo: p.plantillaTitulo })}
                    title="Agregar tarea a esta plantilla"
                  >
                    <Plus size={12} /> Tarea
                  </button>
                  {puedeEditarPlantilla(p) && (
                    <button
                      className="chk-action-btn"
                      onClick={() => setEditandoPlantilla(p)}
                      title="Editar plantilla"
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                  {esAdmin && (
                    <button
                      className="chk-action-btn chk-action-danger"
                      onClick={() => archivarPlantilla(p)}
                      title="Archivar plantilla"
                    >
                      <Archive size={12} />
                    </button>
                  )}
                  <button
                    className={`chk-action-btn ${esResponsable ? 'primary' : ''}`}
                    onClick={() => iniciarEjecucion(p.plantillaCodigo)}
                  >
                    <Play size={12} /> Iniciar
                  </button>
                </div>
              </div>

              <ul className="chk-plantilla-items">
                {p.items.map((it) => (
                  <li key={it.itemId}>
                    <span className="chk-item-tag">
                      {it.itemRecurrente
                        ? <Repeat size={11} />
                        : <Zap size={11} style={{ color: 'var(--warn)' }} />}
                    </span>
                    <span className="chk-item-text">
                      {it.itemTitulo}
                      {it.itemObligatorio && <span className="chk-item-required">*</span>}
                    </span>
                    {!it.itemRecurrente && <span className="chk-item-badge">única</span>}
                    {it.creador?.usuarioNombre && (
                      <span className="chk-item-author">· agregado por {it.creador.usuarioNombre}</span>
                    )}
                    {puedeEditarPlantilla(p) && (
                      <span className="chk-item-actions">
                        <button
                          className="chk-item-icon-btn"
                          title="Editar tarea"
                          onClick={() => setEditandoItem(it)}
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          className="chk-item-icon-btn chk-item-icon-danger"
                          title="Archivar tarea"
                          onClick={() => eliminarItem(it.itemId, it.itemTitulo)}
                        >
                          <Trash2 size={11} />
                        </button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Historial */}
      {historial.length > 0 && (
        <>
          <PageHeader titulo="Historial reciente" subtitulo="Últimas ejecuciones revisadas o rechazadas." />
          <TableWrap>
            <thead>
              <tr>
                <th>Checklist</th>
                <th style={{ width: '14%' }}>Fecha</th>
                <th style={{ width: '20%' }}>Ejecutado por</th>
                <th style={{ width: '20%' }}>Revisado por</th>
                <th style={{ width: '12%' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((e) => (
                <tr key={e.ejecucionId} style={{ cursor: 'pointer' }} onClick={() => setEjecucionAbierta(e.ejecucionId)}>
                  <td>{e.plantilla.plantillaTitulo}</td>
                  <td>{new Date(e.ejecucionFechaProgramada).toLocaleDateString('es-CL')}</td>
                  <td>{e.ejecutor?.usuarioNombre || '—'}</td>
                  <td>{e.revisor?.usuarioNombre || '—'}</td>
                  <td>
                    {e.ejecucionEstado === 'revisada'
                      ? <Pill tipo="ok"><CheckCircle2 size={10} style={{ marginRight: 3, verticalAlign: 'text-bottom' }} />Aprobada</Pill>
                      : <Pill tipo="r"><X size={10} style={{ marginRight: 3, verticalAlign: 'text-bottom' }} />Rechazada</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </>
      )}

      <Callout tipo="info" titulo="Cómo funciona">
        El responsable de cada checklist lo ejecuta marcando sus items y añadiendo observaciones. Al completarlo,
        el supervisor designado recibe la notificación y debe revisarlo aprobando o rechazando.
        El historial completo queda en la plataforma como respaldo formal del trabajo realizado.
      </Callout>

      {ejecucionAbierta && (
        <ChecklistDetail
          ejecucionId={ejecucionAbierta}
          onClose={() => { setEjecucionAbierta(null); cargar(); }}
        />
      )}

      {agregarA && (
        <AgregarTarea
          plantillaCodigo={agregarA.codigo}
          plantillaTitulo={agregarA.titulo}
          onClose={() => setAgregarA(null)}
          onAgregada={cargar}
        />
      )}

      {(editandoPlantilla || creandoPlantilla) && codigo && (
        <EditarPlantilla
          modo={editandoPlantilla ? 'editar' : 'crear'}
          plantilla={editandoPlantilla || undefined}
          proyectoCodigo={codigo}
          onClose={() => { setEditandoPlantilla(null); setCreandoPlantilla(false); }}
          onGuardada={cargar}
        />
      )}

      {editandoItem && (
        <EditarItem
          item={editandoItem}
          onClose={() => setEditandoItem(null)}
          onGuardado={cargar}
        />
      )}
    </>
  );
}
