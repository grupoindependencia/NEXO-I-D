import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';
import { TableWrap, Pill } from '@/components/ui/Table';

const SINTOMAS: Array<[string, string, string, string]> = [
  ['Sin internet, pero la app muestra la antena conectada', 'Caída de Starlink / ISP de salida (no del WiFi local).', 'Verificar cortes y obstrucciones en la app Starlink. Esperar restablecimiento del servicio.', 'Escalar al proveedor / Jefe de comunicaciones.'],
  ['Antena offline en la app', 'Sin energía, cable suelto o enchufe Starlink mal insertado.', 'Guiar al usuario: revisar enchufe, fuente y tomacorriente; reinsertar conector al ras.', 'Visita a terreno con repuestos.'],
  ['Alertas de obstrucción en la app', 'Árbol crecido, estructura nueva o equipo movido.', 'Revisar historial de obstrucciones; coordinar despeje o reorientación.', 'Visita para reubicar la antena.'],
  ['Internet lento / intermitente', 'Congestión, clima o vista parcialmente obstruida.', 'Revisar estadísticas en la app; reiniciar antena (desenchufar/enchufar).', 'Visita para realineación.'],
  ['WiFi de una sola oficina caída (resto OK)', 'Falla del repetidor o del cable de ese galpón.', 'Reiniciar el repetidor del galpón; verificar el cable del switch.', 'Reemplazo de repetidor / cable.'],
  ['Cámara biométrica sin conexión', 'Cable Ethernet de la cámara o puerto RJ45.', 'Verificar el cable de la cámara y el puerto de la antena/router.', 'Visita para revisar cableado.'],
];

export function EnlaceSection() {
  return (
    <>
      <PageHeader
        titulo="Operación y soporte del enlace"
        subtitulo="Cómo se atiende un corte de internet Starlink: primero remoto, luego terreno. Incluye reposición de equipos."
        tag="Mantenimiento"
      />

      <div className="grid-2">
        <Card titulo="1ª línea · Asesoría técnica remota">
          <p>
            Ante un reporte de corte, <strong>Axel Muñoz</strong> atiende primero de forma remota, guiando al usuario por un
            protocolo básico de reconexión. La mayoría de los cortes se resuelven sin desplazamiento.
          </p>
          <ul>
            <li>Revisión del estado en la app Starlink y en el dashboard.</li>
            <li>Verificación de energía, cableado y reinicio guiado.</li>
            <li>Confirmación de obstrucciones o cortes de servicio.</li>
          </ul>
        </Card>
        <Card titulo="2ª línea · Visita a terreno">
          <p>
            Si el caso no se resuelve remotamente, <strong>Julio Sepúlveda autoriza</strong> la visita y se asigna a
            <strong> Rodrigo Rojas</strong> para diagnóstico presencial.
          </p>
          <ul>
            <li>Diagnóstico físico de antena, router, switch y repetidores.</li>
            <li>Realineación o reubicación si hay obstrucciones nuevas.</li>
            <li>Reemplazo de equipo dañado con registro del cambio.</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Protocolo de reconexión guiada (remoto)"
          subtitulo="Pasos que el técnico hace seguir al usuario por teléfono antes de escalar a terreno."
        />
        <StepsContainer>
          <Step n={1} titulo="Revisar la app Starlink">
            <p>Pedir al usuario abrir la app y reportar si hay <strong>alertas, cortes u obstrucciones</strong> indicados.</p>
          </Step>
          <Step n={2} titulo="Leer la luz de estado de la antena">
            <p>Parpadeo lento = encendida · sin luz = sin energía · parpadeo rápido = reinicio en curso.</p>
          </Step>
          <Step n={3} titulo="Verificar conexiones físicas">
            <p>Confirmar que todo esté enchufado, que el enchufe Starlink quede al ras y que no haya cables dañados.</p>
          </Step>
          <Step n={4} titulo="Reiniciar el equipo">
            <p>Desenchufar la antena, esperar unos segundos y volver a enchufar. Esperar a que recupere el satélite.</p>
          </Step>
          <Step n={5} titulo="Reiniciar router / repetidor del punto afectado">
            <p>Si solo una oficina perdió WiFi, reiniciar su repetidor y revisar el cable proveniente del switch.</p>
          </Step>
          <Step n={6} titulo="Restablecimiento de fábrica (última instancia)">
            <p>Mantener presionado el ícono de reinicio en la parte posterior 3 segundos hasta el parpadeo rápido. Reconfigurar la red al volver.</p>
          </Step>
          <Step n={7} titulo="Escalar a terreno" meta="Julio Sepúlveda autoriza · ticket abierto">
            <p>Si tras los pasos anteriores no hay servicio, se documenta y se agenda visita con Rodrigo Rojas.</p>
          </Step>
        </StepsContainer>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Matriz de síntomas del enlace"
          subtitulo="Diagnóstico rápido y acción inicial según lo que reporta la obra o el dashboard."
        />
        <TableWrap>
          <thead>
            <tr>
              <th style={{ width: '24%' }}>Síntoma</th>
              <th style={{ width: '24%' }}>Diagnóstico probable</th>
              <th>Acción inicial (remota)</th>
              <th style={{ width: '18%' }}>Si no resuelve</th>
            </tr>
          </thead>
          <tbody>
            {SINTOMAS.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Verificación de obstrucciones (preventivo)"
          subtitulo="La vista despejada se valida en la instalación y se revisa cuando aparecen alertas."
        />
        <div className="grid-2">
          <Card titulo="Qué revisar">
            <ul>
              <li>Árboles que hayan crecido sobre el cono de visión.</li>
              <li>Estructuras o containers nuevos que crucen la línea al cielo.</li>
              <li>Cableado aéreo agregado después de la instalación.</li>
              <li>Antena movida de su orientación original.</li>
            </ul>
          </Card>
          <Card titulo="Buenas prácticas de fijación">
            <p>
              La antena va <strong>siempre</strong> sobre el soporte base + mástil anclado a una estructura firme (muro, parapeto,
              poste o losa), <strong>nunca</strong> suelta sobre el techo ni con objetos para inclinarla. La orientación se fija con
              el soporte y la app. Esto evita caídas, desalineaciones y filtraciones, y aplica a Estándar y Mini.
            </p>
          </Card>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Reposición y compra de equipos"
          subtitulo="Cómo se gestiona un reemplazo o un equipo nuevo."
        />
        <StepsContainer>
          <Step n={1} titulo="Detección de necesidad" meta="Téc. terreno o Soporte Integral">
            <p>Equipo dañado, fin de vida útil o nueva obra que requiere enlace.</p>
          </Step>
          <Step n={2} titulo="Cotización en sucursal Santiago">
            <p>Se solicita cotización para compra en la sucursal de Santiago. Plazo de entrega habitual: <strong>2 a 3 días hábiles</strong>.</p>
          </Step>
          <Step n={3} titulo="Autorización" meta="Rodrigo Solís · Julio Sepúlveda">
            <p>La compra/reposición se autoriza según presupuesto y prioridad de la obra.</p>
          </Step>
          <Step n={4} titulo="Activación del nuevo equipo y baja del anterior">
            <p>El equipo nuevo se registra (SN) y se vincula a la obra; el equipo reemplazado se da de baja en la plataforma. Ver <strong>Activación</strong>.</p>
          </Step>
        </StepsContainer>
      </div>

      <Callout tipo="ok" titulo="El monitoreo se adelanta al reclamo">
        Gracias a los nodos <strong>NetSensor</strong>, el dashboard suele detectar la degradación del enlace
        (GW OK + INET con pérdida = falla Starlink/ISP) <strong>antes</strong> de que la obra llame. El objetivo es pasar de un
        soporte reactivo a uno preventivo. Lectura del dashboard: sección <strong>Diagnóstico</strong>; acciones remotas sobre el
        nodo: sección <strong>Soporte remoto</strong>.
      </Callout>

      <Callout tipo="warn" titulo="Toda intervención deja registro">
        Cada atención (remota o en terreno) se documenta en la plataforma con síntoma, causa, acción, resultado y, si aplica,
        equipo reemplazado. Sin registro no hay trazabilidad ni historial del enlace.
      </Callout>
    </>
  );
}
