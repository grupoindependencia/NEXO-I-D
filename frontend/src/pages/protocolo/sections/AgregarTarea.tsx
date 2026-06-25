import { useState } from 'react';
import { X, Repeat, Zap, Plus } from 'lucide-react';
import { api } from '@/lib/api';

interface AgregarTareaProps {
  plantillaCodigo: string;
  plantillaTitulo: string;
  onClose: () => void;
  onAgregada: () => void;
}

export function AgregarTarea({ plantillaCodigo, plantillaTitulo, onClose, onAgregada }: AgregarTareaProps) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<'check' | 'texto' | 'numero' | 'si_no_na'>('check');
  const [obligatorio, setObligatorio] = useState(true);
  const [recurrente, setRecurrente] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const guardar = async () => {
    if (!titulo.trim()) { setError('El título es obligatorio'); return; }
    setError(''); setGuardando(true);
    try {
      await api.post(`/api/checklists/plantillas/${plantillaCodigo}/items`, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        tipo,
        obligatorio,
        recurrente,
      });
      onAgregada();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al agregar tarea');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="chk-modal-bg" onClick={onClose}>
      <div className="chk-modal chk-modal-narrow" onClick={(e) => e.stopPropagation()}>
        <header className="chk-modal-h">
          <div>
            <div className="chk-modal-eyebrow">NUEVA TAREA</div>
            <h2>Agregar tarea al checklist</h2>
            <p className="chk-modal-desc">A: <strong>{plantillaTitulo}</strong></p>
          </div>
          <button className="chk-modal-close" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="chk-modal-body" style={{ display: 'grid', gap: 16 }}>
          <div className="chk-form-field">
            <label>Título <span style={{ color: 'var(--crit)' }}>*</span></label>
            <input
              type="text"
              className="chk-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Revisar nodo de Bicentenario IV"
              autoFocus
              maxLength={500}
            />
          </div>

          <div className="chk-form-field">
            <label>Descripción <span className="chk-form-opt">(opcional)</span></label>
            <textarea
              className="chk-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              placeholder="Detalles adicionales, contexto, instrucciones…"
            />
          </div>

          <div className="chk-form-field">
            <label>Tipo de respuesta</label>
            <div className="chk-tipo-grid">
              {([
                ['check',    'Check simple',  'Marcar completado'],
                ['texto',    'Texto libre',   'Respuesta escrita'],
                ['numero',   'Número',        'Valor numérico'],
                ['si_no_na', 'Sí / No / N/A', 'Tres opciones'],
              ] as const).map(([v, l, d]) => (
                <button
                  key={v}
                  type="button"
                  className={`chk-tipo-card ${tipo === v ? 'active' : ''}`}
                  onClick={() => setTipo(v)}
                >
                  <div className="chk-tipo-l">{l}</div>
                  <div className="chk-tipo-d">{d}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="chk-form-field">
            <label>Recurrencia</label>
            <div className="chk-recur-grid">
              <button
                type="button"
                className={`chk-recur-card ${recurrente ? 'active' : ''}`}
                onClick={() => setRecurrente(true)}
              >
                <Repeat size={20} />
                <div>
                  <div className="chk-recur-l">Recurrente</div>
                  <div className="chk-recur-d">Aparece en cada ejecución del checklist</div>
                </div>
              </button>
              <button
                type="button"
                className={`chk-recur-card ${!recurrente ? 'active' : ''}`}
                onClick={() => setRecurrente(false)}
              >
                <Zap size={20} />
                <div>
                  <div className="chk-recur-l">Única vez</div>
                  <div className="chk-recur-d">Solo en la próxima ejecución, luego se archiva</div>
                </div>
              </button>
            </div>
          </div>

          <div className="chk-form-field chk-form-field-row">
            <label className="chk-check" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={obligatorio}
                onChange={(e) => setObligatorio(e.target.checked)}
              />
              <span>Obligatorio para completar la ejecución</span>
            </label>
          </div>

          {error && <div className="chk-error">{error}</div>}
        </div>

        <footer className="chk-modal-f">
          <button className="chk-btn-secondary" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button className="chk-btn-primary" onClick={guardar} disabled={guardando || !titulo.trim()}>
            <Plus size={14} /> {guardando ? 'Agregando…' : 'Agregar tarea'}
          </button>
        </footer>
      </div>
    </div>
  );
}
