import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';

/** Fila de checklist con casilla lateral para marcar en papel. */
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

function Campo({ label, ancho = '1fr' }: { label: string; ancho?: string }) {
  return (
    <div style={{ gridColumn: `span 1`, flex: ancho === '1fr' ? 1 : undefined }}>
      <div style={{ height: 30, borderBottom: '1.5px solid var(--ink-3)' }} />
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export function ChecklistTerrenoSection() {
  return (
    <>
      <PageHeader
        titulo="Checklist de instalación en terreno"
        subtitulo="Imprimir y completar en terreno. Marca cada casilla y firma al final."
        tag="Imprimible"
      />

      <Callout tipo="info" titulo="Cómo usarlo">
        Descarga esta sección en PDF (ícono de descarga en el menú lateral) o imprime con Ctrl+P. Completa las casillas durante la
        instalación; sin todas las verificaciones críticas marcadas, la instalación no se cierra.
      </Callout>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--green)', letterSpacing: '.8px', textTransform: 'uppercase' }}>Constructora Independencia · I+D Hardware</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: '2px 0 0' }}>Instalación de enlace Starlink — lista de verificación</h3>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 11.5 }}>STARLINK</div>
        </div>

        <div className="grid-2">
          <Grupo titulo="1 · Antes de subir">
            <Check>Equipo <strong>activado y vinculado</strong> a la obra en la plataforma</Check>
            <Check>Sitio sin bloqueantes (energía, vista al cielo, acceso)</Check>
            <Check>Kit Starlink completo + soporte y tornillería</Check>
            <Check><strong>Escalera alcanza la altura</strong> de montaje</Check>
            <Check>EPP / Casco, arnés para trabajo en altura</Check>
                    </Grupo>

          <Grupo titulo="2 · Montaje">
            <Check>Herramientas</Check>
            <Check>Base anclada con pernos del kit</Check>
            <Check>Antena montada en el mástil (adaptador de tubo)</Check>
            <Check>Apretada y bloqueada con llave hexagonal</Check>
            <Check>Cable llevado al interior y entrada sellada</Check>
          </Grupo>

          <Grupo titulo="3 · Activación">
            <Check>Equipo de red en <strong>UPS con AVR</strong></Check>
            <Check>Conexión a la red STARLINK desde el celular</Check>
            <Check>App detecta antena · firmware · satélites</Check>
            <Check>Antena alineada con la herramienta de la app</Check>
            <Check>SSID y contraseña creados y documentados</Check>
          </Grupo>

          <Grupo titulo="4 · Verificación (aceptación)">
            <Check>Latencia &lt; 150 ms · velocidad acorde al plan</Check>
            <Check>WiFi en cada oficina</Check>
            <Check>Cámara biométrica marcando</Check>
            <Check>Nodo NetSensor reportando en el dashboard</Check>
            <Check>Red se mantiene en corte breve (UPS)</Check>
          </Grupo>

          <Grupo titulo="5 · Cierre">
            <Check>Fotos de montaje y de la prueba de obstrucciones</Check>
            <Check>Router etiquetado con el punto</Check>
            <Check>Briefing al Jefe de Obra (corte / a quién llamar)</Check>
            <Check>Instalación registrada en la plataforma</Check>
          </Grupo>
        </div>

        {/* Pie de firma */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', breakInside: 'avoid' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Campo label="Nombre del instalador" />
            <Campo label="Serial del equipo (SN)" />
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 14 }}>
            <Campo label="Fecha" />
            <Campo label="Firma del instalador" />
          </div>
        </div>
      </div>
    </>
  );
}
