import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';
import { TableWrap } from '@/components/ui/Table';

export function FlujoSection() {
  return (
    <>
      <PageHeader
        titulo="Flujo de trabajo"
        subtitulo="Proceso completo desde la solicitud hasta la entrega documentada."
        tag="Proceso"
      />

      <Callout tipo="info" titulo="Registro de identificadores al final">
        El número de serie del equipo Starlink (SN) o el número de teléfono del SIM (BAM) se registran en la
        plataforma <strong>después</strong> de completar la instalación y verificar que la red funciona
        correctamente. Registrar el identificador antes de instalar puede vincular un equipo que finalmente no
        quedó en esa obra (por falla, cambio de último momento o sustitución en terreno).
      </Callout>

      <StepsContainer>
        <Step n={1} titulo="Solicitud de internet desde obra" meta="Origen: Obra → Informática">
          <p>
            El Jefe de Obra o administrador levanta un ticket dirigido al departamento de Informática solicitando
            la instalación de internet. El ticket debe incluir:
          </p>
          <ul>
            <li>Nombre y código de la obra.</li>
            <li>Número de oficinas o dependencias que requieren conectividad.</li>
            <li>Nivel de urgencia y fecha estimada de necesidad.</li>
            <li>Nombre y contacto del responsable en terreno.</li>
          </ul>
        </Step>

        <Step n={2} titulo="Evaluación de demanda y selección de tecnología">
          <p>
            El Jefe de Departamento (I+D Hardware) analiza la cobertura de red celular disponible en el sitio y
            determina la tecnología a utilizar:
          </p>
          <ul>
            <li>
              <strong>BAM:</strong> si la obra tiene buena cobertura 4G/LTE. Se verifica con aplicaciones de
              mapa de cobertura del operador y, si es posible, con medición en terreno o consulta al Jefe de Obra.
            </li>
            <li>
              <strong>Starlink:</strong> si la obra es remota o la cobertura celular es insuficiente o
              inestable para uso corporativo.
            </li>
          </ul>
          <p>
            Esta decisión determina el kit de equipos a preparar y condiciona el levantamiento de sitio.
          </p>
        </Step>

        <Step n={3} titulo="Levantamiento del sitio (remoto)" meta="Responsable: Ingeniero de soporte">
          <p>
            El ingeniero de soporte realiza un levantamiento remoto con el Jefe de Obra mediante llamada o
            videollamada. Se deben confirmar los siguientes puntos antes de viajar:
          </p>
          <ul>
            <li>Disponibilidad de tomacorrientes cerca de cada punto de equipo.</li>
            <li>
              Punto de montaje con vista despejada al cielo (obligatorio si se usará Starlink; evaluar
              obstrucciones por estructuras, grúas o cerros).
            </li>
            <li>Distancias de cableado entre oficinas y entre el punto de enlace y el cuarto de equipos.</li>
            <li>Existencia de sala de servidores o rack; en su defecto, espacio habilitado para equipos.</li>
            <li>Cualquier bloqueante logístico: acceso restringido, horarios de obra, fechas de entrega parcial.</li>
          </ul>
          <p>
            El resultado es una lista de bloqueantes y confirmaciones que deben resolverse antes de la visita.
          </p>
        </Step>

        <Step n={4} titulo="Preparación de materiales y equipos">
          <p>
            El ingeniero de soporte prepara el kit de equipos correspondiente a la tecnología seleccionada:
          </p>
          <ul>
            <li>
              <strong>Kit BAM:</strong> módem SIM, SIM corporativa, router, switch, repetidores WiFi, patch
              cables, UPS, elementos de montaje.
            </li>
            <li>
              <strong>Kit Starlink:</strong> antena (Estándar o Mini), router Starlink, router adicional, switch,
              repetidores WiFi, cable de antena, soporte base + mástil, patch cables, UPS, elementos de montaje.
            </li>
          </ul>
          <p>
            Cada equipo debe ser probado antes de salir a terreno: encender, verificar firmware actualizado y
            confirmar que no hay fallas físicas visibles. No viajar con equipos sin verificar.
          </p>
        </Step>

        <Step n={5} titulo="Instalación física en terreno">
          <p>
            El ingeniero de soporte realiza la instalación en la obra:
          </p>
          <ul>
            <li>
              <strong>Enlace:</strong> montaje de la antena Starlink en el punto seleccionado (con vista
              despejada al cielo) o instalación del módem BAM en posición con mejor señal celular.
            </li>
            <li><strong>Cableado:</strong> tendido de cables entre el punto de enlace, cuarto de equipos,
              oficinas y galpones según el diseño acordado en el levantamiento.</li>
            <li><strong>Router y switch:</strong> instalación en rack o espacio habilitado, conexión y
              etiquetado de puertos.</li>
            <li><strong>Repetidores WiFi:</strong> montaje en cada oficina o galpón según el plan de cobertura.</li>
            <li><strong>UPS:</strong> instalación y conexión de los equipos críticos (enlace, router, switch).</li>
          </ul>
        </Step>

        <Step n={6} titulo="Configuración y activación de la red">
          <p>
            Con los equipos físicamente instalados, se procede a la configuración lógica:
          </p>
          <ul>
            <li>Configuración del router: red LAN, DHCP, WAN hacia el enlace (BAM o Starlink).</li>
            <li>Configuración del switch: VLANs si aplica, etiquetado de puertos.</li>
            <li>
              Creación de SSIDs: al menos una red principal de obra y, si corresponde, una red separada
              para administración.
            </li>
            <li>Configuración de repetidores WiFi y verificación de cobertura en cada punto.</li>
            <li>Verificación de funcionamiento del UPS: prueba de corte y tiempo de autonomía.</li>
          </ul>
        </Step>

        <Step n={7} titulo="Pruebas y verificación">
          <p>
            Antes de dar por terminada la instalación se realizan las siguientes pruebas:
          </p>
          <ul>
            <li><strong>Speed test:</strong> medición de velocidad de bajada y subida desde la red WiFi de obra.</li>
            <li><strong>Prueba de latencia:</strong> ping a servidores externos para confirmar estabilidad.</li>
            <li><strong>Cobertura WiFi:</strong> verificación de señal en cada oficina y galpón cubierto.</li>
            <li><strong>Prueba de UPS:</strong> corte manual de energía y confirmación de continuidad de los equipos.</li>
            <li>
              <strong>Acceso desde dispositivos de obra:</strong> conexión desde al menos un computador y un
              celular del personal de obra para validar acceso real.
            </li>
          </ul>
          <p>
            Si alguna prueba falla, se corrige antes de continuar al paso de registro.
          </p>
        </Step>

        <Step n={8} titulo="Registro de identificadores y actualización de plataforma" meta="AL FINAL · Responsable: Ingeniero de soporte">
          <p>
            Solo una vez que la instalación está completa y verificada se procede al registro en la plataforma
            institucional:
          </p>
          <ul>
            <li>
              Acceder a <strong>comunicacionesti.cindependencia.cl</strong> y registrar el identificador del
              equipo instalado:
              <ul>
                <li><strong>Starlink:</strong> número de serie (SN) de la antena.</li>
                <li><strong>BAM:</strong> número de teléfono del SIM corporativo instalado.</li>
              </ul>
            </li>
            <li>Vincular el equipo registrado a la obra correspondiente en la plataforma.</li>
            <li>Confirmar que el registro queda correctamente asociado antes de cerrar la visita.</li>
          </ul>
          <p>
            <strong>Por qué al final:</strong> registrar el identificador después de instalar garantiza que el
            equipo vinculado en la plataforma es exactamente el que quedó físicamente en esa obra y está
            funcionando. Si el equipo se cambia en terreno por una falla o sustitución, el registro refleja
            la realidad.
          </p>
        </Step>

        <Step n={9} titulo="Entrega y documentación">
          <p>
            El cierre formal de la instalación incluye:
          </p>
          <ul>
            <li>
              <strong>Briefing al Jefe de Obra:</strong> explicar cómo reportar problemas de internet
              (ticket a Informática), a quién llamar en caso de urgencia y qué no hacer con los equipos.
            </li>
            <li>
              <strong>Registro fotográfico:</strong> fotos de la antena/módem montado, del cuarto de equipos,
              del cableado y de los repetidores WiFi instalados.
            </li>
            <li>
              <strong>Documentación de la red:</strong> SSID y contraseñas de las redes WiFi, ubicación física
              de cada equipo, diagrama simplificado de la topología.
            </li>
            <li>
              <strong>Cierre del ticket:</strong> actualizar el ticket de Informática con el resumen de lo
              instalado, fotos adjuntas y confirmación de entrega.
            </li>
          </ul>
        </Step>
      </StepsContainer>

      <Card titulo="Resumen del proceso">
        <TableWrap>
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Fase</th>
              <th style={{ width: '30%' }}>Responsable</th>
              <th>Entregable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solicitud</td>
              <td>Obra</td>
              <td>Ticket de solicitud</td>
            </tr>
            <tr>
              <td>Evaluación</td>
              <td>Jefe I+D</td>
              <td>Decisión BAM o Starlink</td>
            </tr>
            <tr>
              <td>Levantamiento</td>
              <td>Ing. Soporte</td>
              <td>Lista de bloqueantes</td>
            </tr>
            <tr>
              <td>Preparación</td>
              <td>Ing. Soporte</td>
              <td>Kit completo y verificado</td>
            </tr>
            <tr>
              <td>Instalación</td>
              <td>Ing. Soporte</td>
              <td>Red operativa en terreno</td>
            </tr>
            <tr>
              <td>Verificación</td>
              <td>Ing. Soporte</td>
              <td>Pruebas OK</td>
            </tr>
            <tr>
              <td>Registro</td>
              <td>Ing. Soporte</td>
              <td>Equipo vinculado en plataforma</td>
            </tr>
            <tr>
              <td>Entrega</td>
              <td>Ing. Soporte</td>
              <td>Obra informada y ticket cerrado</td>
            </tr>
          </tbody>
        </TableWrap>
      </Card>
    </>
  );
}
