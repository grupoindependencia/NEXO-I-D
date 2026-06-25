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

export function ChecklistPrepSection() {
  return (
    <div>
      <PageHeader
        titulo="Checklist de preparación"
        subtitulo="Completar antes de cada salida a terreno. Sin estos ítems confirmados, no se viaja."
        tag="Imprimible"
      />

      <Callout tipo="warn" titulo="Obligatorio antes de viajar">
        Todos los ítems críticos deben estar marcados. Si alguno falta, reprogramar la visita.
      </Callout>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--green)', letterSpacing: '.8px', textTransform: 'uppercase' }}>Constructora Independencia · I+D Hardware</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: '2px 0 0' }}>Preparación para salida a terreno — lista de verificación</h3>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 11.5 }}>PREPARACIÓN</div>
        </div>

        <div className="grid-2">
          <Grupo titulo="1 · Coordinación">
            <Check>Ticket recibido y analizado</Check>
            <Check>Tecnología definida (BAM o Starlink)</Check>
            <Check>Levantamiento remoto completado sin bloqueantes</Check>
            <Check>Jefe de Obra confirmó fecha y disponibilidad</Check>
            <Check>Transporte interno coordinado</Check>
          </Grupo>

          <Grupo titulo="2 · Equipos principales">
            <Check>Si Starlink: Kit completo (antena + cable + router)</Check>
            <Check>Si BAM: Modem + SIM card activa</Check>
            <Check>Router / Switch PoE</Check>
            <Check>Repetidores WiFi (cantidad según sitio)</Check>
            <Check>UPS con AVR</Check>
          </Grupo>

          <Grupo titulo="3 · Materiales y cableado">
            <Check>Cable Cat6 (metros estimados + 20% extra)</Check>
            <Check>Patch cables Cat6 (mínimo 4)</Check>
            <Check>Bridas y sujetacables</Check>
            <Check>Cinta autofusionante</Check>
            <Check>Tacos, tornillos, fijaciones varias</Check>
          </Grupo>

          <Grupo titulo="4 · Herramientas">
            <Check>Taladro inalámbrico + brocas</Check>
            <Check>Llave hexagonal (o incluida en kit Starlink)</Check>
            <Check>Destornilladores Phillips y plano</Check>
            <Check>Testador de cable RJ45</Check>
            <Check>Laptop con acceso a diagnóstico</Check>
            <Check>Escalera (si trabajo en altura)</Check>
            <Check>EPP: casco y arnés (si trabajo en altura)</Check>
          </Grupo>
        </div>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', breakInside: 'avoid' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Campo label="Obra" />
            <Campo label="Fecha" />
            <Campo label="Ingeniero responsable" />
            <Campo label="Firma" />
          </div>
        </div>
      </div>
    </div>
  );
}
