import { useState } from 'react';
import { X, Save, Repeat, Zap } from 'lucide-react';
import { api } from '@/lib/api';

interface ItemEditable {
  itemId: number;
  itemTitulo: string;
  itemDescripcion?: string | null;
  itemTipo: string;
  itemObligatorio: boolean;
  itemRecurrente: boolean;
}

interface Props {
  item: ItemEditable;
  onClose: () => void;
  onGuardado: () => void;
}

export function EditarItem({ item, onClose, onGuardado }: Props) {
  const [titulo, setTitulo]           = useState(item.itemTitulo);
  const [descripcion, setDescripcion] = useState(item.itemDescripcion || '');
  const [tipo, setTipo]               = useState<'check' | 'texto' | 'numero' | 'si_no_na'>(item.itemTipo as any);
  const [obligatorio, setObligatorio] = useState(item.itemObligatorio);
  const [recurrente, setRecurrente]   = useState(item.itemRecurrente);
  const [guardando, setGuardando]     = useState(false);
  const [error, setError]             = useState('');

  const guardar = async () => {
    if (!titulo.trim()) { setError('El título es obligatorio'); return; }
    setError(''); setGuardando(true);
    try {
      await api.put(`/api/checklists/plantillas/items/${item.itemId}`, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        tipo,
        obligatorio,
        recurrente,
      });
      onGuardado();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="chk-modal-bg" onClick={onClose}>
      <div className="chk-modal chk-modal-narrow" onClick={(e) => e.stopPropagation()}>
        <header className="chk-modal-h">
          <div>
            <div className="chk-modal-eyebrow">EDITAR TAREA</div>
            <h2>Modificar item del checklist</h2>
          </div>
          <button className="chk-modal-close" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="chk-modal-body" style={{ display: 'grid', gap: 16 }}>
          <div className="chk-form-field">
            <label>Título <span style={{ color: 'var(--crit)' }}>*</span></label>
            <input type="text" className="chk-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} autoFocus maxLength={500} />
          </div>
          <div className="chk-form-field">
            <label>Descripción <span className="chk-form-opt">(opcional)</span></label>
            <textarea className="chk-textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} />
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
                <button key={v} type="button" className={`chk-tipo-card ${tipo === v ? 'active' : ''}`} onClick={() => setTipo(v)}>
                  <div className="chk-tipo-l">{l}</div>
                  <div className="chk-tipo-d">{d}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="chk-form-field">
            <label>Recurrencia</label>
            <div className="chk-recur-grid">
              <button type="button" className={`chk-recur-card ${recurrente ? 'active' : ''}`} onClick={() => setRecurrente(true)}>
                <Repeat size={20} />
                <div><div className="chk-recur-l">Recurrente</div><div className="chk-recur-d">Aparece en cada ejecución</div></div>
              </button>
              <button type="button" className={`chk-recur-card ${!recurrente ? 'active' : ''}`} onClick={() => setRecurrente(false)}>
                <Zap size={20} />
                <div><div className="chk-recur-l">Única vez</div><div className="chk-recur-d">Solo en la próxima</div></div>
              </button>
            </div>
          </div>
          <label className="chk-check" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={obligatorio} onChange={(e) => setObligatorio(e.target.checked)} />
            <span>Obligatorio para completar la ejecución</span>
          </label>
          {error && <div className="chk-error">{error}</div>}
        </div>

        <footer className="chk-modal-f">
          <button className="chk-btn-secondary" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button className="chk-btn-primary" onClick={guardar} disabled={guardando}>
            <Save size={14} /> {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </footer>
      </div>
    </div>
  );
}
