import {
  LayoutDashboard, MapPinned, Network, Zap,
  Calendar, Wrench, ClipboardList, ClipboardCheck, BookOpen, Phone, FileText,
  Box, Package, Workflow, ShieldCheck,
  ArrowUpFromLine, BarChart3, Globe, Activity, Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type LifecycleStatus = 'investigacion' | 'desarrollo' | 'piloto' | 'operativo' | 'pausa';

export interface SidebarSection {
  codigo: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarGroup {
  key: string;
  label: string;
  defaultOpen: boolean;
  sections: SidebarSection[];
}

export interface ProjectConfig {
  codigo: string;
  nombre: string;
  eyebrow: string;
  lifecycle: LifecycleStatus;
  relacionado?: string;
  sidebarGroups: SidebarGroup[];
}

export const LIFECYCLE_CONFIG: Record<LifecycleStatus, { label: string; color: string; bg: string }> = {
  investigacion: { label: 'Investigación', color: '#6B3FA0', bg: '#F0EBF8' },
  desarrollo:    { label: 'Desarrollo',    color: '#9A5A1A', bg: '#F6EFE7' },
  piloto:        { label: 'Piloto',        color: '#1865A8', bg: '#EBF2FA' },
  operativo:     { label: 'Operativo',     color: '#00684A', bg: '#E6F2ED' },
  pausa:         { label: 'En pausa',      color: '#7A8580', bg: '#EDF0EE' },
};

export const LIFECYCLE_ACCENT: Record<LifecycleStatus, string> = {
  investigacion: '#6B3FA0',
  desarrollo:    '#9A5A1A',
  piloto:        '#1865A8',
  operativo:     '#00684A',
  pausa:         '#C0C8C4',
};

export const PROJECTS: ProjectConfig[] = [
  {
    codigo: 'conectividad',
    nombre: 'Conectividad en Obra',
    eyebrow: 'Protocolo de conectividad',
    lifecycle: 'operativo',
    relacionado: 'netsensor',
    sidebarGroups: [
      {
        key: 'general',
        label: 'Visión general',
        defaultOpen: true,
        sections: [
          { codigo: 'resumen', label: 'Resumen',        icon: LayoutDashboard },
          { codigo: 'roles',   label: 'Equipo y roles', icon: Users },
        ],
      },
      {
        key: 'preparacion',
        label: 'Preparación',
        defaultOpen: false,
        sections: [
          { codigo: 'materiales',     label: 'Materiales y equipos', icon: Package },
          { codigo: 'planificacion',  label: 'Planificación',         icon: Calendar },
          { codigo: 'flujo',          label: 'Flujo de trabajo',      icon: Workflow },
          { codigo: 'checklist-prep', label: 'Checklist',             icon: ClipboardCheck },
        ],
      },
      {
        key: 'instalacion',
        label: 'Instalación',
        defaultOpen: false,
        sections: [
          { codigo: 'sitio',          label: 'Preparación del sitio', icon: MapPinned },
          { codigo: 'instalacion',    label: 'Instalación',           icon: Wrench },
          { codigo: 'verificacion',   label: 'Verificación',          icon: ShieldCheck },
          { codigo: 'checklist-inst', label: 'Checklist',             icon: ClipboardCheck },
        ],
      },
      {
        key: 'operacion',
        label: 'Operación',
        defaultOpen: false,
        sections: [
          { codigo: 'preventivo',   label: 'Mant. preventiva', icon: Calendar },
          { codigo: 'correctivo',   label: 'Mant. correctiva', icon: Wrench },
          { codigo: 'reporte',      label: 'Reporte semanal',  icon: ClipboardList },
          { codigo: 'checklist-op', label: 'Checklist',        icon: ClipboardCheck },
        ],
      },
      {
        key: 'referencia',
        label: 'Referencia',
        defaultOpen: false,
        sections: [
          { codigo: 'docs',      label: 'Documentación técnica', icon: BookOpen },
          { codigo: 'contactos', label: 'Contactos',             icon: Phone },
          { codigo: 'glosario',  label: 'Glosario',              icon: FileText },
        ],
      },
    ],
  },
  {
    codigo: 'netsensor',
    nombre: 'NetSensor',
    eyebrow: 'Hardware I+D',
    lifecycle: 'piloto',
    relacionado: 'conectividad',
    sidebarGroups: [
      {
        key: 'general',
        label: 'Visión general',
        defaultOpen: true,
        sections: [
          { codigo: 'resumen', label: 'Resumen', icon: LayoutDashboard },
        ],
      },
      {
        key: 'fabricacion',
        label: 'Fabricación',
        defaultOpen: true,
        sections: [
          { codigo: 'hardware', label: 'Diseño físico', icon: Box },
        ],
      },
      {
        key: 'instalacion',
        label: 'Instalación',
        defaultOpen: true,
        sections: [
          { codigo: 'instalacion', label: 'Instalación nodo', icon: Wrench },
        ],
      },
      {
        key: 'operacion',
        label: 'Operación',
        defaultOpen: false,
        sections: [
          { codigo: 'uso',         label: 'Uso en obra',       icon: ArrowUpFromLine },
          { codigo: 'diagnostico', label: 'Diagnóstico',       icon: BarChart3 },
          { codigo: 'remoto',      label: 'Soporte remoto',    icon: Globe },
          { codigo: 'desconexion', label: 'Flujo desconexión', icon: Activity },
          { codigo: 'reporte',     label: 'Reporte semanal',   icon: ClipboardList },
        ],
      },
      {
        key: 'referencia',
        label: 'Referencia',
        defaultOpen: false,
        sections: [
          { codigo: 'contactos', label: 'Contactos', icon: Phone },
          { codigo: 'glosario',  label: 'Glosario',  icon: FileText },
        ],
      },
    ],
  },
  {
    codigo: 'lpr',
    nombre: 'Cámaras LPR',
    eyebrow: 'Hardware I+D',
    lifecycle: 'investigacion',
    relacionado: 'cubicacion',
    sidebarGroups: [
      {
        key: 'general',
        label: 'Visión general',
        defaultOpen: true,
        sections: [
          { codigo: 'resumen', label: 'Resumen', icon: LayoutDashboard },
        ],
      },
    ],
  },
  {
    codigo: 'dumper',
    nombre: 'Control de Dumper',
    eyebrow: 'Hardware I+D',
    lifecycle: 'desarrollo',
    sidebarGroups: [
      {
        key: 'general',
        label: 'Visión general',
        defaultOpen: true,
        sections: [
          { codigo: 'resumen', label: 'Resumen', icon: LayoutDashboard },
        ],
      },
    ],
  },
  {
    codigo: 'cubicacion',
    nombre: 'Cubicación',
    eyebrow: 'Hardware I+D',
    lifecycle: 'pausa',
    relacionado: 'lpr',
    sidebarGroups: [
      {
        key: 'general',
        label: 'Visión general',
        defaultOpen: true,
        sections: [
          { codigo: 'resumen', label: 'Resumen', icon: LayoutDashboard },
        ],
      },
    ],
  },
];

export const DEFAULT_SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    key: 'general',
    label: 'Visión general',
    defaultOpen: true,
    sections: [
      { codigo: 'resumen', label: 'Resumen',        icon: LayoutDashboard },
      { codigo: 'roles',   label: 'Equipo y roles', icon: Users },
    ],
  },
  {
    key: 'preparacion',
    label: 'Preparación',
    defaultOpen: false,
    sections: [
      { codigo: 'materiales',     label: 'Materiales y equipos', icon: Package },
      { codigo: 'planificacion',  label: 'Planificación',         icon: Calendar },
      { codigo: 'flujo',          label: 'Flujo de trabajo',      icon: Workflow },
      { codigo: 'checklist-prep', label: 'Checklist',             icon: ClipboardCheck },
    ],
  },
  {
    key: 'instalacion',
    label: 'Instalación',
    defaultOpen: false,
    sections: [
      { codigo: 'sitio',          label: 'Preparación del sitio', icon: MapPinned },
      { codigo: 'instalacion',    label: 'Instalación',           icon: Wrench },
      { codigo: 'verificacion',   label: 'Verificación',          icon: ShieldCheck },
      { codigo: 'checklist-inst', label: 'Checklist',             icon: ClipboardCheck },
    ],
  },
  {
    key: 'operacion',
    label: 'Operación',
    defaultOpen: false,
    sections: [
      { codigo: 'preventivo',   label: 'Mant. preventiva', icon: Calendar },
      { codigo: 'correctivo',   label: 'Mant. correctiva', icon: Wrench },
      { codigo: 'reporte',      label: 'Reporte semanal',  icon: ClipboardList },
      { codigo: 'checklist-op', label: 'Checklist',        icon: ClipboardCheck },
    ],
  },
  {
    key: 'referencia',
    label: 'Referencia',
    defaultOpen: false,
    sections: [
      { codigo: 'docs',      label: 'Documentación técnica', icon: BookOpen },
      { codigo: 'contactos', label: 'Contactos',             icon: Phone },
      { codigo: 'glosario',  label: 'Glosario',              icon: FileText },
    ],
  },
];

export function getProject(codigo: string): ProjectConfig | undefined {
  return PROJECTS.find(p => p.codigo === codigo);
}
