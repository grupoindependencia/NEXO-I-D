import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';

interface TimelineEntryProps {
  label: string;
  title: string;
  description: string;
}

function TimelineEntry({ label, title, description }: TimelineEntryProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '12px 16px',
        background: 'var(--bg-card, #f9fafb)',
        borderRadius: 8,
        borderLeft: '3px solid #22c55e',
      }}
    >
      <div
        style={{
          minWidth: 110,
          fontWeight: 700,
          color: '#16a34a',
          fontSize: 13,
          paddingTop: 2,
        }}
      >
        {label}
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted, #6b7280)' }}>{description}</div>
      </div>
    </div>
  );
}

export function PlanificacionSection() {
  return (
    <div>
      <PageHeader
        titulo="Planificación"
        subtitulo="Coordinación y tiempos previos a la salida a terreno."
        tag="Preparación"
      />

      <Callout tipo="warn" titulo="Tiempo mínimo de anticipación">
        Coordinar con al menos <strong>5 días hábiles</strong> antes de la fecha estimada de
        instalación. Instalaciones urgentes requieren aprobación del Jefe de Departamento.
      </Callout>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        <TimelineEntry
          label="D-10 a D-7"
          title="Recepción y análisis del ticket"
          description="Llega el ticket, se realiza la evaluación inicial de la obra y se determina si corresponde BAM o Starlink según mapas de cobertura conocidos. Se establece el primer contacto con el Jefe de Obra."
        />
        <TimelineEntry
          label="D-5 a D-3"
          title="Levantamiento remoto del sitio"
          description="Videollamada o llamada telefónica con el Jefe de Obra para confirmar enchufes disponibles, puntos de montaje y distancias de cableado. Se identifican bloqueantes y se confirma la decisión tecnológica."
        />
        <TimelineEntry
          label="D-3"
          title="Preparación de materiales"
          description="Se arma el kit de equipos según la tecnología elegida. Se verifica que todos los equipos estén operativos. Se preparan las herramientas y se genera la lista de materiales para la visita."
        />
        <TimelineEntry
          label="D-2"
          title="Confirmación de logística"
          description="Se confirma fecha y hora con el Jefe de Obra, transporte interno y disponibilidad de EPP si se trabaja en altura."
        />
        <TimelineEntry
          label="D-1"
          title="Carga de equipos"
          description="Se cargan todos los equipos y herramientas. Revisión final del kit completo. Repaso del plano del sitio."
        />
        <TimelineEntry
          label="D · Instalación"
          title="Ejecución en terreno"
          description="Día de instalación. Duración estimada: medio día a día completo según complejidad del sitio."
        />
        <TimelineEntry
          label="D+1 a D+3"
          title="Seguimiento post-instalación"
          description="Se verifica la conectividad de forma remota, se comprueba que NetSensor esté reportando (si aplica) y se confirma con el Jefe de Obra que no hay inconvenientes."
        />
        <TimelineEntry
          label="D+7"
          title="Cierre formal"
          description="Se cierra el ticket, se actualiza la documentación y se confirma que el equipo queda registrado en la plataforma."
        />
      </div>

      <div className="grid-2" style={{ marginTop: 32 }}>
        <Card titulo="Estimación de tiempos en terreno">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
            <li>
              <strong>Instalación simple</strong> (1 oficina, BAM): 2 – 3 horas
            </li>
            <li>
              <strong>Instalación estándar</strong> (2 – 4 oficinas, Starlink): 4 – 6 horas
            </li>
            <li>
              <strong>Instalación compleja</strong> (5+ oficinas, múltiples pisos): día completo
            </li>
          </ul>
          <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--text-muted, #6b7280)' }}>
            Siempre contemplar imprevistos: mínimo +30 min de margen por visita.
          </p>
        </Card>

        <Card titulo="Coordinación con Jefe de Obra">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            El Jefe de Obra es el contacto clave en terreno. Autoriza el acceso, ayuda a
            identificar los puntos de corriente y recibe el briefing final del sistema instalado.
          </p>
          <p style={{ margin: '10px 0 0', lineHeight: 1.7 }}>
            Toda la coordinación de fechas y acceso debe gestionarse a través de él. No agendar
            visita sin confirmación explícita de su parte.
          </p>
        </Card>
      </div>

      <div style={{ marginTop: 24 }}>
        <Callout tipo="ok" titulo="Bloqueantes que posponen la visita">
          <p style={{ margin: '0 0 8px' }}>
            Si se detecta cualquiera de los siguientes puntos, se reagenda la visita. No se viaja
            hasta resolver el bloqueante:
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Sin corriente confirmada en los puntos de montaje</li>
            <li>Sin estructura de montaje disponible para la antena Starlink</li>
            <li>Sin acceso seguro al techo o punto de altura</li>
            <li>Obra aún no operativa o sin personal en el sitio</li>
          </ul>
        </Callout>
      </div>
    </div>
  );
}
