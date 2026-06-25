import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Leds } from '@/components/ui/Leds';

export function ManualSection() {
  return (
    <>
      <PageHeader
        titulo="Manual de usuario para obra"
        subtitulo="Fichas de 1 página pensadas para imprimir y pegar en obra: una para el nodo NetSensor y otra para el enlace Starlink. Apoyo técnico de la capa de enlace: guía oficial Starlink Mini."
        tag="Para imprimir"
      />

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--green)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 4 }}>
              Constructora Independencia · I+D Hardware
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-.3px' }}>¿Qué es este dispositivo?</h3>
            <p style={{ marginTop: 4, color: 'var(--ink-2)', fontSize: 13 }}>Monitor de calidad de internet en tu oficina de obra.</p>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 11.5, letterSpacing: '.4px' }}>NETSENSOR v2.0</div>
        </div>

        <div className="grid-2" style={{ marginBottom: 18 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>¿Para qué sirve?</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>
              Mide cómo está la calidad de tu WiFi y de tu internet (Starlink). Manda esa información a Oficina Central para que sepamos si tienes una buena conexión. Si tu internet falla, nosotros lo detectamos rápido y vamos a resolverlo. <strong>Es para ayudarte a ti.</strong>
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>¿Qué significan los LEDs?</h4>
            <Leds size={28} items={[
              { color: 'green',  name: 'Verde OK' },
              { color: 'yellow', name: 'Amarillo' },
              { color: 'red',    name: 'Rojo' },
            ]} />
          </div>
        </div>

        <div className="grid-2">
          <div style={{ background: 'var(--green-soft)', borderRadius: 8, padding: 14 }}>
            <h4 style={{ color: 'var(--green-deep)', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Sí hacer</h4>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.55 }}>
              <li>Dejarlo siempre enchufado.</li>
              <li>Avisar a tu Jefe de Obra si el LED está rojo o el equipo apagado.</li>
            </ul>
          </div>
          <div style={{ background: 'var(--crit-soft)', borderRadius: 8, padding: 14 }}>
            <h4 style={{ color: 'var(--crit)', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>No hacer</h4>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: '#6E2828', lineHeight: 1.55 }}>
              <li>No desenchufarlo.</li>
              <li>No moverlo de lugar.</li>
              <li>No abrirlo ni presionar sus botones.</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 18, padding: '14px 16px', background: 'var(--green-soft)', borderLeft: '3px solid var(--green)', borderRadius: 6 }}>
          <strong style={{ color: 'var(--green-deep)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>¿A QUIÉN LLAMO SI HAY UN PROBLEMA?</strong>
          <span style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.55 }}>
            Primero a tu <strong>Jefe de Obra o de Departamento</strong>. Él se encarga de avisar al equipo de soporte.<br/>
            Soporte (Axel Muñoz): <strong>[anexo / WhatsApp a completar]</strong> · email: <strong>axel.munoz@cindependencia.cl</strong>
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--green)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 4 }}>
              Constructora Independencia · I+D Hardware
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-.3px' }}>El enlace Starlink de tu obra</h3>
            <p style={{ marginTop: 4, color: 'var(--ink-2)', fontSize: 13 }}>La antena satelital que entrega internet a tu oficina.</p>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 11.5, letterSpacing: '.4px' }}>STARLINK · ESTÁNDAR / MINI</div>
        </div>

        <div className="grid-2" style={{ marginBottom: 18 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Si se cae el internet, antes de llamar</h4>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              <li>Revisa que la antena y el router estén enchufados.</li>
              <li>Reinicia: desenchufa el equipo, espera unos segundos y vuelve a enchufar.</li>
              <li>Espera 2–3 minutos a que recupere el satélite.</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Luz de la antena</h4>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              <li><strong>Parpadeo lento:</strong> encendida y trabajando.</li>
              <li><strong>Sin luz:</strong> no le llega energía (revisa el enchufe).</li>
              <li><strong>Parpadeo rápido:</strong> reiniciándose, espera.</li>
            </ul>
          </div>
        </div>

        <div className="grid-2">
          <div style={{ background: 'var(--green-soft)', borderRadius: 8, padding: 14 }}>
            <h4 style={{ color: 'var(--green-deep)', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Sí hacer</h4>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.55 }}>
              <li>Mantener la antena y el router siempre conectados.</li>
              <li>Avisar a tu Jefe de Obra ante un corte que no se recupera.</li>
            </ul>
          </div>
          <div style={{ background: 'var(--crit-soft)', borderRadius: 8, padding: 14 }}>
            <h4 style={{ color: 'var(--crit)', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>No hacer</h4>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: '#6E2828', lineHeight: 1.55 }}>
              <li>No mover ni reorientar la antena de su soporte.</li>
              <li>No desconectar la cámara de asistencia ni el switch.</li>
              <li>No poner objetos sobre la antena ni taparla.</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 18, padding: '14px 16px', background: 'var(--green-soft)', borderLeft: '3px solid var(--green)', borderRadius: 6 }}>
          <strong style={{ color: 'var(--green-deep)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>¿A QUIÉN LLAMO SI SIGUE SIN INTERNET?</strong>
          <span style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.55 }}>
            A tu <strong>Jefe de Obra</strong>, que avisa al equipo de soporte.<br/>
            Soporte (Axel Muñoz): <strong>[anexo / WhatsApp a completar]</strong> · email: <strong>axel.munoz@cindependencia.cl</strong>
          </span>
        </div>
      </div>

      <Callout tipo="info" titulo="Distribución">
        Ambas fichas deben estar impresas y visibles en obra: la de NetSensor junto al nodo, y la de Starlink junto al router de
        cada enlace. Imprimir desde el navegador (Ctrl+P) y pegar adyacente al equipo correspondiente.
      </Callout>
    </>
  );
}
