import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--line-2)', listStyle: 'none' }}>
      <span style={{ flexShrink: 0, width: 16, height: 16, marginTop: 1, border: '1.5px solid var(--ink-3)', borderRadius: 4, background: '#fff' }} />
      <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.45 }}>{children}</span>
    </li>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ breakInside: 'avoid', marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--green-dark)', margin: '4px 0 6px' }}>{titulo}</div>
      <ul style={{ margin: 0, padding: 0 }}>{children}</ul>
    </div>
  );
}

function Campo({ label }: { label: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ height: 30, borderBottom: '1.5px solid var(--ink-3)' }} />
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export function ChecklistOpSection() {
  return (
    <div>
      <PageHeader
        titulo="Checklist de operación"
        subtitulo="Revisión periódica del estado del enlace. Completar mensualmente o tras incidencias."
        tag="Mensual"
      />

      <Callout tipo="info" titulo="Periodicidad">
        Este checklist es completado mensualmente por el ingeniero de soporte. Cualquier anomalía encontrada genera una tarea de mantención correctiva.
      </Callout>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--green)', letterSpacing: '.8px', textTransform: 'uppercase' }}>Constructora Independencia · I+D Hardware</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: '2px 0 0' }}>Operación y mantención mensual — lista de verificación</h3>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 11.5 }}>OPERACIÓN</div>
        </div>

        <div className="grid-2">
          <Grupo titulo="1 · Estado del enlace">
            <Check>Velocidad de descarga verificada (anotar resultado)</Check>
            <Check>Velocidad de subida verificada (anotar resultado)</Check>
            <Check>Latencia dentro del rango normal (&lt; 150 ms)</Check>
            <Check>Sin pérdida de paquetes reportada</Check>
            <Check>Uptime del router ≥ 99% en el mes</Check>
          </Grupo>

          <Grupo titulo="2 · Estado de equipos">
            <Check>Router sin alertas ni sobrecalentamiento</Check>
            <Check>Switch con todas las luces de puertos en uso activas</Check>
            <Check>UPS con batería en buen estado (indicador verde)</Check>
            <Check>Repetidores respondiendo ping desde el router</Check>
            <Check>Antena/modem sin daño físico visible</Check>
          </Grupo>

          <Grupo titulo="3 · Red local">
            <Check>WiFi verificado en al menos 3 puntos del sitio</Check>
            <Check>Sin dispositivos desconocidos en la red</Check>
            <Check>Contraseña WiFi vigente y no comprometida</Check>
            <Check>Cámara biométrica operativa (si aplica)</Check>
            <Check>Acceso a internet en todas las oficinas</Check>
          </Grupo>

          <Grupo titulo="4 · Protección y continuidad">
            <Check>UPS probado con corte simulado de 30 seg</Check>
            <Check>Equipos vuelven a funcionar solos tras corte</Check>
            <Check>Cableado exterior sin daño visible</Check>
            <Check>Antena sin obstrucciones nuevas (si Starlink)</Check>
          </Grupo>

          <Grupo titulo="5 · Documentación">
            <Check>Estado registrado en el reporte mensual</Check>
            <Check>Incidencias del período documentadas</Check>
            <Check>Equipo actualizado en la plataforma (si hubo cambios)</Check>
            <Check>Jefe de Obra informado del estado</Check>
          </Grupo>
        </div>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', breakInside: 'avoid' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Campo label="Obra" />
            <Campo label="Mes revisado" />
            <Campo label="Descarga (Mbps)" />
            <Campo label="Subida (Mbps)" />
            <Campo label="Ingeniero" />
            <Campo label="Firma" />
          </div>
        </div>
      </div>
    </div>
  );
}
