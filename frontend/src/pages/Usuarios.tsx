import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, X, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import './Usuarios.css';

interface UsuarioRow {
  usuarioId: number;
  usuarioCorreo: string;
  usuarioNombre: string;
  usuarioRol: string;
  usuarioCargo: string | null;
  usuarioDepartamento: string | null;
  usuarioActivo: boolean;
  usuarioProveedorAuth: string;
  usuarioFechaCreacion: string;
  usuarioUltimoLogin: string | null;
}

const ROLES = [
  { v: 'Admin',     l: 'Admin' },
  { v: 'DataOwner', l: 'Data Owner' },
  { v: 'Steward',   l: 'Steward' },
  { v: 'Analyst',   l: 'Analyst' },
  { v: 'Viewer',    l: 'Viewer' },
];
const ROL_LABEL: Record<string, string> = Object.fromEntries(ROLES.map((r) => [r.v, r.l]));

function fmtFecha(iso: string | null): string {
  if (!iso) return 'Nunca';
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

type ModalState = null | { modo: 'crear' } | { modo: 'editar'; row: UsuarioRow };

export function Usuarios() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const [rows, setRows]         = useState<UsuarioRow[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState('');
  const [modal, setModal]       = useState<ModalState>(null);

  async function load() {
    setCargando(true); setError('');
    try { setRows(await api.get<UsuarioRow[]>('/api/usuarios')); }
    catch (e: any) { setError(e.message || 'Error al cargar usuarios'); }
    finally { setCargando(false); }
  }
  useEffect(() => { load(); }, []);

  const activos = rows.filter((r) => r.usuarioActivo).length;
  const avatarInitials = usuario?.nombre?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'U';

  return (
    <div className="usr-page">
      <header className="usr-topbar">
        <button className="usr-back" onClick={() => navigate('/')} title="Volver al inicio">
          <ArrowLeft size={16} />
        </button>
        <div className="usr-logo"><img src="/logo-icon.png" alt="CII" /></div>
        <span className="usr-brand-sep" />
        <span className="usr-brand-name">NEXO I+D · Usuarios</span>
        <div className="usr-topbar-right">
          <span className="usr-topbar-user">{usuario?.nombre?.split(' ')[0]}</span>
          <div className="usr-avatar">{avatarInitials}</div>
          <button className="usr-logout" onClick={logout} title="Cerrar sesión"><LogOut size={14} /></button>
        </div>
      </header>

      <main className="usr-main">
        <div className="usr-head">
          <div>
            <h1 className="usr-title">Gestión de usuarios</h1>
            <p className="usr-sub">{rows.length} usuarios · {activos} activos</p>
          </div>
          <div className="usr-head-actions">
            <button className="usr-btn usr-btn-ghost" onClick={load} title="Recargar"><RefreshCw size={14} /></button>
            <button className="usr-btn usr-btn-primary" onClick={() => setModal({ modo: 'crear' })}>
              <Plus size={15} /> Nuevo usuario
            </button>
          </div>
        </div>

        {error && <div className="usr-error">{error}</div>}

        <div className="usr-table-wrap">
          <table className="usr-table">
            <thead>
              <tr>
                <th>Nombre</th><th>Correo</th><th>Rol</th><th>Cargo / Área</th>
                <th>Estado</th><th>Último acceso</th><th aria-label="acciones" />
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan={7} className="usr-empty">Cargando…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="usr-empty">Sin usuarios</td></tr>
              ) : rows.map((r) => (
                <tr key={r.usuarioId} className={r.usuarioActivo ? '' : 'usr-row-off'}>
                  <td>
                    <span className="usr-name">{r.usuarioNombre}</span>
                    {r.usuarioId === usuario?.usuarioId && <span className="usr-you">tú</span>}
                  </td>
                  <td className="usr-mono">{r.usuarioCorreo}</td>
                  <td>
                    <span className={`usr-rol usr-rol--${r.usuarioRol.toLowerCase()}`}>
                      {ROL_LABEL[r.usuarioRol] ?? r.usuarioRol}
                    </span>
                  </td>
                  <td>
                    <div>{r.usuarioCargo || '—'}</div>
                    {r.usuarioDepartamento && <div className="usr-dept">{r.usuarioDepartamento}</div>}
                  </td>
                  <td>
                    <span className={`usr-status ${r.usuarioActivo ? 'on' : 'off'}`}>
                      <i /> {r.usuarioActivo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="usr-muted">{fmtFecha(r.usuarioUltimoLogin)}</td>
                  <td className="usr-actions-cell">
                    <button className="usr-icon-btn" onClick={() => setModal({ modo: 'editar', row: r })} title="Editar usuario">
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modal && (
        <UsuarioModal
          key={modal.modo === 'editar' ? modal.row.usuarioId : 'crear'}
          state={modal}
          currentUserId={usuario?.usuarioId}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

// ── Contraseña aleatoria legible (sin caracteres ambiguos) ────────────────────
function genPassword(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const arr = new Uint32Array(12);
  crypto.getRandomValues(arr);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += chars[arr[i] % chars.length];
  return `${s}7a`; // garantiza longitud y variedad
}

interface ModalProps {
  state: { modo: 'crear' } | { modo: 'editar'; row: UsuarioRow };
  currentUserId?: number;
  onClose: () => void;
  onSaved: () => void;
}

function UsuarioModal({ state, currentUserId, onClose, onSaved }: ModalProps) {
  const esEditar  = state.modo === 'editar';
  const row       = esEditar ? state.row : undefined;
  const esYoMismo = esEditar && row!.usuarioId === currentUserId;

  const [correo, setCorreo]             = useState(row?.usuarioCorreo || '');
  const [nombre, setNombre]             = useState(row?.usuarioNombre || '');
  const [rol, setRol]                   = useState(row?.usuarioRol || 'Viewer');
  const [cargo, setCargo]               = useState(row?.usuarioCargo || '');
  const [departamento, setDepartamento] = useState(row?.usuarioDepartamento || '');
  const [activo, setActivo]             = useState(row?.usuarioActivo ?? true);
  const [password, setPassword]         = useState('');
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function guardar() {
    setError('');
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (!esEditar) {
      if (!correo.trim()) { setError('El correo es obligatorio'); return; }
      if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    } else if (password && password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres'); return;
    }
    setSaving(true);
    try {
      if (esEditar) {
        const body: Record<string, unknown> = {
          nombre: nombre.trim(),
          rol,
          cargo: cargo.trim() || null,
          departamento: departamento.trim() || null,
          activo,
        };
        if (password) body.password = password;
        await api.patch(`/api/usuarios/${row!.usuarioId}`, body);
      } else {
        await api.post('/api/usuarios', {
          correo: correo.trim(),
          nombre: nombre.trim(),
          password,
          rol,
          cargo: cargo.trim() || null,
          departamento: departamento.trim() || null,
        });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="usr-modal-overlay" onClick={onClose}>
      <div className="usr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="usr-modal-header">
          <h2>{esEditar ? 'Editar usuario' : 'Nuevo usuario'}</h2>
          <button className="usr-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="usr-modal-body">
          <label className="usr-field">
            <span>Correo {esEditar && <em>(no editable)</em>}</span>
            <input
              type="email" value={correo} disabled={esEditar}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="nombre@cindependencia.cl" autoFocus={!esEditar}
            />
          </label>

          <label className="usr-field">
            <span>Nombre</span>
            <input
              type="text" value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre y apellido" autoFocus={esEditar}
            />
          </label>

          <div className="usr-field-row">
            <label className="usr-field">
              <span>Rol</span>
              <select value={rol} onChange={(e) => setRol(e.target.value)} disabled={esYoMismo}>
                {ROLES.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}
              </select>
            </label>
            <label className="usr-field">
              <span>Cargo</span>
              <input
                type="text" value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ej. Técnico de Soporte"
              />
            </label>
          </div>

          <label className="usr-field">
            <span>Área / Departamento</span>
            <input
              type="text" value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              placeholder="Ej. Soporte TI"
            />
          </label>

          <label className="usr-field">
            <span>{esEditar ? 'Nueva contraseña' : 'Contraseña inicial'} {esEditar && <em>(en blanco = sin cambio)</em>}</span>
            <div className="usr-pass-row">
              <input
                type="text" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={esEditar ? '••••••••' : 'mínimo 8 caracteres'}
              />
              <button type="button" className="usr-btn usr-btn-ghost usr-btn-sm" onClick={() => setPassword(genPassword())}>
                Generar
              </button>
            </div>
          </label>

          {esEditar && (
            <label className="usr-checkbox">
              <input type="checkbox" checked={activo} disabled={esYoMismo} onChange={(e) => setActivo(e.target.checked)} />
              <span>Cuenta activa {esYoMismo && <em>(no puedes desactivarte)</em>}</span>
            </label>
          )}

          {error && <div className="usr-modal-error">{error}</div>}
        </div>

        <div className="usr-modal-footer">
          <button className="usr-btn usr-btn-ghost" onClick={onClose} disabled={saving}>Cancelar</button>
          <button className="usr-btn usr-btn-primary" onClick={guardar} disabled={saving}>
            {saving ? 'Guardando…' : esEditar ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}
