import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wrench, ArrowUpFromLine, Calendar, Activity, Globe,
  BarChart3, FileText, BookOpen, Phone, Box, Cpu, ClipboardList, Menu, LogOut,
  Download, Send, ClipboardCheck, QrCode, SatelliteDish, Network, Radio,
  MapPinned, Zap, ListChecks,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const PROTOCOLO_GROUPS = [
  {
    label: 'Visión general',
    items: [
      { tab: 'resumen', label: 'Resumen',      icon: LayoutDashboard },
      { tab: 'roles',   label: 'Roles & RACI', icon: Users },
    ],
  },
  {
    label: 'Enlace Starlink · Instalación',
    items: [
      { tab: 'activacion', label: 'Activación',           icon: QrCode },
      { tab: 'sitio',     label: 'Preparación del sitio', icon: MapPinned },
      { tab: 'starlink',  label: 'Instalación Starlink', icon: SatelliteDish },
      { tab: 'checkterreno', label: 'Checklist terreno', icon: ListChecks },
      { tab: 'topologia', label: 'Topología de red',     icon: Network },
      { tab: 'energia',   label: 'Energía y continuidad', icon: Zap },
      { tab: 'enlace',    label: 'Soporte de enlace',    icon: Radio },
    ],
  },
  {
    label: 'Monitoreo NetSensor',
    items: [
      { tab: 'hardware',    label: 'Hardware',          icon: Box },
      { tab: 'instalacion', label: 'Instalación nodo',  icon: Wrench },
      { tab: 'uso',         label: 'Uso en obra',       icon: ArrowUpFromLine },
      { tab: 'diagnostico', label: 'Diagnóstico',       icon: BarChart3 },
      { tab: 'remoto',      label: 'Soporte remoto',    icon: Globe },
      { tab: 'desconexion', label: 'Flujo desconexión', icon: Activity },
    ],
  },
  {
    label: 'Operación y soporte',
    items: [
      { tab: 'preventivo', label: 'Mant. preventivo', icon: Calendar },
      { tab: 'correctivo', label: 'Mant. correctivo', icon: Wrench },
      { tab: 'reporte',    label: 'Reporte semanal',  icon: ClipboardList },
      { tab: 'checklists', label: 'Checklists',       icon: ClipboardCheck },
      { tab: 'firmware',   label: 'Firmware',         icon: Cpu },
      { tab: 'manual',     label: 'Manual usuario',   icon: BookOpen },
    ],
  },
  {
    label: 'Referencia',
    items: [
      { tab: 'contactos', label: 'Contactos', icon: Phone },
      { tab: 'glosario',  label: 'Glosario',  icon: FileText },
    ],
  },
];

function printSection(label: string) {
  const origTitle = document.title;
  document.title = `Protocolo · ${label} · Independencia`;
  document.body.classList.add('print-mode');
  const cleanup = () => {
    document.body.classList.remove('print-mode');
    document.title = origTitle;
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  setTimeout(() => window.print(), 80);
  setTimeout(cleanup, 4000);
}

function sendByMail(label: string, proyecto: string) {
  const subject = encodeURIComponent(`Protocolo ${proyecto} · Sección: ${label}`);
  const body = encodeURIComponent(
    `Hola,\n\nTe comparto la sección "${label}" del Protocolo Operativo ${proyecto}.\n\n` +
    `Adjunta el PDF descargado desde la plataforma.\n\n` +
    `Plataforma: http://localhost:5173\n\n` +
    `Saludos,\nConstructora Independencia · I+D Hardware`
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  // Extraer la pestaña actual de la URL (ej. /proyectos/netsensor/resumen)
  const match = location.pathname.match(/\/proyectos\/[^/]+\/([^/]+)/);
  const activeTab = match?.[1] || 'resumen';
  const proyectoCodigo = location.pathname.match(/\/proyectos\/([^/]+)/)?.[1] || 'netsensor';
  const proyectoNombre = proyectoCodigo.charAt(0).toUpperCase() + proyectoCodigo.slice(1);

  return (
    <aside className="sidebar">
      <div className="sb-header">
        <div className="sb-brand">
          <div className="sb-logo"><img src="/logo-icon.png" alt="Independencia" /></div>
          {!collapsed && (
            <div className="sb-txt">
              <div className="sb-t">Independencia</div>
              <div className="sb-s">I+D Hardware</div>
            </div>
          )}
        </div>
        <button className="sb-toggle" onClick={onToggle} title="Colapsar / Expandir">
          <Menu size={16} />
        </button>
      </div>

      <nav className="sb-nav">
        {PROTOCOLO_GROUPS.map((group) => (
          <div key={group.label} className="sb-group">
            {!collapsed && <div className="sb-section-label">{group.label}</div>}
            {group.items.map((it) => {
              const Icon = it.icon;
              const active = activeTab === it.tab;
              return (
                <div
                  key={it.tab}
                  className={`sb-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(`/proyectos/${proyectoCodigo}/${it.tab}`)}
                  data-label={it.label}
                >
                  <span className="sb-ico"><Icon size={16} /></span>
                  {!collapsed && <span className="sb-lbl">{it.label}</span>}
                  {!collapsed && (
                    <span className="sb-actions">
                      <span
                        className="sb-act"
                        title="Descargar PDF de esta sección"
                        onClick={(e) => { e.stopPropagation(); navigate(`/proyectos/${proyectoCodigo}/${it.tab}`); setTimeout(() => printSection(it.label), 100); }}
                      >
                        <Download size={13} />
                      </span>
                      <span
                        className="sb-act"
                        title="Enviar por correo"
                        onClick={(e) => { e.stopPropagation(); sendByMail(it.label, proyectoNombre); }}
                      >
                        <Send size={13} />
                      </span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-user-avatar">{usuario?.nombre?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'U'}</div>
        {!collapsed && (
          <div className="sb-user-info">
            <div className="sb-user-n">{usuario?.nombre}</div>
            <div className="sb-user-r">{usuario?.cargo || usuario?.rol}</div>
          </div>
        )}
        <button className="sb-logout" onClick={logout} title="Cerrar sesión">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
