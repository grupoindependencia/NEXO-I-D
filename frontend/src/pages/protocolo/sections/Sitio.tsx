import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';

export function SitioSection() {
  return (
    <>
      <PageHeader
        titulo="Preparación del sitio"
        subtitulo="Levantamiento previo a la instalación. Confirma que la obra está lista antes de agendar la salida."
        tag="Pre-despliegue"
      />

      <Callout tipo="warn" titulo="Antes de agendar, no solo antes de instalar">
        El levantamiento se hace de forma <strong>remota con el Jefe de Obra</strong> antes de programar la instalación. Si un
        requisito mínimo no se cumple, es un <strong>bloqueante</strong>: se resuelve primero.
      </Callout>

      <div className="grid-2" style={{ marginTop: 4 }}>
        <Card titulo=" Conexión eléctrica">
          <p><strong>¿Hay electricidad estable y tomas libres</strong> junto a cada equipo?</p>
          <ul>
            <li>Tomas para antena, router, switch, repetidores y cámara.</li>
            <li>¿Red eléctrica o grupo electrógeno?</li>
          </ul>
          <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ink-3)' }}>
            Las obras tienen <strong>caídas de voltaje (brownouts)</strong> y transientes. El plan de protección está en
            <strong> Energía y continuidad</strong>.
          </p>
        </Card>
        <Card titulo="Montaje y vista al cielo">
          <ul>
            <li><strong>Estructura firme</strong> para anclar el soporte base (muro, poste o techo).</li>
            <li>Prueba de obstrucciones en la app (cono despejado).</li>
            <li>Distancia del montaje al router acorde al <strong>largo del cable del kit</strong> (≈ 15 m en Mini).</li>
          </ul>
        </Card>
        <Card titulo="Capacidad y alcance">
          <ul>
            <li>Nº de oficinas/galpones, usuarios y dispositivos.</li>
            <li>Distancias de cableado: <strong>Ethernet ≤ 100 m</strong> por tramo.</li>
          </ul>
          <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ink-3)' }}>Define cuántos repetidores, switch y metros de cable llevar.</p>
        </Card>
        <Card titulo="Acceso y seguridad laboral">
          <ul>
            <li>Trabajo en altura: EPP, arnés, escalera y permiso de la obra.</li>
            <li>Persona de la obra que acompañe y autorice el acceso al techo.</li>
            <li>Sin condiciones seguras, no se sube: se reprograma.</li>
          </ul>
        </Card>
      </div>



      <Callout tipo="ok" titulo="Salida solo con bloqueantes resueltos">
        La instalación se agenda únicamente cuando los requisitos mínimos (energía, montaje con vista despejada y acceso seguro)
        están confirmados y la protección eléctrica necesaria va en la lista de materiales. Procedimiento de montaje:
        <strong> Instalación Starlink</strong>.
      </Callout>
    </>
  );
}
