import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';
import { TableWrap, Pill } from '@/components/ui/Table';

/** Imagen con respaldo: si el archivo aún no está en /public/starlink, muestra un marcador. */
function Figura({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure style={{ margin: 0 }}>
      <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
        <img
          src={src}
          alt={alt}
          style={{ display: 'block', width: '100%', height: 'auto' }}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const ph = img.nextElementSibling as HTMLElement | null;
            if (ph) ph.style.display = 'flex';
          }}
        />
        <div style={{ display: 'none', flexDirection: 'column', gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 150, padding: 16, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12 }}>
          <span style={{ fontWeight: 600 }}>Imagen pendiente</span>
          <span>Guardar en <code>public{src}</code></span>
        </div>
      </div>
      <figcaption style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>{caption}</figcaption>
    </figure>
  );
}

/** Imagen que llena el alto disponible (para igualar la altura de una casilla vecina). */
function ImgWindow({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure style={{ margin: 0, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 170, border: '1px solid var(--line)', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, overflow: 'hidden' }}>
        <img
          src={src}
          alt={alt}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          onError={(e) => { const fig = e.currentTarget.closest('figure') as HTMLElement | null; if (fig) fig.style.display = 'none'; }}
        />
      </div>
      <figcaption style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>{caption}</figcaption>
    </figure>
  );
}

export function StarlinkSection() {
  return (
    <>
      <PageHeader
        titulo="Instalación del enlace Starlink"
        subtitulo="Despliegue de una antena Starlink (Estándar o Mini) con su router. Apoyado en la guía oficial Starlink."
        tag="Procedimiento"
      />

      <Callout tipo="info" titulo="Antes de partir a terreno">
        <ul style={{ paddingLeft: 18, margin: '4px 0 0', lineHeight: 1.6 }}>
          <li><strong>Kit Starlink completo</strong> (Estándar o Mini) + <strong>soporte base/mástil</strong> con su tornillería.</li>
          <li><strong>Escalera que alcance la altura de montaje</strong>. Si la de bodega/terreno no llega, gestionar una mayor <em>antes</em> de salir.</li>
          <li>Protección eléctrica (supresor / UPS con AVR — ver <strong>Energía y continuidad</strong>).</li>
          <li>Taladro, brocas y tarugos, cable Ethernet de exterior, EPP/arnés.</li>
        </ul>
      </Callout>

      <div className="grid-3" style={{ marginTop: 4 }}>
        <Card titulo="Tiempo · solo enlace"><p><strong>~1 hora</strong> (antena + router con WiFi en una oficina).</p></Card>
        <Card titulo="Tiempo · obra completa"><p>Hasta <strong>4 horas</strong> con cableado a todas las oficinas.</p></Card>
        <Card titulo="Salida esperada"><p>Enlace activo, WiFi nombrada y nodo NetSensor reportando.</p></Card>
      </div>

      {/* ---- Soporte de montaje ---- */}
      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Soporte de montaje · obligatorio"
          subtitulo="Único soporte institucional para Estándar y Mini. La antena se monta siempre sobre él, anclado a estructura firme — nunca suelta sobre el techo."
        />
        <div className="grid-2" style={{ alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12, height: '100%', minWidth: 0 }}>
            <Card titulo="Contenido del kit de soporte">
              <ul>
                <li>Llave + <strong>llave hexagonal</strong>.</li>
                <li>Tornillos autorroscantes ×4 · tarugos ×4.</li>
                <li>Tornillos de fijación del mástil ×6.</li>
                <li>Pernos largos inoxidables ×2.</li>
                <li>Pernos de expansión ×4.</li>
              </ul>
            </Card>
            <Callout tipo="crit" titulo="Nunca suelta sobre el techo">
              Prohibido dejar la antena suelta o inclinarla con objetos. Se ancla con pernos a muro, poste o techo; la inclinación fina se ajusta con la app.
            </Callout>
          </div>
          {/* Imágenes lado a lado, ocupando la misma ventana que la casilla del kit */}
          <div style={{ display: 'flex', gap: 12, height: '100%' }}>
            <ImgWindow src="/starlink/soporte-standard.png" alt="Soporte mástil para antena Starlink Estándar" caption="Soporte mástil" />
            <ImgWindow src="/starlink/packing-list.png" alt="Packing list del soporte" caption="Packing list" />
          </div>
        </div>
      </div>

      {/* ---- Procedimiento ---- */}
      <div style={{ marginTop: 32 }}>
        <PageHeader titulo="Procedimiento paso a paso" subtitulo="En orden. Cada paso deja registro." />
        <StepsContainer>
          <Step n={1} titulo="Vista despejada del cielo" meta="Técnico instalador · Apoyo: Jefe de Obra">
            <p>Verificar con la <strong>herramienta de obstrucciones de la app</strong> (nunca a ojo) un campo de visión limpio: ~110° y elevación mínima ≈20°. Si no se logra a ese nivel, anclar el soporte a una estructura más alta.</p>
            <div style={{ marginTop: 10, display: 'grid', gap: 12 }}>
              <Figura src="/starlink/vista-despejada.png" alt="Campo de visión de 110° con elevación mínima de 20°: despejado vs obstruido" caption="Campo de visión despejado (~110°, elevación mín. 20°) · guía oficial Starlink" />
              <Figura src="/starlink/vista-techo.png" alt="Montaje elevado: despejado vs obstruido por chimenea o árbol" caption="Montaje elevado: ✓ despejado · ✗ obstruido · guía oficial Starlink" />
            </div>
          </Step>
          <Step n={2} titulo="Montaje sobre el soporte">
            <p>Anclar la base a estructura firme con los pernos del kit, montar el adaptador de tubo de la antena sobre el mástil y apretar con la llave hexagonal. Pasar el cable hacia el interior y sellar la entrada. (Detalle del soporte arriba.)</p>
          </Step>
          <Step n={3} titulo="Cableado y conexión del router">
            <p>Llevar el cable de alimentación al router/punto de energía.</p>
            <Callout tipo="info" titulo="Salida cableada (cámara / switch)">
              Para cámara biométrica o switch se usa el <strong>puerto Ethernet (RJ45)</strong> con cable de exterior. Ojo: con RJ45 estándar la antena pierde IP67 → proteger el punto. Detalle en <strong>Topología de red</strong>.
            </Callout>
          </Step>
          <Step n={4} titulo="Energización en UPS">
            <p>Conectar el equipo de red (router, switch, repetidor y nodo NetSensor) a la <strong>UPS con AVR</strong>, en toma no compartida con maquinaria. Conectarse a la red <code>STARLINK</code> desde el celular. <span style={{ color: 'var(--ink-3)' }}>El UPS evita reinicios por baja de voltaje — ver <strong>Energía y continuidad</strong>.</span></p>
          </Step>
          <Step n={5} titulo="Activación y detección de satélites" meta="Cuenta: soporte@cindependencia.cl">
            <p>Abrir la app: detecta la antena, actualiza firmware e inicia la detección de satélites. Esperar sin cortar la energía.</p>
          </Step>
          <Step n={6} titulo="Alineación">
            <p>Seguir la <strong>herramienta de alineación</strong> de la app (girar/inclinar) y luego fijar definitivamente el soporte con la llave hexagonal.</p>
            <div style={{ marginTop: 10 }}>
              <Figura src="/starlink/alineacion.png" alt="Herramienta de alineación de la app y antena en su soporte" caption="Herramienta de alineación de la app · guía oficial Starlink" />
            </div>
          </Step>
          <Step n={7} titulo="Conexión y red WiFi">
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p>Desde el celular, conéctate a la red <code>STARLINK</code> en la configuración WiFi. Al conectar se abre una ventana del navegador que pide un nuevo <strong>nombre de red (SSID) y contraseña</strong> — aplica la convención institucional:</p>
                <ul>
                  <li>Router Starlink: SSID <code>&lt;OBRA&gt;_PRINCIPAL</code> · clave <code>&lt;SSID&gt;2026</code> (ej. <code>BLI_PRINCIPAL</code> / <code>BLI_PRINCIPAL2026</code>).</li>
                  <li>Cada repetidor se configura aparte según el <strong>Protocolo de redes y contraseñas</strong> (ver Topología).</li>
                </ul>
                <p>Luego abre la app Starlink para ajustes adicionales. Registrar todos los SSID en la plataforma.</p>
              </div>
              <div style={{ flexShrink: 0, width: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Figura src="/starlink/wifi-screen.png" alt="Pantalla de conexión a la red STARLINK desde el celular" caption="Conexión a la red STARLINK · guía oficial Starlink" />
              </div>
            </div>
          </Step>
          <Step n={8} titulo="Validación con monitoreo" meta="Confirmación obligatoria">
            <p>Confirmar con <strong>Soporte Integral</strong> que la antena figura activa en la plataforma y que el <strong>nodo NetSensor</strong> ya reporta a través de este enlace.</p>
          </Step>
          <Step n={9} titulo="Cierre y briefing">
            <p>Registrar (SN, obra, punto, SSID, fotos), etiquetar el router e instruir al Jefe de Obra: qué hacer ante un corte y a quién llamar (ver <strong>Soporte de enlace</strong>).</p>
          </Step>
        </StepsContainer>
      </div>

      {/* ---- LED ---- */}
      <div style={{ marginTop: 32 }}>
        <PageHeader titulo="Luz de estado de la antena" subtitulo="Indicador en la parte posterior. Útil en terreno y al guiar por teléfono." />
        <TableWrap>
          <thead><tr><th style={{ width: '24%' }}>LED</th><th>Significado</th><th style={{ width: '34%' }}>Acción</th></tr></thead>
          <tbody>
            <tr><td><Pill tipo="ok">Parpadeo lento</Pill></td><td>Encendida y operando.</td><td>Ninguna.</td></tr>
            <tr><td><Pill tipo="i">Sin luz</Pill></td><td>Sin energía.</td><td>Revisar enchufe, fuente y toma.</td></tr>
            <tr><td><Pill tipo="a">Parpadeo rápido</Pill></td><td>Reinicio / restablecimiento.</td><td>Esperar a que termine.</td></tr>
          </tbody>
        </TableWrap>
        <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ink-3)' }}>Reset de fábrica: mantener presionado el ícono de reinicio 3 s (última instancia antes de escalar a terreno).</p>
      </div>


      <Callout tipo="warn" titulo="Toda instalación deja registro">
        SN, obra, punto, SSID, fotos y resultados de aceptación se cargan en la plataforma el mismo día. Para pasar lista en
        terreno usa el <strong>Checklist terreno</strong> (imprimible). Fuente técnica: guía oficial Starlink (ver <strong>Manual de usuario</strong>).
      </Callout>
    </>
  );
}
