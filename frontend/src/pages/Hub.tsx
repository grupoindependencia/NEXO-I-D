import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Link2, Link2Off, Plus, X, Pencil, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { PROJECTS, LIFECYCLE_CONFIG, LIFECYCLE_ACCENT, type LifecycleStatus } from '@/config/projects';
import { LifecyclePicker } from '@/components/ui/LifecyclePicker';
import './Hub.css';

interface DbProject {
  proyectoCodigo: string;
  proyectoNombre: string;
  proyectoEyebrow: string | null;
  proyectoLifecycle: string;
  proyectoRelacionado: string | null;
  proyectoOrden: number;
}

const CONN_ICON = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="4"  cy="8" r="2.5" fill="currentColor" />
    <circle cx="12" cy="8" r="2.5" fill="currentColor" />
    <path d="M6.5 8h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ── Related-project picker (inline admin control) ────────────────────────────

interface RelatedPickerProps {
  codigo: string;
  relacionado: string | null;
  allProjects: { codigo: string; nombre: string }[];
  saving: boolean;
  onSelect: (related: string | null) => void;
  onOpenChange: (open: boolean) => void;
}

function RelatedPicker({ codigo, relacionado, allProjects, saving, onSelect, onOpenChange }: RelatedPickerProps) {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLDivElement>(null);
  const others = allProjects.filter(p => p.codigo !== codigo);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation(); // prevent card body navigation
    const next = !open;
    setOpen(next);
    onOpenChange(next);
  }

  function close() {
    setOpen(false);
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) close();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handleSelect(val: string | null) {
    close();
    onSelect(val);
  }

  const relatedProject = allProjects.find(p => p.codigo === relacionado);

  return (
    <div ref={ref} className="hub-related-wrap">
      <button
        className={`hub-conn-badge hub-conn-badge--admin ${relacionado ? '' : 'hub-conn-badge--empty'} ${saving ? 'saving' : ''}`}
        onClick={toggle}
        title={relacionado ? `Cruza con ${relatedProject?.nombre} · click para editar` : 'Sin relación · click para agregar'}
      >
        {relacionado ? CONN_ICON : <Link2Off size={11} />}
      </button>

      {open && (
        <div className="hub-related-dropdown">
          <div className="hub-related-dropdown-label">Proyecto relacionado</div>
          <button
            className={`hub-related-option ${!relacionado ? 'active' : ''}`}
            onClick={() => handleSelect(null)}
          >
            <Link2Off size={12} />
            Sin relación
          </button>
          {others.map(p => (
            <button
              key={p.codigo}
              className={`hub-related-option ${relacionado === p.codigo ? 'active' : ''}`}
              onClick={() => handleSelect(p.codigo)}
            >
              <Link2 size={12} />
              {p.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Hub ───────────────────────────────────────────────────────────────────────

export function Hub() {
  const navigate   = useNavigate();
  const { usuario, logout } = useAuth();

  const [dbProjects,    setDbProjects]    = useState<DbProject[]>([]);
  const [savingId,      setSavingId]      = useState<string | null>(null);
  const [savingRelId,   setSavingRelId]   = useState<string | null>(null);
  const [hoveredId,     setHoveredId]     = useState<string | null>(null);
  const [anyPickerOpen, setAnyPickerOpen] = useState(false);

  // New project modal
  const [showNewModal,  setShowNewModal]  = useState(false);
  const [newNombre,     setNewNombre]     = useState('');
  const [newCodigo,     setNewCodigo]     = useState('');
  const [newEyebrow,    setNewEyebrow]    = useState('Hardware I+D');
  const [newLifecycle,  setNewLifecycle]  = useState<LifecycleStatus>('investigacion');
  const [newError,      setNewError]      = useState('');
  const [creating,      setCreating]      = useState(false);

  // Edit project modal
  const [editTarget,   setEditTarget]    = useState<{ codigo: string; nombre: string; eyebrow: string } | null>(null);
  const [editNombre,   setEditNombre]    = useState('');
  const [editEyebrow,  setEditEyebrow]   = useState('');
  const [editError,    setEditError]     = useState('');
  const [editSaving,   setEditSaving]    = useState(false);

  // When any picker closes, clear stale hover state so dimming doesn't persist
  useEffect(() => {
    if (!anyPickerOpen) setHoveredId(null);
  }, [anyPickerOpen]);

  // Escape closes modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (editTarget) setEditTarget(null);
      else if (showNewModal) setShowNewModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showNewModal, editTarget]);

  function toSlug(text: string): string {
    return text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function generateCode(text: string): string {
    const existing = dbProjects.map(p => p.proyectoCodigo);
    const prefix = (toSlug(text) || 'pry').slice(0, 4).replace(/-+$/, '') || 'pry';
    let n = dbProjects.length + 1;
    let code = `${prefix}-${String(n).padStart(3, '0')}`;
    while (existing.includes(code)) { n++; code = `${prefix}-${String(n).padStart(3, '0')}`; }
    return code;
  }

  function openEditModal(codigo: string, nombre: string, eyebrow: string) {
    setEditTarget({ codigo, nombre, eyebrow });
    setEditNombre(nombre); setEditEyebrow(eyebrow); setEditError('');
  }

  async function saveEdit() {
    if (!editTarget) return;
    setEditSaving(true); setEditError('');
    try {
      await api.patch(`/api/proyectos/${editTarget.codigo}`, { nombre: editNombre, eyebrow: editEyebrow });
      setDbProjects(prev => prev.map(p =>
        p.proyectoCodigo === editTarget.codigo
          ? { ...p, proyectoNombre: editNombre, proyectoEyebrow: editEyebrow }
          : p,
      ));
      setEditTarget(null);
    } catch (err: any) { setEditError(err.message || 'Error al guardar'); }
    finally { setEditSaving(false); }
  }

  function openNewModal() {
    setNewNombre(''); setNewCodigo(''); setNewEyebrow('Hardware I+D');
    setNewLifecycle('investigacion'); setNewError('');
    setShowNewModal(true);
  }

  async function createProject() {
    setCreating(true); setNewError('');
    try {
      const created = await api.post<DbProject & { proyectoCodigo: string }>('/api/proyectos', {
        nombre: newNombre, codigo: newCodigo, eyebrow: newEyebrow, lifecycle: newLifecycle,
      });
      const maxOrden = dbProjects.reduce((m, p) => Math.max(m, p.proyectoOrden), 0);
      setDbProjects(prev => [...prev, {
        proyectoCodigo:      created.proyectoCodigo,
        proyectoNombre:      newNombre,
        proyectoEyebrow:     newEyebrow,
        proyectoLifecycle:   newLifecycle,
        proyectoRelacionado: null,
        proyectoOrden:       maxOrden + 1,
      }]);
      setShowNewModal(false);
      navigate(`/p/${created.proyectoCodigo}/resumen`);
    } catch (err: any) {
      setNewError(err.message || 'Error al crear el proyecto');
    } finally {
      setCreating(false);
    }
  }

  const isAdmin = usuario?.rol === 'Admin' || usuario?.rol === 'DataOwner';
  const avatarInitials = usuario?.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U';

  useEffect(() => {
    api.get<DbProject[]>('/api/proyectos')
      .then(setDbProjects)
      .catch(() => {});
  }, []);

  // Merge static config with live DB data + include dynamically created projects, sorted by orden
  const projects = [
    ...PROJECTS.map(p => {
      const db = dbProjects.find(d => d.proyectoCodigo === p.codigo);
      return {
        ...p,
        nombre:      db?.proyectoNombre    ?? p.nombre,
        eyebrow:     db?.proyectoEyebrow   ?? p.eyebrow,
        lifecycle:   (db?.proyectoLifecycle as LifecycleStatus) ?? p.lifecycle,
        relacionado: db ? db.proyectoRelacionado : (p.relacionado ?? null),
        orden:       db?.proyectoOrden ?? 999,
      };
    }),
    ...dbProjects
      .filter(db => !PROJECTS.some(p => p.codigo === db.proyectoCodigo))
      .map(db => ({
        codigo:      db.proyectoCodigo,
        nombre:      db.proyectoNombre,
        eyebrow:     db.proyectoEyebrow ?? 'Hardware I+D',
        lifecycle:   (db.proyectoLifecycle ?? 'investigacion') as LifecycleStatus,
        relacionado: db.proyectoRelacionado ?? null,
        orden:       db.proyectoOrden,
      })),
  ].sort((a, b) => a.orden - b.orden);

  // Hover dimming — frozen while any picker is open
  const hoveredProject = projects.find(p => p.codigo === hoveredId);
  const relatedId = hoveredProject?.relacionado;

  function cardState(codigo: string): string {
    if (anyPickerOpen || !hoveredId) return '';
    if (codigo === hoveredId) return '';
    if (relatedId && codigo === relatedId) return 'related';
    return 'dimmed';
  }

  function onCardEnter(codigo: string) {
    if (anyPickerOpen) return;
    setHoveredId(codigo);
  }
  function onCardLeave() {
    if (anyPickerOpen) return;
    setHoveredId(null);
  }

  // Lifecycle update
  async function updateLifecycle(codigo: string, lifecycle: LifecycleStatus) {
    setSavingId(codigo);
    setDbProjects(prev => prev.map(p =>
      p.proyectoCodigo === codigo ? { ...p, proyectoLifecycle: lifecycle } : p,
    ));
    try {
      await api.patch(`/api/proyectos/${codigo}`, { lifecycle });
    } catch {
      const fresh = await api.get<DbProject[]>('/api/proyectos').catch(() => null);
      if (fresh) setDbProjects(fresh);
    } finally {
      setSavingId(null);
    }
  }

  // Related-project update
  async function updateRelated(codigo: string, relacionado: string | null) {
    setSavingRelId(codigo);
    setDbProjects(prev => prev.map(p =>
      p.proyectoCodigo === codigo ? { ...p, proyectoRelacionado: relacionado } : p,
    ));
    try {
      await api.patch(`/api/proyectos/${codigo}`, { relacionado });
    } catch {
      const fresh = await api.get<DbProject[]>('/api/proyectos').catch(() => null);
      if (fresh) setDbProjects(fresh);
    } finally {
      setSavingRelId(null);
    }
  }

  const counts = {
    operativo:     projects.filter(p => p.lifecycle === 'operativo').length,
    piloto:        projects.filter(p => p.lifecycle === 'piloto').length,
    desarrollo:    projects.filter(p => p.lifecycle === 'desarrollo').length,
    investigacion: projects.filter(p => p.lifecycle === 'investigacion').length,
    pausa:         projects.filter(p => p.lifecycle === 'pausa').length,
  };

  return (
    <div className="hub-page">
      <header className="hub-topbar">
        <div className="hub-brand">
          <div className="hub-logo"><img src="/logo-icon.png" alt="CII" /></div>
          <span className="hub-brand-sep" />
          <span className="hub-brand-name">NEXO I+D</span>
        </div>
        <div className="hub-topbar-right">
          {isAdmin && <span className="hub-admin-badge">Admin</span>}
          {isAdmin && (
            <button className="hub-users-btn" onClick={() => navigate('/usuarios')} title="Gestión de usuarios">
              <Users size={13} /> Usuarios
            </button>
          )}
          <span className="hub-topbar-user">{usuario?.nombre?.split(' ')[0]}</span>
          <div className="hub-avatar">{avatarInitials}</div>
          <button className="hub-logout" onClick={logout} title="Cerrar sesión">
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <main className="hub-main">
        <div className="hub-header">
          <div>
            <h1 className="hub-title">Proyectos I+D Hardware</h1>
            <p className="hub-sub">
              {projects.length} proyectos
              {counts.operativo > 0     && ` · ${counts.operativo} operativo${counts.operativo > 1 ? 's' : ''}`}
              {counts.piloto > 0        && ` · ${counts.piloto} en piloto`}
              {counts.desarrollo > 0    && ` · ${counts.desarrollo} en desarrollo`}
              {counts.investigacion > 0 && ` · ${counts.investigacion} en investigación`}
              {counts.pausa > 0         && ` · ${counts.pausa} en pausa`}
            </p>
          </div>
        </div>

        <div className="hub-grid">
          {projects.map(p => {
            const accent = LIFECYCLE_ACCENT[p.lifecycle];
            const state  = cardState(p.codigo);

            return (
              <div
                key={p.codigo}
                className={`hub-card ${state}`}
                style={{ '--hub-card-accent': accent } as React.CSSProperties}
                onMouseEnter={() => onCardEnter(p.codigo)}
                onMouseLeave={onCardLeave}
              >
                {/* Clickable body — navigates to project */}
                <div
                  className="hub-card-body"
                  onClick={() => navigate(`/p/${p.codigo}/resumen`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/p/${p.codigo}/resumen`)}
                >
                  <div className="hub-card-top">
                    <span className="hub-card-eyebrow">{p.eyebrow}</span>

                    {/* Connection badge: static for viewers, interactive for admins */}
                    {isAdmin ? (
                      <RelatedPicker
                        codigo={p.codigo}
                        relacionado={p.relacionado}
                        allProjects={projects}
                        saving={savingRelId === p.codigo}
                        onSelect={val => updateRelated(p.codigo, val)}
                        onOpenChange={open => setAnyPickerOpen(open)}
                      />
                    ) : p.relacionado ? (
                      <span
                        className="hub-conn-badge"
                        title={`Cruza con ${projects.find(x => x.codigo === p.relacionado)?.nombre}`}
                      >
                        {CONN_ICON}
                      </span>
                    ) : null}
                  </div>
                  <div className="hub-card-name">{p.nombre}</div>
                  <div className="hub-card-code">#{String(p.orden).padStart(3, '0')}</div>
                </div>

                {/* Footer: lifecycle picker + edit button */}
                <div className="hub-card-footer">
                  <LifecyclePicker
                    lifecycle={p.lifecycle}
                    editable={isAdmin}
                    saving={savingId === p.codigo}
                    onChange={lc => updateLifecycle(p.codigo, lc)}
                    onOpenChange={open => setAnyPickerOpen(open)}
                  />
                  {isAdmin && (
                    <button
                      className="hub-edit-btn"
                      onClick={e => { e.stopPropagation(); openEditModal(p.codigo, p.nombre, p.eyebrow ?? ''); }}
                      title="Editar proyecto"
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add card always last */}
          {isAdmin && (
            <div
              className="hub-card hub-card--add"
              onClick={openNewModal}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && openNewModal()}
            >
              <Plus size={26} className="hub-add-icon" />
              <span className="hub-add-label">Nuevo proyecto</span>
            </div>
          )}
        </div>

        <div className="hub-legend">
          <span className="hub-legend-label">Estado</span>
          {(Object.entries(LIFECYCLE_CONFIG) as [string, { label: string; color: string; bg: string }][]).map(([key, cfg]) => (
            <div key={key} className="hub-legend-item">
              <div className="hub-legend-dot" style={{ background: cfg.color }} />
              {cfg.label}
            </div>
          ))}
          <div className="hub-legend-sep" />
          <div className="hub-legend-item">
            <span className="hub-conn-badge">{CONN_ICON}</span>
            Cruza con otro proyecto
          </div>
          {isAdmin && (
            <>
              <div className="hub-legend-sep" />
              <div className="hub-legend-item hub-legend-admin">
                Toca el estado o el ícono de conexión para editar
              </div>
            </>
          )}
        </div>
      </main>

      {/* Edit project modal */}
      {editTarget && (
        <div className="hub-modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="hub-modal" onClick={e => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h2>Editar proyecto</h2>
              <button className="hub-modal-close" onClick={() => setEditTarget(null)}><X size={15} /></button>
            </div>
            <div className="hub-modal-body">
              <label>
                <span>Nombre</span>
                <input type="text" value={editNombre} onChange={e => setEditNombre(e.target.value)} autoFocus />
              </label>
              <label>
                <span>Categoría</span>
                <input type="text" value={editEyebrow} onChange={e => setEditEyebrow(e.target.value)} />
              </label>
              <div className="hub-modal-hint" style={{ color: 'var(--ink-3)', fontSize: '11px' }}>
                Código: <code>#{editTarget.codigo}</code>
              </div>
              {editError && <div className="hub-modal-error">{editError}</div>}
            </div>
            <div className="hub-modal-footer">
              <button className="hub-modal-cancel" onClick={() => setEditTarget(null)}>Cancelar</button>
              <button className="hub-modal-submit" onClick={saveEdit} disabled={!editNombre.trim() || editSaving}>
                {editSaving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New project modal */}
      {showNewModal && (
        <div className="hub-modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="hub-modal" onClick={e => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h2>Nuevo proyecto</h2>
              <button className="hub-modal-close" onClick={() => setShowNewModal(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="hub-modal-body">
              <label>
                <span>Nombre del proyecto</span>
                <input
                  type="text"
                  value={newNombre}
                  onChange={e => { setNewNombre(e.target.value); setNewCodigo(generateCode(e.target.value)); }}
                  placeholder="Ej. Control de Acceso"
                  autoFocus
                />
              </label>
              <label>
                <span>Código único</span>
                <input
                  type="text"
                  value={newCodigo}
                  onChange={e => setNewCodigo(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="control-acceso"
                />
                <span className="hub-modal-hint">Solo minúsculas, números y guiones</span>
              </label>
              <label>
                <span>Categoría</span>
                <input
                  type="text"
                  value={newEyebrow}
                  onChange={e => setNewEyebrow(e.target.value)}
                  placeholder="Hardware I+D"
                />
              </label>
              <div className="hub-modal-row">
                <span className="hub-modal-field-label">Estado inicial</span>
                <LifecyclePicker lifecycle={newLifecycle} editable onChange={lc => setNewLifecycle(lc)} />
              </div>
              {newError && <div className="hub-modal-error">{newError}</div>}
            </div>
            <div className="hub-modal-footer">
              <button className="hub-modal-cancel" onClick={() => setShowNewModal(false)}>Cancelar</button>
              <button
                className="hub-modal-submit"
                onClick={createProject}
                disabled={!newNombre.trim() || !newCodigo.trim() || creating}
              >
                {creating ? 'Creando…' : 'Crear proyecto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
