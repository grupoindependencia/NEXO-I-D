import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';

export function VerificacionSection() {
  return (
    <>
      <PageHeader
        titulo="Verificación y puesta en marcha"
        subtitulo="Pruebas de aceptación que deben pasar antes de cerrar la instalación."
        tag="Instalación"
      />

      <Callout tipo="warn" titulo="Sin verificación no hay cierre">
        Ninguna instalación se cierra oficialmente hasta que todas las pruebas de aceptación hayan pasado. Si
        alguna falla, se corrige el problema antes de continuar — no se registra ni se entrega la obra con pruebas
        pendientes.
      </Callout>

      <div className="grid-2" style={{ marginTop: 4 }}>
        <Card titulo="Prueba de velocidad">
          <p>
            Usar <strong>speedtest.net</strong> o <strong>fast.com</strong>. Objetivos mínimos:
          </p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>BAM: ≥ 10 Mbps de descarga.</li>
            <li>Starlink: ≥ 20 Mbps de descarga.</li>
          </ul>
          <p style={{ marginTop: 8 }}>
            Ejecutar primero desde un dispositivo por cable (laptop via Ethernet directo al router), luego desde WiFi.
            Documentar ambos resultados con fecha y hora.
          </p>
        </Card>

        <Card titulo="Prueba de latencia">
          <p>
            Ejecutar <code>ping 8.8.8.8</code> durante al menos 30 segundos. Valores aceptables:
          </p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Starlink: promedio &lt; 150 ms.</li>
            <li>BAM: promedio &lt; 80 ms.</li>
            <li>Pérdida de paquetes: 0%.</li>
          </ul>
          <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ink-3)' }}>
            Si la latencia tiene picos o la pérdida supera el 1%, diagnosticar antes de cerrar.
          </p>
        </Card>

        <Card titulo="Cobertura WiFi">
          <p>
            Recorrer cada oficina y galpón con un teléfono. Verificar la intensidad de señal con la app{' '}
            <strong>WiFi Analyzer</strong>. Marcar en el plano toda zona muerta detectada.
          </p>
          <p style={{ marginTop: 8 }}>
            Si se encuentra una zona sin cobertura: reubicar el repetidor o agregar una unidad adicional antes de dar
            por terminada la prueba.
          </p>
        </Card>

        <Card titulo="Continuidad eléctrica">
          <p>
            Simular un corte de energía de 30 segundos desenchufando la UPS de la pared. Verificar:
          </p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>El internet se mantiene activo durante el corte.</li>
            <li>Todos los equipos se recuperan automáticamente al volver la energía.</li>
            <li>Ningún equipo requiere reinicio manual.</li>
          </ul>
        </Card>
      </div>

      <StepsContainer>
        <Step n={1} titulo="Registro de resultados">
          <p>
            Documentar todos los resultados de las pruebas (velocidad, latencia, cobertura) en la orden de trabajo.
            Tomar capturas de pantalla de los resultados de speedtest. Anotar la hora y fecha de cada prueba.
          </p>
        </Step>

        <Step
          n={2}
          titulo="Registro de identificadores en plataforma"
          meta="Responsable: Ingeniero de soporte · ÚLTIMO PASO"
        >
          <p>
            Una vez confirmadas todas las pruebas, registrar el equipo en la plataforma institucional{' '}
            <strong>comunicacionesti.cindependencia.cl</strong>:
          </p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>
              <strong>Starlink:</strong> ingresar el número de serie (SN) que figura en la etiqueta de la antena y
              vincularlo a la obra.
            </li>
            <li>
              <strong>BAM:</strong> ingresar el número de teléfono de la SIM, el operador y vincularlo a la obra.
            </li>
          </ul>
          <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ink-3)' }}>
            Este paso se realiza al final para garantizar que el identificador registrado corresponde al equipo
            efectivamente instalado y funcionando.
          </p>
        </Step>

        <Step n={3} titulo="Briefing al Jefe de Obra">
          <p>Antes de salir de la obra, explicar al Jefe de Obra:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>A quién llamar ante una falla y qué información entregar al reportar.</li>
            <li>El SSID y la contraseña de la red WiFi.</li>
            <li>
              Que si el internet se cae puede ser una interrupción planificada o un problema de satélite (Starlink):
              esperar ~10 minutos antes de llamar.
            </li>
          </ul>
          <p style={{ marginTop: 8 }}>
            Entregar la tarjeta resumen impresa con los datos de contacto y la información de la red.
          </p>
        </Step>

        <Step n={4} titulo="Cierre del ticket">
          <p>
            Subir las fotos de la instalación al ticket. Marcar el ticket como resuelto. Actualizar el registro de
            equipos de la obra con el estado actual.
          </p>
        </Step>
      </StepsContainer>

      <Callout tipo="ok" titulo="Criterios de aceptación">
        <p style={{ marginBottom: 6 }}>
          Los seis criterios deben cumplirse para cerrar la instalación:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.85, margin: 0 }}>
          <li>Velocidad de descarga ≥ valor objetivo según tecnología.</li>
          <li>Latencia dentro del rango aceptable con 0% de pérdida de paquetes.</li>
          <li>Cobertura WiFi confirmada en todas las oficinas y galpones.</li>
          <li>Prueba de corte de UPS superada sin reinicios manuales.</li>
          <li>Identificador registrado en la plataforma institucional.</li>
          <li>Briefing entregado al Jefe de Obra con tarjeta resumen.</li>
        </ul>
      </Callout>
    </>
  );
}
