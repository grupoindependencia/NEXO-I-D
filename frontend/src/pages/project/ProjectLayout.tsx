import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { getProject, DEFAULT_SIDEBAR_GROUPS, type LifecycleStatus, type ProjectConfig } from '@/config/projects';
import { LifecyclePicker } from '@/components/ui/LifecyclePicker';

// Conectividad / Internet sections
import { ResumenSection }             from '@/pages/protocolo/sections/Resumen';
import { RolesSection }               from '@/pages/protocolo/sections/Roles';
import { SitioSection }               from '@/pages/protocolo/sections/Sitio';
import { MaterialesSection }          from '@/pages/protocolo/sections/Materiales';
import { PlanificacionSection }       from '@/pages/protocolo/sections/Planificacion';
import { FlujoSection }               from '@/pages/protocolo/sections/Flujo';
import { ChecklistPrepSection }       from '@/pages/protocolo/sections/ChecklistPrep';
import { InstalacionInternetSection } from '@/pages/protocolo/sections/InstalacionInternet';
import { VerificacionSection }        from '@/pages/protocolo/sections/Verificacion';
import { ChecklistInstSection }       from '@/pages/protocolo/sections/ChecklistInst';
import { PreventivoSection }          from '@/pages/protocolo/sections/Preventivo';
import { CorrectivoSection }          from '@/pages/protocolo/sections/Correctivo';
import { ReporteSection }             from '@/pages/protocolo/sections/Reporte';
import { ChecklistOpSection }         from '@/pages/protocolo/sections/ChecklistOp';
import { DocsSection }                from '@/pages/protocolo/sections/Docs';
import { ContactosSection }           from '@/pages/protocolo/sections/Contactos';
import { GlosarioSection }            from '@/pages/protocolo/sections/Glosario';
// NetSensor-specific
import { HardwareSection }       from '@/pages/protocolo/sections/Hardware';
import { InstalacionSection }    from '@/pages/protocolo/sections/Instalacion';
import { UsoSection }            from '@/pages/protocolo/sections/Uso';
import { DiagnosticoSection }    from '@/pages/protocolo/sections/Diagnostico';
import { RemotoSection }         from '@/pages/protocolo/sections/Remoto';
import { DesconexionSection }    from '@/pages/protocolo/sections/Desconexion';
import { PlaceholderSection }    from '@/pages/protocolo/sections/Placeholder';

import '../protocolo/Protocolo.css';
import './ProjectLayout.css';

const SECTION_COMPONENTS: Record<string, Record<string, React.ComponentType>> = {
  conectividad: {
    // Visión general
    resumen:          ResumenSection,
    roles:            RolesSection,
    // Preparación
    materiales:       MaterialesSection,
    planificacion:    PlanificacionSection,
    flujo:            FlujoSection,
    'checklist-prep': ChecklistPrepSection,
    // Instalación
    sitio:            SitioSection,
    instalacion:      InstalacionInternetSection,
    verificacion:     VerificacionSection,
    'checklist-inst': ChecklistInstSection,
    // Operación
    preventivo:       PreventivoSection,
    correctivo:       CorrectivoSection,
    reporte:          ReporteSection,
    'checklist-op':   ChecklistOpSection,
    // Referencia
    docs:             DocsSection,
    contactos:        ContactosSection,
    glosario:         GlosarioSection,
  },
  netsensor: {
    resumen:     ResumenSection,
    hardware:    HardwareSection,
    instalacion: InstalacionSection,
    uso:         UsoSection,
    diagnostico: DiagnosticoSection,
    remoto:      RemotoSection,
    desconexion: DesconexionSection,
    reporte:     ReporteSection,
    contactos:   ContactosSection,
    glosario:    GlosarioSection,
  },
};

// ── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  projectId: string;
  section: string;
  collapsed: boolean;
  onToggle: () => void;
}

function ProjectSidebar({ projectId, section, collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const project = getProject(projectId);

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    project?.sidebarGroups.forEach(g => { if (g.defaultOpen) initial.add(g.key); });
    return initial;
  });


  // Auto-open the group that contains the active section
  useEffect(() => {
    if (!project) return;
    for (const g of project.sidebarGroups) {
      if (g.sections.some(s => s.codigo === section)) {
        setOpenGroups(prev => new Set([...prev, g.key]));
        break;
      }
    }
  }, [section, project]);

  function toggleGroup(key: string) {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const avatarInitials = usuario?.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U';

  return (
    <aside className={`proj-sidebar ${collapsed ? 'proj-sidebar--coll' : ''}`}>
      <div className="proj-sb-header">
        <div className="proj-sb-brand">
          <div className="proj-sb-logo"><img src="/logo-icon.png" alt="CII" /></div>
          {!collapsed && (
            <div className="proj-sb-txt">
              <div className="proj-sb-t">Independencia</div>
              <div className="proj-sb-s">I+D Hardware</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="proj-sb-toggle" onClick={onToggle} title="Colapsar panel">
            <Menu size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button className="proj-sb-expand-tab" onClick={onToggle} title="Expandir panel">
          <ChevronRight size={13} />
        </button>
      )}

      <nav className="proj-sb-nav">
        {project?.sidebarGroups.map(group => {
          const isOpen = openGroups.has(group.key);
          return (
            <div key={group.key} className="proj-sb-group">
              {!collapsed && (
                <button
                  className={`proj-sb-group-header ${isOpen ? 'proj-sb-group-header--open' : ''}`}
                  onClick={() => toggleGroup(group.key)}
                >
                  <span className="proj-sb-group-label">{group.label}</span>
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
              )}
              {(isOpen || collapsed) && group.sections.map(s => {
                const Icon = s.icon;
                const active = s.codigo === section;
                return (
                  <div
                    key={s.codigo}
                    className={`proj-sb-item ${active ? 'active' : ''}`}
                    onClick={() => navigate(`/p/${projectId}/${s.codigo}`)}
                    title={collapsed ? s.label : undefined}
                  >
                    <span className="proj-sb-ico"><Icon size={16} /></span>
                    {!collapsed && <span className="proj-sb-lbl">{s.label}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="proj-sb-footer">
        {!collapsed && <div className="proj-sb-avatar">{avatarInitials}</div>}
        {!collapsed && (
          <div className="proj-sb-user-info">
            <div className="proj-sb-user-n">{usuario?.nombre}</div>
            <div className="proj-sb-user-r">{usuario?.cargo || usuario?.rol}</div>
          </div>
        )}
        <button className="proj-sb-logout" onClick={logout} title="Cerrar sesión">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  projectName: string;
  groupLabel: string;
  sectionLabel: string;
  lifecycle: LifecycleStatus;
  isAdmin: boolean;
  saving: boolean;
  onLifecycleChange: (lc: LifecycleStatus) => void;
}

function ProjectTopbar({ projectName, groupLabel, sectionLabel, lifecycle, isAdmin, saving, onLifecycleChange }: TopbarProps) {
  const navigate = useNavigate();

  return (
    <header className="proj-topbar">
      <button className="proj-topbar-home" onClick={() => navigate('/')} title="Volver a Proyectos">
        <Home size={14} />
        <span className="proj-topbar-home-label">Proyectos</span>
      </button>
      {projectName && (
        <>
          <span className="proj-topbar-sep" />
          <span className="proj-topbar-project-name">{projectName}</span>
        </>
      )}
      {groupLabel && (
        <>
          <span className="proj-topbar-sep" />
          <span className="proj-topbar-group">{groupLabel}</span>
        </>
      )}
      {sectionLabel && (
        <>
          <span className="proj-topbar-sep" />
          <span className="proj-topbar-section">{sectionLabel}</span>
        </>
      )}
      <span className="proj-topbar-lc-wrap">
        <LifecyclePicker
          lifecycle={lifecycle}
          editable={isAdmin}
          saving={saving}
          onChange={onLifecycleChange}
        />
      </span>
    </header>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function ProjectLayout() {
  const { projectId = '', section = 'resumen' } = useParams<{ projectId: string; section: string }>();
  const { usuario } = useAuth();

  const [collapsed,  setCollapsed]  = useState(true);
  const [lifecycle,  setLifecycle]  = useState<LifecycleStatus | null>(null);
  const [savingLc,   setSavingLc]   = useState(false);
  const [dbProject,  setDbProject]  = useState<{ proyectoNombre: string; proyectoEyebrow: string | null; proyectoLifecycle: string } | null>(null);

  const staticProject = getProject(projectId);
  const isAdmin = usuario?.rol === 'Admin' || usuario?.rol === 'DataOwner';

  // Fetch live data from DB (lifecycle for all, nombre+eyebrow for dynamic projects)
  useEffect(() => {
    if (!projectId) return;
    api.get<{ proyectoNombre: string; proyectoEyebrow: string | null; proyectoLifecycle: string }>(`/api/proyectos/${projectId}`)
      .then(d => { setLifecycle(d.proyectoLifecycle as LifecycleStatus); setDbProject(d); })
      .catch(() => {});
  }, [projectId]);

  // Merge static config with live DB data (DB name/eyebrow takes precedence when available)
  const project: ProjectConfig | null = staticProject ? {
    ...staticProject,
    nombre:  dbProject?.proyectoNombre  ?? staticProject.nombre,
    eyebrow: dbProject?.proyectoEyebrow ?? staticProject.eyebrow,
  } : (dbProject ? {
    codigo: projectId,
    nombre: dbProject.proyectoNombre,
    eyebrow: dbProject.proyectoEyebrow ?? 'Hardware I+D',
    lifecycle: dbProject.proyectoLifecycle as LifecycleStatus,
    sidebarGroups: DEFAULT_SIDEBAR_GROUPS,
  } : null);

  if (!staticProject && !dbProject) return null; // loading
  if (!project) return <Navigate to="/" replace />;

  const liveLifecycle = lifecycle ?? project.lifecycle;

  let sectionLabel = '';
  let groupLabel = '';
  for (const g of project.sidebarGroups) {
    const found = g.sections.find(s => s.codigo === section);
    if (found) { sectionLabel = found.label; groupLabel = g.label; break; }
  }

  async function updateLifecycle(lc: LifecycleStatus) {
    setSavingLc(true);
    setLifecycle(lc);
    try {
      await api.patch(`/api/proyectos/${projectId}`, { lifecycle: lc });
    } catch {
      const db = await api.get<{ proyectoLifecycle: string }>(`/api/proyectos/${projectId}`).catch(() => null);
      if (db) setLifecycle(db.proyectoLifecycle as LifecycleStatus);
    } finally {
      setSavingLc(false);
    }
  }

  const projectSections = SECTION_COMPONENTS[project.codigo] ?? {};
  const SectionComponent = projectSections[section] ?? null;
  const hasProjectSections = project.codigo in SECTION_COMPONENTS;

  return (
    <div className={`proj-app ${collapsed ? 'proj-app--coll' : ''}`}>
      <ProjectSidebar
        projectId={project.codigo}
        section={section}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
      />
      <div className="proj-content">
        <ProjectTopbar
          projectName={project.nombre}
          groupLabel={groupLabel}
          sectionLabel={sectionLabel}
          lifecycle={liveLifecycle}
          isAdmin={isAdmin}
          saving={savingLc}
          onLifecycleChange={updateLifecycle}
        />
        <main className="proj-main">
          {section === 'resumen' && (
            <div className="project-banner">
              <div className="pb-eyebrow">{project.eyebrow}</div>
              <h1>{project.nombre}</h1>
            </div>
          )}
          {SectionComponent ? (
            <SectionComponent />
          ) : (
            <PlaceholderSection
              titulo={sectionLabel || section}
              proyecto={project.nombre}
              enPreparacion={!hasProjectSections}
            />
          )}
        </main>
      </div>
    </div>
  );
}
