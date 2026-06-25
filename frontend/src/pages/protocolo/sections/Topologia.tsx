import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap } from '@/components/ui/Table';

export function TopologiaSection() {
  return (
    <>
      <PageHeader
        titulo="Topología de red en obra"
        subtitulo="Esquema estándar de dos antenas por obra y cómo se distribuye internet a cámara biométrica, oficinas y galpones."
        tag="Arquitectura"
      />

      <Callout tipo="info" titulo="Estándar de obra">
        Por defecto se instalan <strong>dos enlaces Starlink</strong> por obra, cada uno con su router. El primero asegura la
        asistencia (cámara biométrica) y las oficinas de acceso; el segundo da servicio a administración / dirección, que suele
        tener múltiples containers.
      </Callout>

      <div className="grid-2" style={{ marginTop: 4 }}>
        <Card titulo="Antena 1 · Acceso / RR.HH.">
          <p>Se instala cerca de la entrada o en la oficina de Recursos Humanos. Cumple dos funciones:</p>
          <ul>
            <li><strong>Cámara de reconocimiento facial biométrico</strong> conectada por <strong>cable Ethernet</strong> (control de asistencia de trabajadores).</li>
            <li><strong>WiFi</strong> para las oficinas cercanas desde el router.</li>
          </ul>
          <Callout tipo="warn" titulo="Cableado de la cámara">
            La cámara se alimenta por el puerto RJ45 de la antena/router. Usar cable Ethernet oficial o de exterior sellado; con
            RJ45 estándar se pierde la certificación IP67, así que el punto debe quedar protegido.
          </Callout>
        </Card>
        <Card titulo="Antena 2 · Administración / Dirección">
          <p>Da servicio a las oficinas de administradores y directores, normalmente repartidas en varios containers:</p>
          <ul>
            <li>El router se conecta a un <strong>switch</strong> central.</li>
            <li>El switch lleva <strong>un cable Ethernet por galpón</strong>.</li>
            <li>Cada galpón tiene un <strong>repetidor</strong> que genera su propia red WiFi local.</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <PageHeader titulo="Esquema de conexión" subtitulo="Flujo físico desde cada antena hasta el usuario final." />
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
          <svg viewBox="0 0 1010 450" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto', minWidth: 720, maxWidth: '100%' }}>
            <defs>
              <marker id="arrTop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#00684A"/>
              </marker>
            </defs>

            {/* ---- Fila Antena 1 ---- */}
            <text x="30" y="46" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="11" letterSpacing="0.6" fill="#7A8580">ENLACE 1 · ACCESO / RR.HH.</text>
            <g>
              <rect x="30" y="60" width="200" height="64" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/>
              <text x="130" y="88" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">Antena Starlink 1</text>
              <text x="130" y="106" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">Soporte fijo · vista despejada</text>
            </g>
            <line x1="230" y1="92" x2="285" y2="92" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <g>
              <rect x="290" y="60" width="180" height="64" rx="8" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/>
              <text x="380" y="88" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">Router (WiFi integrado)</text>
              <text x="380" y="106" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">Oficina de acceso</text>
            </g>
            {/* split desde router 1 */}
            <line x1="470" y1="92" x2="510" y2="92" stroke="#00684A" strokeWidth="1.4"/>
            <line x1="510" y1="55" x2="510" y2="150" stroke="#00684A" strokeWidth="1.4"/>
            <line x1="510" y1="58" x2="560" y2="58" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <line x1="510" y1="146" x2="560" y2="146" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <g>
              <rect x="565" y="34" width="280" height="48" rx="8" fill="#00684A" stroke="#00513B" strokeWidth="1.2"/>
              <text x="705" y="54" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="12.5" fill="#fff">Cámara biométrica facial</text>
              <text x="705" y="71" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10.5" fill="#D5E4DC">Ethernet RJ45 · asistencia</text>
            </g>
            <g>
              <rect x="565" y="122" width="280" height="48" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/>
              <text x="705" y="142" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="12.5" fill="#1A2420">WiFi oficinas de acceso</text>
              <text x="705" y="159" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10.5" fill="#4A5550">Cobertura local</text>
            </g>

            {/* separador */}
            <line x1="30" y1="205" x2="980" y2="205" stroke="#E8EAE9" strokeWidth="1" strokeDasharray="4 4"/>

            {/* ---- Fila Antena 2 ---- */}
            <text x="30" y="246" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="11" letterSpacing="0.6" fill="#7A8580">ENLACE 2 · ADMINISTRACIÓN / DIRECCIÓN</text>
            <g>
              <rect x="30" y="300" width="180" height="64" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/>
              <text x="120" y="328" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">Antena Starlink 2</text>
              <text x="120" y="346" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">Soporte fijo · vista despejada</text>
            </g>
            <line x1="210" y1="332" x2="250" y2="332" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <g>
              <rect x="255" y="300" width="150" height="64" rx="8" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/>
              <text x="330" y="328" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">Router</text>
              <text x="330" y="346" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">Oficina principal</text>
            </g>
            <line x1="405" y1="332" x2="445" y2="332" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <g>
              <rect x="450" y="300" width="140" height="64" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/>
              <text x="520" y="328" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">Switch</text>
              <text x="520" y="346" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">1 cable por galpón</text>
            </g>
            {/* fan-out switch → repetidores */}
            <line x1="590" y1="332" x2="625" y2="332" stroke="#00684A" strokeWidth="1.4"/>
            <line x1="625" y1="278" x2="625" y2="386" stroke="#00684A" strokeWidth="1.4"/>
            <line x1="625" y1="278" x2="665" y2="278" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <line x1="625" y1="332" x2="665" y2="332" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <line x1="625" y1="386" x2="665" y2="386" stroke="#00684A" strokeWidth="1.4" markerEnd="url(#arrTop)"/>
            <g>
              <rect x="670" y="256" width="300" height="44" rx="8" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/>
              <text x="820" y="282" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12" fill="#1A2420">Repetidor galpón 1 → WiFi oficina</text>
            </g>
            <g>
              <rect x="670" y="310" width="300" height="44" rx="8" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/>
              <text x="820" y="336" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12" fill="#1A2420">Repetidor galpón 2 → WiFi oficina</text>
            </g>
            <g>
              <rect x="670" y="364" width="300" height="44" rx="8" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/>
              <text x="820" y="390" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12" fill="#1A2420">Repetidor galpón N → WiFi oficina</text>
            </g>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <PageHeader titulo="Equipos por punto" subtitulo="Resumen de qué se instala en cada enlace y para qué." />
        <TableWrap>
          <thead><tr><th style={{ width: '22%' }}>Punto</th><th style={{ width: '28%' }}>Equipos</th><th>Función</th></tr></thead>
          <tbody>
            <tr><td><strong>Enlace 1 · Acceso / RR.HH.</strong></td><td>Antena Starlink + router</td><td>Internet a cámara biométrica (Ethernet) y WiFi a oficinas de acceso.</td></tr>
            <tr><td>Cámara biométrica</td><td>Cámara facial + cable Ethernet</td><td>Control de asistencia de trabajadores en obra.</td></tr>
            <tr><td><strong>Enlace 2 · Administración</strong></td><td>Antena Starlink + router + switch</td><td>Distribución cableada a los galpones de administración/dirección.</td></tr>
            <tr><td>Galpones / oficinas</td><td>Repetidor WiFi por galpón</td><td>Red WiFi local en cada oficina.</td></tr>
            <tr><td>Monitoreo</td><td>Nodo NetSensor por oficina crítica</td><td>Mide la calidad real del internet de cada enlace y reporta al dashboard.</td></tr>
          </tbody>
        </TableWrap>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Protocolo de redes y contraseñas"
          subtitulo="Cada Access Point (TP-Link u otro) cableado desde el switch se configura en la app/web de su propia marca. SSID y clave siguen una convención fija."
        />
        <Callout tipo="info" titulo="Regla de nombres">
          Clave = <strong>SSID + año</strong>. El SSID lleva las <strong>3 letras de la obra</strong> + el rol del equipo
          (<code>PRINCIPAL</code> o <code>AP0N</code>). Así, quien ve el nombre de la red ya sabe la clave. Ejemplo: obra
          Batalla Lircay → <code>BLI</code>.
        </Callout>
        <TableWrap>
          <thead><tr><th style={{ width: '34%' }}>Equipo</th><th>Nombre de red (SSID)</th><th>Contraseña</th></tr></thead>
          <tbody>
            <tr><td>Router Starlink</td><td><code>BLI_PRINCIPAL</code></td><td><code>BLI_PRINCIPAL2026</code></td></tr>
            <tr><td>Repetidor 1</td><td><code>BLI_AP01</code></td><td><code>BLI_AP012026</code></td></tr>
            <tr><td>Repetidor 2</td><td><code>BLI_AP02</code></td><td><code>BLI_AP022026</code></td></tr>
            <tr><td>Repetidor 3</td><td><code>BLI_AP03</code></td><td><code>BLI_AP032026</code></td></tr>
            <tr><td>Repetidor 4</td><td><code>BLI_AP04</code></td><td><code>BLI_AP042026</code></td></tr>
          </tbody>
        </TableWrap>
        <Callout tipo="warn" titulo="Configuración de cada repetidor (AP)">
          Los repetidores no se configuran desde la app Starlink: cada uno se configura en la <strong>app/web de su marca</strong>
          (ej. TP-Link), creando su SSID y clave según la tabla. Registrar todos los SSID en la plataforma.
        </Callout>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Segmentación de red y cumplimiento"
          subtitulo="La cámara biométrica no es un equipo más: procesa datos sensibles y obliga a separar y asegurar la red."
        />
        <div className="grid-2">
          <Card titulo="Seguridad de la red">
            <ul>
              <li>Cambiar <strong>todas las contraseñas por defecto</strong> de router y repetidores.</li>
              <li>Separar <strong>red de gestión / cámara</strong> de la WiFi de usuarios e invitados.</li>
              <li>Mantener el <strong>firmware de router y repetidores</strong> al día (no solo el del nodo NetSensor).</li>
              <li>Higiene de la cuenta <code>soporte@cindependencia.cl</code>: rotación de clave y 2FA cuando esté disponible.</li>
            </ul>
          </Card>
          <Card titulo="Datos biométricos · Ley 21.719">
            <p>
              El reconocimiento facial trata <strong>datos biométricos = datos sensibles</strong>. La Ley 21.719 (vigencia plena
              <strong> 1-dic-2026</strong>) exige, entre otros: <strong>evaluación de impacto</strong> previa, criterio de necesidad
              y proporcionalidad, y <strong>eliminación/anonimización</strong> de los datos al término de la relación laboral.
            </p>
            <p style={{ marginTop: 6 }}>
              En lo de red: la cámara va en un <strong>segmento dedicado y aislado</strong> (enlace de acceso), sin exposición a
              conexiones entrantes desde internet. El diseño debe soportar ese aislamiento.
            </p>
          </Card>
        </div>
        <Callout tipo="warn" titulo="Responsabilidad compartida">
          El cumplimiento legal del tratamiento biométrico corresponde al área responsable de RR.HH./asistencia; el rol del
          protocolo de red es <strong>habilitar la segmentación y la seguridad</strong> que ese cumplimiento requiere. Coordinar con
          TI/Legal antes de exponer o integrar la cámara.
        </Callout>
      </div>

      <Callout tipo="ok" titulo="Cómo se integra el monitoreo">
        En cada oficina crítica se instala un nodo <strong>NetSensor</strong> sobre la WiFi de su enlace. El dashboard distingue
        si una falla está en el WiFi local (repetidor/router) o en el enlace Starlink/ISP, gracias al diagnóstico cruzado
        GW × INET. Detalle en la sección <strong>Diagnóstico</strong>.
      </Callout>
    </>
  );
}
