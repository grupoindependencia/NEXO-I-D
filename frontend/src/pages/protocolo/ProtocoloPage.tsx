import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { ResumenSection } from './sections/Resumen';
import { ActivacionSection } from './sections/Activacion';
import { SitioSection } from './sections/Sitio';
import { StarlinkSection } from './sections/Starlink';
import { ChecklistTerrenoSection } from './sections/ChecklistTerreno';
import { TopologiaSection } from './sections/Topologia';
import { EnergiaSection } from './sections/Energia';
import { EnlaceSection } from './sections/Enlace';
import { HardwareSection } from './sections/Hardware';
import { RolesSection } from './sections/Roles';
import { InstalacionSection } from './sections/Instalacion';
import { UsoSection } from './sections/Uso';
import { PreventivoSection } from './sections/Preventivo';
import { CorrectivoSection } from './sections/Correctivo';
import { DesconexionSection } from './sections/Desconexion';
import { RemotoSection } from './sections/Remoto';
import { DiagnosticoSection } from './sections/Diagnostico';
import { ReporteSection } from './sections/Reporte';
import { ChecklistsSection } from './sections/Checklists';
import { FirmwareSection } from './sections/Firmware';
import { ManualSection } from './sections/Manual';
import { ContactosSection } from './sections/Contactos';
import { GlosarioSection } from './sections/Glosario';
import { PlaceholderSection } from './sections/Placeholder';
import './Protocolo.css';

interface ProyectoDetalle {
  proyectoId: number;
  proyectoCodigo: string;
  proyectoNombre: string;
  proyectoTitulo?: string | null;
  proyectoEyebrow?: string;
  proyectoSubtitulo?: string;
}

const SECCION_LABELS: Record<string, string> = {
  resumen: 'Resumen ejecutivo',
  activacion: 'Activación',
  sitio: 'Preparación del sitio',
  starlink: 'Instalación Starlink',
  checkterreno: 'Checklist terreno',
  topologia: 'Topología de red',
  energia: 'Energía y continuidad',
  enlace: 'Soporte de enlace',
  hardware: 'Diseño físico',
  roles: 'Roles y RACI',
  instalacion: 'Instalación del nodo',
  uso: 'Uso en obra',
  preventivo: 'Mantenimiento preventivo',
  correctivo: 'Mantenimiento correctivo',
  desconexion: 'Flujo de desconexión',
  remoto: 'Soporte remoto',
  diagnostico: 'Diagnóstico',
  reporte: 'Reporte semanal',
  checklists: 'Checklists',
  firmware: 'Actualización de firmware',
  manual: 'Manual de usuario',
  contactos: 'Contactos',
  glosario: 'Glosario',
};

// Mapa de sección → componente. Para nuevos proyectos basta replicar este mapa.
const NETSENSOR_SECTIONS: Record<string, React.ComponentType> = {
  resumen:     ResumenSection,
  activacion:  ActivacionSection,
  sitio:       SitioSection,
  starlink:    StarlinkSection,
  checkterreno: ChecklistTerrenoSection,
  topologia:   TopologiaSection,
  energia:     EnergiaSection,
  enlace:      EnlaceSection,
  hardware:    HardwareSection,
  roles:       RolesSection,
  instalacion: InstalacionSection,
  uso:         UsoSection,
  preventivo:  PreventivoSection,
  correctivo:  CorrectivoSection,
  desconexion: DesconexionSection,
  remoto:      RemotoSection,
  diagnostico: DiagnosticoSection,
  reporte:     ReporteSection,
  checklists:  ChecklistsSection,
  firmware:    FirmwareSection,
  manual:      ManualSection,
  contactos:   ContactosSection,
  glosario:    GlosarioSection,
};

export function ProtocoloPage() {
  const { codigo, seccion } = useParams<{ codigo: string; seccion: string }>();
  const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!codigo) return;
    setCargando(true);
    api.get<ProyectoDetalle>(`/api/proyectos/${codigo}`)
      .then(setProyecto)
      .catch(() => setProyecto(null))
      .finally(() => setCargando(false));
  }, [codigo]);

  if (cargando) return <div className="proto-loading">Cargando proyecto…</div>;
  if (!proyecto) return <div className="proto-loading">Proyecto no encontrado</div>;

  const seccionActiva = seccion || 'resumen';
  const isNetsensor = codigo === 'netsensor';

  // Despachar la sección del proyecto activo
  const SectionComponent = isNetsensor ? NETSENSOR_SECTIONS[seccionActiva] : null;

  return (
    <>
      {seccionActiva === 'resumen' && (
        <div className="project-banner">
          <div className="pb-eyebrow">{proyecto.proyectoEyebrow}</div>
          <h1>{proyecto.proyectoTitulo || proyecto.proyectoNombre}</h1>
          <p>{proyecto.proyectoSubtitulo}</p>
        </div>
      )}

      {SectionComponent ? (
        <SectionComponent />
      ) : (
        <PlaceholderSection
          titulo={SECCION_LABELS[seccionActiva] || seccionActiva}
          proyecto={proyecto.proyectoNombre}
          enPreparacion={!isNetsensor}
        />
      )}
    </>
  );
}
