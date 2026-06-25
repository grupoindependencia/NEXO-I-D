import { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle2, ShieldCheck, ShieldX, Send, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Pill } from '@/components/ui/Table';

interface DetailProps {
  ejecucionId: number;
  onClose: () => void;
}

interface Item {
  itemId: number;
  itemOrden: number;
  itemTitulo: string;
  itemTipo: string;
  itemObligatorio: boolean;
}

interface Respuesta {
  itemId: number;
  respuestaValor?: string | null;
  respuestaComentario?: string | null;
}

interface EjecucionDetalle {
  ejecucionId: number;
  ejecucionFechaProgramada: string;
  ejecucionEstado: string;
  ejecucionObservaciones?: string;
  ejecucionFechaCompletada?: string;
  ejecucionFechaRevisada?: string;
  ejecucionComentarioRevisor?: string;
  plantilla: {
    plantillaTitulo: string;
    plantillaDescripcion?: string;
    plantillaFrecuencia: string;
    plantillaCargo: string;
    supervisorId: number;
    responsable: { usuarioNombre: string; usuarioCargo?: string };
    supervisor: { usuarioNombre: string; usuarioCargo?: string };
    items: Item[];
  };
  respuestas: Respuesta[];
  ejecutor?: { usuarioNombre: string };
  revisor?: { usuarioNombre: string };
}

export function ChecklistDetail({ ejecucionId, onClose }: DetailProps) {
  const { usuario } = useAuth();
  const [ej, setEj] = useState<EjecucionDetalle | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, { valor: string; comentario: string }>>({});
  const [observaciones, setObservaciones] = useState('');
  const [comentarioRevisor, setComentarioRevisor] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    const data = await api.get<EjecucionDetalle>(`/api/checklists/ejecuciones/${ejecucionId}`);
    setEj(data);
    setObservaciones(data.ejecucionObservaciones || '');
    setComentarioRevisor(data.ejecucionComentarioRevisor || '');
    const map: Record<number, { valor: string; comentario: string }> = {};
    data.respuestas.forEach((r) => {
      map[r.itemId] = { valor: r.respuestaValor || '', comentario: r.respuestaComentario || '' };
    });
    setRespuestas(map);
  }, [ejecucionId]);

  useEffect(() => { cargar(); }, [cargar]);

  if (!ej) return (
    <div className="chk-modal-bg" onClick={onClose}>
      <div className="chk-modal" onClick={(e) => e.stopPropagation()}>Cargando…</div>
    </div>
  );

  const enRevision      = ej.ejecucionEstado === 'completada';
  const finalizada      = ej.ejecucionEstado === 'revisada' || ej.ejecucionEstado === 'rechazada';
  const esSupervisor    = usuario?.usuarioId === ej.plantilla.supervisorId;
  const puedeEditar     = !enRevision && !finalizada;
  const puedeRevisar    = enRevision && esSupervisor;

  const actualizar = (itemId: number, campo: 'valor' | 'comentario', val: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || { valor: '', comentario: '' }), [campo]: val },
    }));
  };

  const guardarAutoSave = async () => {
    if (!puedeEditar) return;
    setGuardando(true);
    try {
      const payload = Object.entries(respuestas).map(([itemId, r]) => ({
        itemId: parseInt(itemId, 10),
        valor: r.valor,
        comentario: r.comentario,
      }));
      await api.put(`/api/checklists/ejecuciones/${ejecucionId}/respuestas`, { respuestas: payload });
    } finally { setGuardando(false); }
  };

  const completar = async () => {
    setError('');
    // Validar items obligatorios
    const faltantes = ej.plantilla.items.filter((it) => {
      if (!it.itemObligatorio) return false;
      const r = respuestas[it.itemId];
      if (!r) return true;
      if (it.itemTipo === 'check') return r.valor !== 'true';
      return !r.valor || r.valor.trim() === '';
    });
    if (faltantes.length > 0) {
      setError(`Faltan ${faltantes.length} item(s) obligatorios por completar.`);
      return;
    }
    await guardarAutoSave();
    await api.post(`/api/checklists/ejecuciones/${ejecucionId}/completar`, { observaciones });
    onClose();
  };

  const revisar = async (aprobado: boolean) => {
    try {
      await api.post(`/api/checklists/ejecuciones/${ejecucionId}/revisar`, {
        aprobado,
        comentario: comentarioRevisor,
      });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al revisar');
    }
  };

  return (
    <div className="chk-modal-bg" onClick={onClose}>
      <div className="chk-modal" onClick={(e) => e.stopPropagation()}>
        <header className="chk-modal-h">
          <div>
            <div className="chk-modal-eyebrow">CHECKLIST · {ej.plantilla.plantillaFrecuencia.toUpperCase()}</div>
            <h2>{ej.plantilla.plantillaTitulo}</h2>
            {ej.plantilla.plantillaDescripcion && <p className="chk-modal-desc">{ej.plantilla.plantillaDescripcion}</p>}
          </div>
          <button className="chk-modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </header>

        <div className="chk-modal-meta">
          <div><span className="chk-modal-meta-l">Cargo</span><span>{ej.plantilla.plantillaCargo}</span></div>
          <div><span className="chk-modal-meta-l">Responsable</span><span>{ej.plantilla.responsable.usuarioNombre}</span></div>
          <div><span className="chk-modal-meta-l">Supervisor</span><span>{ej.plantilla.supervisor.usuarioNombre}</span></div>
          <div>
            <span className="chk-modal-meta-l">Estado</span>
            <span>
              {ej.ejecucionEstado === 'en_progreso' && <Pill tipo="a">En progreso</Pill>}
              {ej.ejecucionEstado === 'completada' && <Pill tipo="c">Esperando revisión</Pill>}
              {ej.ejecucionEstado === 'revisada' && <Pill tipo="ok">Aprobada</Pill>}
              {ej.ejecucionEstado === 'rechazada' && <Pill tipo="r">Rechazada</Pill>}
            </span>
          </div>
        </div>

        <div className="chk-modal-body">
          {ej.plantilla.items.map((it) => {
            const r = respuestas[it.itemId] || { valor: '', comentario: '' };
            const completed = it.itemTipo === 'check' ? r.valor === 'true' : !!r.valor;
            return (
              <div key={it.itemId} className={`chk-item ${completed ? 'completed' : ''}`}>
                <div className="chk-item-num">{it.itemOrden}</div>
                <div className="chk-item-content">
                  <div className="chk-item-title">
                    {it.itemTitulo}
                    {it.itemObligatorio && <span className="chk-item-required">*</span>}
                  </div>
                  {/* Render según tipo */}
                  {it.itemTipo === 'check' && (
                    <label className="chk-check">
                      <input
                        type="checkbox"
                        checked={r.valor === 'true'}
                        disabled={!puedeEditar}
                        onChange={(e) => actualizar(it.itemId, 'valor', e.target.checked ? 'true' : 'false')}
                      />
                      <span>Completado</span>
                    </label>
                  )}
                  {it.itemTipo === 'texto' && (
                    <textarea
                      className="chk-textarea"
                      value={r.valor}
                      disabled={!puedeEditar}
                      onChange={(e) => actualizar(it.itemId, 'valor', e.target.value)}
                      onBlur={guardarAutoSave}
                      placeholder="Escribe tu respuesta…"
                      rows={2}
                    />
                  )}
                  {it.itemTipo === 'numero' && (
                    <input
                      type="number"
                      className="chk-input"
                      value={r.valor}
                      disabled={!puedeEditar}
                      onChange={(e) => actualizar(it.itemId, 'valor', e.target.value)}
                      onBlur={guardarAutoSave}
                    />
                  )}
                  {it.itemTipo === 'si_no_na' && (
                    <div className="chk-radio-group">
                      {['si', 'no', 'na'].map((opt) => (
                        <label key={opt} className="chk-radio">
                          <input
                            type="radio"
                            name={`item-${it.itemId}`}
                            checked={r.valor === opt}
                            disabled={!puedeEditar}
                            onChange={() => { actualizar(it.itemId, 'valor', opt); setTimeout(guardarAutoSave, 50); }}
                          />
                          <span>{opt === 'si' ? 'Sí' : opt === 'no' ? 'No' : 'N/A'}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Comentario opcional */}
                  {(r.valor || r.comentario) && (
                    <details className="chk-item-comment" open={!!r.comentario}>
                      <summary><MessageSquare size={11} /> Comentario</summary>
                      <textarea
                        className="chk-textarea"
                        value={r.comentario}
                        disabled={!puedeEditar}
                        onChange={(e) => actualizar(it.itemId, 'comentario', e.target.value)}
                        onBlur={guardarAutoSave}
                        rows={2}
                        placeholder="Notas opcionales…"
                      />
                    </details>
                  )}
                </div>
              </div>
            );
          })}

          <div className="chk-obs">
            <label>Observaciones generales de esta ejecución</label>
            <textarea
              value={observaciones}
              disabled={!puedeEditar}
              onChange={(e) => setObservaciones(e.target.value)}
              onBlur={guardarAutoSave}
              rows={3}
              placeholder="Resumen del trabajo realizado, hallazgos, próximos pasos…"
            />
          </div>

          {/* Bloque revisión */}
          {(enRevision || finalizada) && (
            <div className="chk-review-block">
              <h3><ShieldCheck size={16} /> Revisión del supervisor</h3>
              {finalizada && (
                <div className="chk-review-result">
                  {ej.ejecucionEstado === 'revisada' ? <Pill tipo="ok">Aprobada</Pill> : <Pill tipo="r">Rechazada</Pill>}
                  {' '}por <strong>{ej.revisor?.usuarioNombre}</strong>
                  {ej.ejecucionFechaRevisada && ` · ${new Date(ej.ejecucionFechaRevisada).toLocaleString('es-CL')}`}
                </div>
              )}
              <textarea
                value={comentarioRevisor}
                disabled={!puedeRevisar}
                onChange={(e) => setComentarioRevisor(e.target.value)}
                rows={3}
                placeholder={puedeRevisar ? 'Comentario del supervisor (opcional)…' : 'Sin comentario'}
              />
              {puedeRevisar && (
                <div className="chk-review-actions">
                  <button className="chk-btn-reject" onClick={() => revisar(false)}><ShieldX size={14} /> Rechazar</button>
                  <button className="chk-btn-approve" onClick={() => revisar(true)}><ShieldCheck size={14} /> Aprobar</button>
                </div>
              )}
            </div>
          )}

          {error && <div className="chk-error">{error}</div>}
        </div>

        <footer className="chk-modal-f">
          <div className="chk-modal-saving">{guardando && 'Guardando…'}</div>
          {puedeEditar && (
            <button className="chk-btn-primary" onClick={completar}>
              <Send size={14} /> Completar y enviar a revisión
            </button>
          )}
          {!puedeEditar && (
            <button className="chk-btn-secondary" onClick={onClose}>
              <CheckCircle2 size={14} /> Cerrar
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
