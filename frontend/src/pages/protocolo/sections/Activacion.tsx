import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';
import { TableWrap } from '@/components/ui/Table';

export function ActivacionSection() {
  return (
    <>
      <PageHeader
        titulo="Activación del equipo de conectividad"
        subtitulo="Procedimiento institucional previo a toda instalación. Asegura la trazabilidad del equipo."
       
      />

      <Callout tipo="info" titulo="Por qué importa">
        Cada equipo de conectividad (Starlink o BAM) es un activo de la constructora vinculado a una obra. Su activación en la
        plataforma es lo que permite después monitorear el enlace y atender incidencias. <strong>La activación
        antecede siempre a la instalación física</strong> (ver sección <strong>Instalación Starlink</strong>).
      </Callout>

      <div style={{ marginTop: 8 }}>
        <PageHeader titulo="Flujo de activación" subtitulo="De la solicitud al equipo listo para instalar." />
        <StepsContainer>
          <Step n={1} titulo="Solicitud de internet en obra" meta="Origen: Obra → Departamento de Informática">
            <p>
              La obra levanta un <strong>ticket al Departamento de Informática</strong> solicitando la instalación de internet.
              El ticket describe la obra, la cantidad y ubicación de oficinas a conectar y la <strong>prioridad</strong> del
              requerimiento.
            </p>
          </Step>
          <Step n={2} titulo="Definición del tipo de enlace · BAM o Starlink">
            <p>Según la obra y la cobertura disponible se define qué tecnología aplica. Esto determina los datos a registrar:</p>
            <ul>
              <li><strong>BAM</strong> (banda ancha móvil): número de línea, compañía, responsable y obra.</li>
              <li><strong>Starlink</strong>: número de serie (SN), tipo de kit (Mini o Estándar) y obra asignada.</li>
            </ul>
          </Step>
          <Step n={3} titulo="Recepción y registro de identificadores">
            <p>
              Al recibir el equipo se registran los datos según el tipo: para Starlink, el <strong>número de serie (SN)</strong> y
              el tipo de kit; para BAM, el número de línea y la compañía. El identificador es la huella única del equipo durante
              todo su ciclo de vida.
            </p>
          </Step>
          <Step n={4} titulo="Registro en plataforma y vínculo a la obra" meta="Responsable: Jefe Depto. de Servicios y Capacitación">
            <p>
              El <strong>Jefe Depto. de Servicios y Capacitación</strong> ingresa los datos en la plataforma institucional
              <code> comunicacionesti.cindependencia.cl</code> y <strong>vincula el equipo a la obra</strong> para su seguimiento.
              A partir de aquí el equipo es rastreable y se asocia a su punto de instalación y a su nodo de monitoreo NetSensor.
            </p>
          </Step>
          <Step n={5} titulo="Confirmación y levantamiento del sitio" meta="Validación obligatoria">
            <p>
              El técnico instalador confirma que el equipo <strong>figura activo y vinculado</strong> a la obra correcta y, antes
              de programar la salida, ejecuta el <strong>levantamiento del sitio</strong> (energía y enchufes, vista al cielo,
              acceso seguro, capacidad). Sin activación confirmada y sin bloqueantes resueltos, la instalación no se agenda. Ver
              <strong> Preparación del sitio</strong>.
            </p>
          </Step>
        </StepsContainer>
      </div>


      <div className="grid-2" style={{ marginTop: 24 }}>
        <Card titulo="Plataforma institucional">
          <p>Punto único de registro y seguimiento del parque de equipos y nodos.</p>
          <p style={{ marginTop: 8, padding: '10px 12px', background: 'var(--green-soft)', borderRadius: 6, fontSize: 12.5 }}>
            <strong style={{ color: 'var(--green-deep)' }}>URL:</strong>{' '}
            <a href="https://comunicacionesti.cindependencia.cl/" style={{ color: 'var(--green-dark)', fontWeight: 500 }}>comunicacionesti.cindependencia.cl</a>
          </p>
        </Card>
        <Card titulo="Integración con el monitoreo">
          <p>
            El equipo y el nodo <strong>NetSensor</strong> de la oficina quedan asociados a la misma obra. Así el dashboard cruza
            "estado del enlace" con "calidad de internet medida", y el seguimiento remoto funciona desde el día 1.
          </p>
        </Card>
      </div>

      <Callout tipo="warn" titulo="Regla de trazabilidad">
        Todo equipo que ingresa a una obra debe estar <strong>activado y vinculado</strong> antes de instalarse. Equipos sin
        identificador (SN o número de línea) registrado no se despliegan. Cualquier cambio (reubicación, baja, reemplazo) se
        refleja en la plataforma el mismo día.
      </Callout>
    </>
  );
}
