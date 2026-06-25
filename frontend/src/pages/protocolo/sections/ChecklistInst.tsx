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

export function ChecklistInstSection() {
  return (
    <div>
      <PageHeader
        titulo="Checklist de instalación"
        subtitulo="Completar durante y al finalizar la instalación en terreno."
        tag="Imprimible"
      />

      <Callout tipo="info" titulo="Uso en terreno">
        Completar durante la instalación. Todos los puntos de control críticos deben pasar antes de cerrar la instalación.
      </Callout>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--green)', letterSpacing: '.8px', textTransform: 'uppercase' }}>Constructora Independencia · I+D Hardware</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: '2px 0 0' }}>Instalación de internet en obra — lista de verificación</h3>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 11.5 }}>INSTALACIÓN</div>
        </div>

        <div className="grid-2">
          <Grupo titulo="1 · Llegada al sitio">
            <Check>Jefe de Obra contactado al llegar</Check>
            <Check>Zonas de instalación identificadas</Check>
            <Check>Fuentes de energía verificadas en cada punto</Check>
            <Check>Acceso a techo/altura autorizado (si aplica)</Check>
          </Grupo>

          <Grupo titulo="2 · Montaje físico">
            <Check>Si Starlink: antena montada en soporte firme, cable bajado y sellado</Check>
            <Check>Si BAM: modem en posición con señal verificada (≥ 2 barras)</Check>
            <Check>Router ubicado en punto central</Check>
            <Check>Switch conectado al router</Check>
            <Check>Repetidores posicionados en cada galpón/oficina</Check>
            <Check>Todo el cableado ordenado con bridas</Check>
          </Grupo>

          <Grupo titulo="3 · Configuración de red">
            <Check>SSID definido y documentado</Check>
            <Check>Contraseña definida y documentada</Check>
            <Check>Red WiFi activa en router</Check>
            <Check>Cada repetidor configurado y conectado</Check>
            <Check>Switch distribuyendo correctamente (luces OK)</Check>
          </Grupo>

          <Grupo titulo="4 · Protección eléctrica">
            <Check>Router y switch conectados al UPS</Check>
            <Check>UPS probado: equipo sigue funcionando en corte breve</Check>
            <Check>Sin conexiones directas a la red eléctrica sin protección</Check>
          </Grupo>

          <Grupo titulo="5 · Verificación final">
            <Check>Speed test ejecutado (resultado documentado)</Check>
            <Check>Latencia &lt; 150 ms</Check>
            <Check>WiFi verificado en cada oficina</Check>
            <Check>Cámara biométrica marcando (si aplica)</Check>
            <Check>Jefe de Obra confirma acceso correcto</Check>
          </Grupo>

          <Grupo titulo="6 · Cierre y registro">
            <Check>Fotos del montaje tomadas</Check>
            <Check>Router etiquetado con nombre de red</Check>
            <Check><strong>Identificador registrado en plataforma</strong> (SN Starlink o N° línea BAM)</Check>
            <Check>Briefing al Jefe de Obra completado</Check>
            <Check>Ticket actualizado</Check>
          </Grupo>
        </div>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', breakInside: 'avoid' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Campo label="Obra" />
            <Campo label="Tecnología (BAM/Starlink)" />
            <Campo label="Ingeniero" />
            <Campo label="Fecha" />
            <Campo label="Firma" />
          </div>
        </div>
      </div>
    </div>
  );
}
