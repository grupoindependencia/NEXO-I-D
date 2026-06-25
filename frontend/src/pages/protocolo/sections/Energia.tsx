import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';

const CARGA: Array<[string, string, string]> = [
  ['Antena Starlink Estándar', 'AC (fuente dedicada) · ~75–100 W (sistema)', 'AC — UPS con AVR (carga alta)'],
  ['Antena Starlink Mini', 'DC 12–48 V · ~25–40 W (pico ~60 W al arrancar)', 'DC — admite respaldo por batería / power bank'],
  ['Router', 'AC · ~5–15 W', 'AC — UPS con AVR'],
  ['Switch', 'AC · ~8–20 W', 'AC — UPS con AVR'],
  ['Repetidores (por galpón)', 'AC · ~5–10 W c/u', 'AC — UPS local o supresor por punto'],
  ['Cámara biométrica', '~5–12 W', 'AC/PoE — UPS con AVR (servicio crítico)'],
  ['Nodo NetSensor', 'USB · ~2–3 W', 'Al UPS junto al router (ver más abajo)'],
];

const PROTECCION: Array<{ nivel: string; tipo: 'i' | 'a' | 'ok'; equipo: string; protege: string }> = [
  { nivel: 'Mínimo', tipo: 'i', equipo: 'Supresor de transientes (surge) en cada equipo', protege: 'Picos de tensión (maquinaria, rayos cercanos, entrada de generador).' },
  { nivel: 'Recomendado', tipo: 'ok', equipo: 'UPS line-interactive con AVR para el gabinete de red', protege: 'Caídas/subidas de voltaje (brownouts) y microcortes — sin gastar batería.' },
  { nivel: 'Antena', tipo: 'a', equipo: 'DC UPS / power bank USB-C PD (100 W · 20 V·5 A) o batería 12 V con elevador', protege: 'Mantiene el enlace satelital durante cortes; por su bajo consumo rinde horas.' },
];

export function EnergiaSection() {
  return (
    <>
      <PageHeader
        titulo="Energía y continuidad eléctrica"
        subtitulo="Las obras tienen energía inestable: caídas de voltaje, cortes y transientes de generador. Sin protección, los routers se reinician y se acortan su vida útil."
        tag="Resiliencia"
      />

      <Callout tipo="warn" titulo="Por qué esto importa">
        Un brownout (caída de voltaje) reinicia routers y repetidores: la red se cae aunque el enlace Starlink esté bien. Repetido
        en el tiempo, <strong>degrada y acorta la vida útil del hardware</strong>. Además, sin respaldo no se distingue un corte de
        luz de una falla real del enlace en el monitoreo.
      </Callout>

      <div style={{ marginTop: 8 }}>
        <PageHeader titulo="Cadena de energía y carga" subtitulo="Todo lo que necesita alimentación en el enlace. Sumar la carga real define el UPS y la cantidad de tomas." />
        <TableWrap>
          <thead><tr><th style={{ width: '26%' }}>Equipo</th><th style={{ width: '36%' }}>Alimentación · consumo aprox.</th><th>Respaldo recomendado</th></tr></thead>
          <tbody>
            {CARGA.map((r, i) => (
              <tr key={i}>
                <td><strong>{r[0]}</strong></td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <p style={{ marginTop: 10, fontSize: 12.5, color: 'var(--ink-3)' }}>
          Valores referenciales — confirmar con la placa de cada equipo. La red completa ronda <strong>~80–150 W</strong> con antena Mini y <strong>más</strong> con antena Estándar.
        </p>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader titulo="Escalera de protección eléctrica" subtitulo="Tres niveles según criticidad y presupuesto. La cámara biométrica y el router/switch son prioritarios." />
        <TableWrap>
          <thead><tr><th style={{ width: '14%' }}>Nivel</th><th style={{ width: '40%' }}>Equipo de protección</th><th>Qué resuelve</th></tr></thead>
          <tbody>
            {PROTECCION.map((p, i) => (
              <tr key={i}>
                <td><Pill tipo={p.tipo}>{p.nivel}</Pill></td>
                <td>{p.equipo}</td>
                <td>{p.protege}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <Callout tipo="info" titulo="Por qué AVR y no solo una UPS común">
          El <strong>AVR (regulación automática de voltaje)</strong> de una UPS line-interactive corrige las caídas y subidas de
          tensión <strong>sin pasar a batería</strong>. En una obra con brownouts frecuentes, una UPS sin AVR estaría todo el día
          conmutando a batería (que se agota), mientras que con AVR el equipo de red recibe voltaje estable de forma continua.
        </Callout>
      </div>

      <div className="grid-2" style={{ marginTop: 28 }}>
        <Card titulo="Según el modelo de antena">
          <ul>
            <li><strong>Mini (DC 12–48 V, USB-C PD 100 W):</strong> puede respaldarse con un <strong>DC UPS o power bank</strong> sin inversor; por su bajo consumo (~25–40 W), un banco modesto rinde varias horas.</li>
            <li><strong>Estándar (AC, ~75–100 W):</strong> va a la <strong>UPS line-interactive con AVR</strong>; consume bastante más, así que reduce la autonomía y exige dimensionar mejor.</li>
          </ul>
        </Card>
        <Card titulo="Dimensionamiento del UPS">
          <ul>
            <li>Proteger <strong>solo el equipo de red</strong>: nunca calefactores ni herramientas.</li>
            <li>Autonomía objetivo: librar brownouts y microcortes (orden de <strong>30–60 min</strong>).</li>
            <li>Con Mini la carga ronda <strong>~80–150 W</strong>; con Estándar puede superar los <strong>~150 W</strong>. Una UPS line-interactive de <strong>~600–1000 VA con AVR</strong> es un punto de partida; subir capacidad con Estándar.</li>
          </ul>
        </Card>
      </div>

      <Callout tipo="ok" titulo="Insight · el respaldo también es diagnóstico">
        Si el <strong>nodo NetSensor y el router van al mismo UPS</strong>, durante una caída de luz el nodo <strong>sigue
        reportando</strong>: el dashboard muestra que el enlace y la red local siguen vivos y que lo que falló fue la energía del
        sitio. Sin respaldo, todo cae junto y es imposible saber la causa. Esto alimenta la matriz de diagnóstico
        (ver <strong>Diagnóstico</strong>) y convierte el soporte reactivo en preventivo.
      </Callout>

      <div className="grid-2" style={{ marginTop: 28 }}>
        <Card titulo="Puesta a tierra y entrada de cable">
          <ul>
            <li>Aterrizar la estructura de montaje de la antena (estática y rayos en techo expuesto).</li>
            <li>Sellar la entrada del cable al interior (más aún si se usó RJ45, que ya compromete el IP67).</li>
            <li>Proteger los tramos de cable de maquinaria, pisoteo, roedores y sol.</li>
          </ul>
        </Card>
        <Card titulo="Cierre y suspensión">
          <ul>
            <li>Al terminar la obra, <strong>suspender el servicio Starlink</strong> para no seguir pagando.</li>
            <li>Apagado ordenado y retiro de equipos; reutilizar en otra obra con nueva activación.</li>
            <li>Registrar baja del equipo en la plataforma. Ver <strong>Activación</strong>.</li>
          </ul>
        </Card>
      </div>

      <Callout tipo="info" titulo="En la lista de materiales">
        Toda instalación nueva debe incluir, según el levantamiento del sitio, al menos un <strong>supresor de transientes</strong> y,
        cuando hay brownouts o servicios críticos (cámara), una <strong>UPS con AVR</strong>. Esto se define en
        <strong> Preparación del sitio</strong> y se valida antes de salir a terreno.
      </Callout>
    </>
  );
}
