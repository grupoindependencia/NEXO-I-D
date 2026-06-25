import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '@/lib/api';
import type { Plantilla } from './Checklists';

interface UsuarioOpt {
  usuarioId: number;
  usuarioNombre: string;
  usuarioCargo?: string | null;
}

interface Props {
  modo: 'crear' | 'editar';
  plantilla?: Plantilla;
  proyectoCodigo: string;
  onClose: () => void;
  onGuardada: () => void;
}

const FRECUENCIAS = [
  { v: 'diaria',     l: 'Diaria' },
  { v: 'semanal',    l: 'Semanal' },
  { v: 'mensual',    l: 'Mensual' },
  { v: 'trimestral', l: 'Trimestral' },
  { v: 'anual',      l: 'Anual' },
];

export function EditarPlantilla({ modo, plantilla, proyectoCodigo, onClose, onGuardada }: Props) {
  const [usuarios, setUsuarios] = useState<UsuarioOpt[]>([]);
  const [codigo, setCodigo]         = useState(plantilla?.plantillaCodigo || '');
  const [titulo, setTitulo]         = useState(plantilla?.plantillaTitulo || '');
  const [descripcion, setDescripcion] = useState(plantilla?.plantillaDescripcion || '');
  const [frecuencia, setFrecuencia] = useState<string>(plantilla?.plantillaFrecuencia || 'mensual');
  const [cargo, setCargo]           = useState(plantilla?.plantillaCargo || '');
  const [responsableId, setResponsableId] = useState(plantilla?.responsableId || 0);
  const [supervisorId, setSupervisorId]   = useState(plantilla?.supervisorId || 0);
  const [guardando, setGuardando]   = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    api.get<UsuarioOpt[]>('/api/checklists/usuarios').then((u) => {
      setUsuarios(u);
      if (modo === 'crear' && u.length > 0) {
        if (!responsableId) setResponsableId(u[0].usuarioId);
        if (!supervisorId)  setSupervisorId(u[0].usuarioId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardar = async () => {
    setError('');
    if (!titulo.trim() || !cargo.trim() || !responsableId || !supervisorId) {
      setError('Completa los campos obligatorios');
      return;
    }
    setGuardando(true);
    try {
      if (modo === 'crear') {
        if (!codigo.trim()) { setError('Código requerido'); setGuardando(false); return; }
        await api.post('/api/checklists/plantillas', {
          codigo: codigo.trim(),
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || undefined,
          frecuencia,
          cargo: cargo.trim(),
          responsableId,
          supervisorId,
          proyectoCodigo,
        });
      } else {
        await api.put(`/api/checklists/plantillas/${plantilla!.plantillaCodigo}`, {
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || null,
          frecuencia,
          cargo: cargo.trim(),
          responsableId,
          supervisorId,
        });
      }
      onGuardada();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="chk-modal-bg" onClick={onClose}>
      <div className="chk-modal chk-modal-narrow" onClick={(e) => e.stopPropagation()}>
        <header className="chk-modal-h">
          <div>
            <div className="chk-modal-eyebrow">{modo === 'crear' ? 'NUEVA PLANTILLA' : 'EDITAR PLANTILLA'}</div>
            <h2>{modo === 'crear' ? 'Crear checklist' : plantilla?.plantillaTitulo}</h2>
            <p className="chk-modal-desc">
              {modo === 'crear'
                ? 'Define una verificación periódica con su responsable y supervisor.'
                : 'Modifica los datos generales. Los items se gestionan en la lista.'}
            </p>
          </div>
          <button className="chk-modal-close" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="chk-modal-body" style={{ display: 'grid', gap: 16 }}>
          {modo === 'crear' && (
            <div className="chk-form-field">
              <label>Código <span style={{ color: 'var(--crit)' }}>*</span></label>
              <input
                type="text" className="chk-input"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="netsensor_checklist_diario_extra"
                maxLength={80}
              />
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                Identificador único, sin espacios. Solo letras, números y guiones bajos.
              </div>
            </div>
          )}

          <div className="chk-form-field">
            <label>Título <span style={{ color: 'var(--crit)' }}>*</span></label>
            <input
              type="text" className="chk-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Revisión diaria del dashboard"
              autoFocus
              maxLength={255}
            />
          </div>

          <div className="chk-form-field">
            <label>Descripción <span className="chk-form-opt">(opcional)</span></label>
            <textarea
              className="chk-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              placeholder="Propósito y alcance de esta verificación…"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="chk-form-field">
              <label>Frecuencia <span style={{ color: 'var(--crit)' }}>*</span></label>
              <select className="chk-input" value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
                {FRECUENCIAS.map((f) => <option key={f.v} value={f.v}>{f.l}</option>)}
              </select>
            </div>
            <div className="chk-form-field">
              <label>Cargo asignado <span style={{ color: 'var(--crit)' }}>*</span></label>
              <input
                type="text" className="chk-input"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ej. Técnico de Soporte Integral"
                maxLength={200}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="chk-form-field">
              <label>Responsable (ejecuta) <span style={{ color: 'var(--crit)' }}>*</span></label>
              <select className="chk-input" value={responsableId} onChange={(e) => setResponsableId(parseInt(e.target.value, 10))}>
                {usuarios.map((u) => (
                  <option key={u.usuarioId} value={u.usuarioId}>
                    {u.usuarioNombre}{u.usuarioCargo ? ` — ${u.usuarioCargo}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="chk-form-field">
              <label>Supervisor (revisa) <span style={{ color: 'var(--crit)' }}>*</span></label>
              <select className="chk-input" value={supervisorId} onChange={(e) => setSupervisorId(parseInt(e.target.value, 10))}>
                {usuarios.map((u) => (
                  <option key={u.usuarioId} value={u.usuarioId}>
                    {u.usuarioNombre}{u.usuarioCargo ? ` — ${u.usuarioCargo}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="chk-error">{error}</div>}
        </div>

        <footer className="chk-modal-f">
          <button className="chk-btn-secondary" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button className="chk-btn-primary" onClick={guardar} disabled={guardando}>
            <Save size={14} /> {guardando ? 'Guardando…' : modo === 'crear' ? 'Crear plantilla' : 'Guardar cambios'}
          </button>
        </footer>
      </div>
    </div>
  );
}
