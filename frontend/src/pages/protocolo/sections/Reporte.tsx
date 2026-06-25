import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';
import { TableWrap } from '@/components/ui/Table';
import './Reporte.css';

const FILAS = [
  ['Oficina Central',                       'Sin incidencias · 100% uptime',                    'ok'],
  ['Paseo Hacienda II',                     'Sin incidencias · RSSI estable -62 dBm',            'ok'],
  ['Hacienda Esmeralda 44 viv.',            'Sin incidencias · 6 reconexiones',                  'ok'],
  ['Parque del Sol Sepúlveda',              'Sin incidencias',                                   'ok'],
  ['Parque del Country 28 viv.',            'RSSI bajo (-76 dBm) intermitente · evaluar reubicación', 'warn'],
  ['Bicentenario III ET 4',                 'Sin incidencias',                                   'ok'],
  ['Bicentenario IV Lircay',                'Nodo desconectado desde 04-06 · sin respuesta del Jefe de Obra', 'crit'],
  ['Sala de Ventas Paseo Hacienda II',      'Sin incidencias',                                   'ok'],
  ['Bicentenario II Lircay 296 viv.',       'Sin incidencias',                                   'ok'],
] as const;

const ICONO: Record<string, { bg: string; ch: string }> = {
  ok:   { bg: '#1FA845', ch: '✓' },
  warn: { bg: '#E5A627', ch: '!' },
  crit: { bg: '#D43F3F', ch: '✕' },
};

export function ReporteSection() {
  return (
    <>
      <div className="reporte-extras">
        <PageHeader
          titulo="Reporte semanal de red en obras"
          subtitulo="Envío automatizado cada viernes vía correo corporativo. Generación automática del dashboard, complementada con observaciones del encargado."
          tag="Comunicación"
        />

        <div className="grid-3">
          <Card titulo="Frecuencia">
            <p><strong>Cada viernes a las 17:00 hrs</strong>, automáticamente desde la plataforma de gestión. La planilla se compone con los datos acumulados de la semana lunes a viernes.</p>
          </Card>
          <Card titulo="Responsable">
            <p><strong>Axel Muñoz</strong> revisa y completa observaciones antes del envío. <strong>Julio Sepúlveda</strong> valida y autoriza la salida. El sistema lo envía en su nombre.</p>
          </Card>
          <Card titulo="Destinatarios">
            <p>Rodrigo Solís, Julio Sepúlveda, Jefes de Obra con nodos instalados y Gerencia TI. Lista parametrizable desde la plataforma.</p>
          </Card>
        </div>

        <div style={{ marginTop: 32 }}>
          <PageHeader titulo="Plantilla del reporte" subtitulo="Vista previa del correo que reciben los destinatarios. Al descargar PDF se exporta únicamente esta plantilla." />
        </div>
      </div>

      {/* La plantilla es lo único que se imprime al descargar PDF */}
      <div className="reporte-mockup">
        <p>Estimados,</p>
        <p>Junto con saludar, compartimos el resultado de la revisión semanal del estado de red de las obras monitoreadas por el sistema NetSensor.</p>

        <div className="rep-header">
          <div className="rep-brand">
            <img src="/logo-icon.png" alt="Independencia" />
            <div>
              <div className="rep-name">NetSensor</div>
              <div className="rep-co">Constructora Independencia</div>
            </div>
          </div>
          <div className="rep-legend">
            <span><span className="rep-dot" style={{ background: '#1FA845' }}>✓</span> Sin problemas</span>
            <span><span className="rep-dot" style={{ background: '#E5A627' }}>!</span> Revisar</span>
            <span><span className="rep-dot" style={{ background: '#D43F3F' }}>✕</span> Urgente</span>
          </div>
        </div>

        <div className="rep-stats">
          <div><div className="k">9</div><div className="l">Nodos en flota</div></div>
          <div><div className="k" style={{ color: 'var(--green)' }}>7</div><div className="l">Sin problemas</div></div>
          <div><div className="k" style={{ color: 'var(--warn)' }}>1</div><div className="l">Para revisar</div></div>
          <div><div className="k" style={{ color: 'var(--crit)' }}>1</div><div className="l">Urgentes</div></div>
        </div>

        <table className="rep-table">
          <thead>
            <tr><th>Obra</th><th>Detalle</th><th style={{ width: 80, textAlign: 'center' }}>Estado</th></tr>
          </thead>
          <tbody>
            {FILAS.map((f, i) => {
              const ico = ICONO[f[2]];
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{f[0]}</td>
                  <td style={{ color: 'var(--ink-2)' }}>{f[1]}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="rep-dot" style={{ background: ico.bg }}>{ico.ch}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="rep-obs">
          <div className="rep-obs-h">Observaciones de la semana</div>
          <p>
            El nodo de <strong>Bicentenario IV Lircay</strong> sigue desconectado desde el 04-06. Se realizaron dos intentos
            de contacto con el Jefe de Obra sin respuesta. Se coordinará visita en terreno la próxima semana con Rodrigo Rojas.
          </p>
          <p style={{ marginTop: 10 }}>
            El nodo de <strong>Parque del Country</strong> presenta señal débil intermitente. Sugiero coordinar con jefe de obra
            para evaluar reubicación o instalación de repetidor WiFi en la oficina de digitación.
          </p>
        </div>

        <div className="rep-acc">
          <div className="rep-acc-h">Acciones de la semana</div>
          <ul>
            <li>Reinicio remoto exitoso en Hacienda Esmeralda tras 4 reconexiones consecutivas (martes).</li>
            <li>Coordinación con Jefe de Obra Bicentenario III para ajuste de canal WiFi (miércoles).</li>
            <li>Visita programada para próximo lunes a Bicentenario IV con Rodrigo Rojas.</li>
          </ul>
        </div>

        <div className="rep-firma">
          Saludos cordiales,<br/>
          <strong>Axel Muñoz</strong> · Técnico de Soporte Integral<br/>
          <strong>Julio Sepúlveda</strong> · Coord. de Soporte y Equipos<br/>
          <span style={{ color: 'var(--green)' }}>Constructora Independencia · I+D Hardware</span>
        </div>
      </div>

      <div className="reporte-extras">
        <div style={{ marginTop: 36 }}>
          <PageHeader titulo="Flujo de generación y envío" subtitulo="El reporte se compone automáticamente pero requiere validación humana antes del envío." />
          <StepsContainer>
            <Step n={1} titulo="Lunes a viernes · Acumulación automática"><p>La plataforma recolecta diariamente los datos del dashboard: estado de cada nodo, métricas promedio, eventos de desconexión. Cada día Axel completa el <strong>checklist diario</strong>, cuyas notas se asocian al nodo y alimentan el reporte semanal.</p></Step>
            <Step n={2} titulo="Viernes 14:00 · Borrador generado"><p>El sistema genera el borrador con la tabla por obra ya pre-cargada con estados (✓ / ! / ✕) según umbrales: <code>uptime &gt; 95%</code> verde, <code>80–95%</code> amarillo, <code>&lt; 80% o nodo caído</code> rojo.</p></Step>
            <Step n={3} titulo="Viernes 14:00 a 16:30 · Observaciones"><p>Axel revisa el borrador, agrega <strong>observaciones cualitativas</strong> que no aparecen en métricas (gestiones con jefes de obra, hipótesis de fallas, próximos pasos) y completa "Acciones de la semana".</p></Step>
            <Step n={4} titulo="Viernes 16:30 · Validación"><p>Julio Sepúlveda revisa el reporte y lo valida en la plataforma. Si requiere cambios, se devuelve a Axel.</p></Step>
            <Step n={5} titulo="Viernes 17:00 · Envío automático" meta="Trazabilidad obligatoria"><p>El sistema envía el correo a la lista de distribución. Se conserva copia en la plataforma con timestamp y firma electrónica de quien validó.</p></Step>
          </StepsContainer>
        </div>

        <div style={{ marginTop: 32 }}>
          <PageHeader titulo="Lista de distribución" subtitulo="Quién recibe el reporte y por qué. Mantener actualizada en la plataforma." />
          <TableWrap>
            <thead><tr><th style={{ width: '30%' }}>Destinatario</th><th>Rol</th><th>Motivo</th></tr></thead>
            <tbody>
              <tr><td><strong>Rodrigo Solís</strong></td><td>Jefe I+D · Hardware</td><td>Visión global del proyecto · KPI mensual</td></tr>
              <tr><td><strong>Julio Sepúlveda</strong></td><td>Coord. Soporte y Equipos</td><td>Validación y seguimiento operativo</td></tr>
              <tr><td><strong>Jefes de Obra con nodos</strong></td><td>Custodios en obra</td><td>Conciencia del estado de su nodo · acción local</td></tr>
              <tr><td><strong>Rosa Ramírez</strong></td><td>Jefa de TI</td><td>Visibilidad transversal del estado de conectividad</td></tr>
              <tr><td><strong>Gerencia (CC)</strong></td><td>Vicente Moyano · Operaciones</td><td>Solo en caso de incidencias urgentes (rojo)</td></tr>
            </tbody>
          </TableWrap>
        </div>

        <Callout tipo="info" titulo="De dónde sale el contenido">
          El reporte se compone automáticamente con los datos del dashboard <strong>más</strong> las observaciones del
          <strong> checklist diario</strong> que ejecuta Axel Muñoz. Cada item respondido se asocia al nodo correspondiente
          y alimenta tanto la columna "Detalle" como la sección "Observaciones". Configuración de plantillas y ejecuciones:
          ver sección <strong>Checklists</strong>.
        </Callout>

        <Callout tipo="warn" titulo="Casos especiales · envío urgente">
          Si en cualquier momento de la semana hay un <strong>incidente crítico</strong> (≥ 3 nodos caídos simultáneamente o caída de Oficina Central), se envía un reporte urgente fuera del ciclo semanal, con la misma plantilla y nota destacada en rojo en la cabecera.
        </Callout>
      </div>
    </>
  );
}
