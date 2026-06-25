import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';

export function InstalacionInternetSection() {
  return (
    <>
      <PageHeader
        titulo="Instalación"
        subtitulo="Procedimiento de despliegue del enlace de internet en obra. Aplica tanto para Starlink como para BAM."
        tag="Instalación"
      />

      <Callout tipo="info" titulo="Dos tecnologías, un procedimiento">
        El procedimiento se adapta según la tecnología definida en la etapa de planificación. Los pasos comunes a ambas
        opciones se ejecutan igual; los pasos específicos por tecnología están claramente diferenciados en la sección de
        montaje. Si la tecnología aún no está definida, resuélvela antes de salir a terreno — ver{' '}
        <strong>Planificación</strong>.
      </Callout>

      <div style={{ marginTop: 32 }}>
        <PageHeader titulo="Paso 1 — Montaje del enlace" subtitulo="Específico por tecnología. Ejecutar solo el bloque que aplica." />
        <div className="grid-2">
          <Card titulo="Starlink">
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.85 }}>
              <li>Confirmar punto de montaje con vista despejada al cielo (verificado en el levantamiento previo).</li>
              <li>Anclar la base al soporte con los pernos del kit — nunca sobre techo plano sin soporte.</li>
              <li>Montar la antena en el mástil con el adaptador de tubo incluido.</li>
              <li>Apretar con llave hexagonal hasta bloqueo completo.</li>
              <li>Bajar el cable por el interior del muro o canaleta; sellar la entrada con cinta autofusionante.</li>
              <li>Conectar al router Starlink (incluido en el kit).</li>
            </ul>
          </Card>

          <Card titulo="BAM (Banda Ancha Móvil)">
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.85 }}>
              <li>Verificar cobertura mínima en el punto de instalación (≥ 2 barras de señal).</li>
              <li>
                Si la señal es débil: instalar antena externa en punto elevado y conectar al modem vía cable coaxial.
              </li>
              <li>Insertar la SIM activa en el modem BAM.</li>
              <li>Conectar el modem al router principal vía Ethernet (puerto WAN).</li>
              <li>Configurar el APN si el operador lo requiere.</li>
            </ul>
          </Card>
        </div>
      </div>

      <Callout tipo="warn" titulo="Regla para trabajo en altura">
        Si se trabaja a más de 1,5 m de altura, el EPP es obligatorio: casco y arnés. La escalera debe estar asegurada
        y apoyada en superficie firme. Siempre con un acompañante de la obra — no se sube solo.
      </Callout>

      <div style={{ marginTop: 16 }}>
        <PageHeader titulo="Pasos comunes — ambas tecnologías" subtitulo="Ejecutar en orden una vez completado el montaje del enlace." />
        <StepsContainer>
          <Step n={1} titulo="Distribución de red" meta="Router → Switch → Repetidores">
            <p>
              Conectar el router al switch PoE. Desde el switch, tender cables Cat6 hacia cada oficina o galpón (máximo
              100 m por tramo). Ubicar un repetidor WiFi en cada espacio. Rotular cada cable en ambos extremos antes de
              terminarlo.
            </p>
          </Step>

          <Step n={2} titulo="Configuración del router">
            <p>Acceder a la interfaz de administración del router y ajustar:</p>
            <ul style={{ marginTop: 6, paddingLeft: 20, lineHeight: 1.75 }}>
              <li>
                <strong>SSID</strong> con el formato institucional: <code>CII-OBRA-NombreObra</code>.
              </li>
              <li>Contraseña robusta (mínimo 12 caracteres, combinación alfanumérica).</li>
              <li>
                <strong>DHCP habilitado</strong>.
              </li>
              <li>
                Bandas configuradas: 2,4 GHz para alcance, 5 GHz para velocidad.
              </li>
              <li>Documentar todas las credenciales antes de salir de la obra.</li>
            </ul>
          </Step>

          <Step n={3} titulo="Configuración de repetidores">
            <p>
              Conectar cada repetidor a la red. Configurar el mismo SSID y contraseña del router para habilitar roaming
              sin interrupciones. Verificar la intensidad de señal en los rincones más alejados de cada espacio — si hay
              zona muerta, reubicar el repetidor antes de cerrar el paso.
            </p>
          </Step>

          <Step n={4} titulo="Protección eléctrica">
            <p>
              Conectar el router, el switch y — si es Starlink — el router de la antena a la UPS con AVR. Verificar que
              el indicador de la UPS esté en verde. Ejecutar una prueba de corte simulado: desenchufar la UPS de la
              pared durante 30 segundos y confirmar que el internet se mantiene activo. Volver a enchufar y confirmar
              recuperación automática sin reinicio manual.
            </p>
          </Step>
        </StepsContainer>
      </div>

      <Callout tipo="ok" titulo="Estado de finalización de instalación">
        La instalación se considera completa cuando: todas las oficinas tienen acceso WiFi confirmado, la UPS está
        probada y operativa, las credenciales están documentadas, y se han tomado fotos del montaje y del rack de
        equipos. El registro de identificadores en plataforma se realiza en la siguiente fase:{' '}
        <strong>Verificación y puesta en marcha</strong>.
      </Callout>
    </>
  );
}
