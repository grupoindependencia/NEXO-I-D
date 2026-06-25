import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';

const CASOS = [
  ['1',  'Punto verde, RSSI > -65, ping OK',                'Operación normal',                  'Ninguna · seguir monitoreando',                                       'A. Muñoz',                '—'],
  ['2',  'Punto rojo en mapa',                              'Sin reporte > 30 min',              'Activar flujo de desconexión',                                        'A. Muñoz',                '2 h'],
  ['3',  'Varios puntos rojos misma obra',                  'Corte general en la obra',          'Llamar a Jefe de Obra · verificar luz y router',                      'A. Muñoz',                '1 h'],
  ['4',  'Sin GPS · no aparece en mapa',                    'Coordenadas no configuradas',        'Pedir lat/lon a Jefe de Obra · reconfigurar dashboard local',         'A. Muñoz',                '24 h'],
  ['5',  'RSSI < -78 sostenido (línea plana abajo)',        'Cobertura WiFi mala',                'Coordinar reubicación o instalar repetidor',                          'A. Muñoz → R. Rojas',     '72 h'],
  ['6',  'RSSI oscilante (sube y baja)',                    'Interferencia o canal saturado',     'Cambiar canal del router · evaluar reubicación',                      'A. Muñoz',                '48 h'],
  ['7',  'GW Ping alto + INET Ping OK',                     'Router filtra ICMP',                 'Informativo · no actuar',                                              '—',                       '—'],
  ['8',  'GW OK + INET alto o con pérdida',                 'Starlink/ISP degradado',             'Verificar app Starlink · escalar a proveedor',                        'A. Muñoz → J. Sepúlveda', '24 h'],
  ['9',  'GW alto + INET alto',                             'WiFi local inestable',               'Diagnóstico de canal y distancia',                                    'A. Muñoz',                '48 h'],
  ['10', 'Reconexiones > 5 en el día',                      'Inestabilidad red o fuente',         'Revisar histórico · evaluar reemplazo de fuente',                     'A. Muñoz',                '72 h'],
  ['11', 'Muestras < 200 esperando 288',                    'Nodo intermitente',                  'Revisar uptime y patrones horarios',                                  'A. Muñoz',                '48 h'],
  ['12', 'Uptime se reinicia varias veces al día',          'Cortes de luz o crash de firmware',  'Coordinar UPS con obra · evaluar firmware',                           'J. Sepúlveda',            '1 sem'],
  ['13', '"Activo" pero sin muestras > 24 h',               'Nodo congelado',                     'Reinicio remoto desde dashboard local',                               'A. Muñoz',                '12 h'],
  ['14', 'IP cambia frecuentemente entre muestras',         'DHCP del router inestable',          'Pedir reserva DHCP a TI de la obra',                                  'A. Muñoz',                '1 sem'],
  ['15', 'Último visto > 7 días, sigue "Activo"',           'Falla silenciosa',                   'Visita en terreno con repuestos',                                     'J. Sepúlveda → R. Rojas', '72 h'],
  ['16', 'Mismo MAC reportando desde otra obra',            'Movido sin coordinación o sustraído', 'Bloquear MAC · investigar · abrir incidente',                         'J. Sepúlveda + R. Solís', 'Inmediato'],
];

export function DiagnosticoSection() {
  return (
    <>
      <PageHeader
        titulo="Diagnóstico desde el dashboard"
        subtitulo="Manual operativo: cómo leer la información del dashboard para diagnosticar fallas y decidir mantenimiento."
        tag="Manual de soporte"
      />

      <PageHeader titulo="Variables clave y sus rangos" subtitulo="Cuatro métricas determinan el diagnóstico. Cada una tiene un rango semáforo." />
      <div className="grid-2">
        <Card titulo="RSSI · Fuerza de señal WiFi">
          <p>Indicador en dBm. Valor negativo: más cercano a 0 = mejor señal.</p>
          <TableWrap>
            <tbody>
              <tr><td style={{ width: '40%' }}><Pill tipo="ok">≥ -50 dBm</Pill></td><td>Excelente</td></tr>
              <tr><td><Pill tipo="c">-50 a -65 dBm</Pill></td><td>Muy buena</td></tr>
              <tr><td><Pill tipo="a">-65 a -75 dBm</Pill></td><td>Aceptable</td></tr>
              <tr><td><Pill tipo="r">-75 a -85 dBm</Pill></td><td>Débil</td></tr>
              <tr><td><Pill tipo="r">&lt; -85 dBm</Pill></td><td>Crítica</td></tr>
            </tbody>
          </TableWrap>
        </Card>
        <Card titulo="Calidad · Porcentaje de señal">
          <p>Conversión del RSSI a 0–100%. Para lectura rápida de no-técnicos.</p>
          <TableWrap>
            <tbody>
              <tr><td style={{ width: '40%' }}><Pill tipo="ok">≥ 80%</Pill></td><td>Excelente · Muy buena</td></tr>
              <tr><td><Pill tipo="c">60 – 80%</Pill></td><td>Aceptable</td></tr>
              <tr><td><Pill tipo="a">40 – 60%</Pill></td><td>Débil</td></tr>
              <tr><td><Pill tipo="r">&lt; 40%</Pill></td><td>Crítica</td></tr>
            </tbody>
          </TableWrap>
        </Card>
        <Card titulo="GW Ping · Latencia al gateway">
          <p>Diagnostica el tramo <strong>WiFi local</strong> (nodo ↔ router).</p>
          <TableWrap>
            <tbody>
              <tr><td style={{ width: '40%' }}><Pill tipo="ok">&lt; 10 ms</Pill></td><td>Óptimo</td></tr>
              <tr><td><Pill tipo="c">10 – 50 ms</Pill></td><td>Normal</td></tr>
              <tr><td><Pill tipo="a">50 – 100 ms</Pill></td><td>Lento (WiFi cargado)</td></tr>
              <tr><td><Pill tipo="r">&gt; 100 ms o sin respuesta</Pill></td><td>WiFi inestable</td></tr>
            </tbody>
          </TableWrap>
        </Card>
        <Card titulo="INET Ping · Latencia a internet">
          <p>Diagnostica la <strong>salida a internet</strong> (Starlink/ISP).</p>
          <TableWrap>
            <tbody>
              <tr><td style={{ width: '40%' }}><Pill tipo="ok">&lt; 50 ms</Pill></td><td>Óptimo</td></tr>
              <tr><td><Pill tipo="c">50 – 150 ms</Pill></td><td>Normal (Starlink típico)</td></tr>
              <tr><td><Pill tipo="a">150 – 300 ms</Pill></td><td>Lento (degradación)</td></tr>
              <tr><td><Pill tipo="r">&gt; 300 ms o sin respuesta</Pill></td><td>ISP caído / saturado</td></tr>
            </tbody>
          </TableWrap>
        </Card>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Diagnóstico cruzado: GW × INET"
          subtitulo='La combinación de los dos ping permite separar "falla WiFi local" de "falla Starlink/ISP". Es la decisión más importante del diagnóstico.'
        />
        <TableWrap>
          <thead>
            <tr>
              <th style={{ width: '18%' }}>GW Ping</th>
              <th style={{ width: '18%' }}>INET Ping</th>
              <th>Interpretación</th>
              <th style={{ width: '24%' }}>Causa probable</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><Pill tipo="ok">OK</Pill></td><td><Pill tipo="ok">OK</Pill></td><td>Operación normal.</td><td>—</td></tr>
            <tr><td><Pill tipo="ok">OK</Pill></td><td><Pill tipo="r">Alto / pérdida</Pill></td><td>WiFi funcionando, pero <strong>internet no responde</strong>.</td><td>Falla Starlink o ISP de salida.</td></tr>
            <tr><td><Pill tipo="r">Alto / pérdida</Pill></td><td><Pill tipo="ok">OK</Pill></td><td>Router <strong>filtra ICMP</strong>, internet sí responde.</td><td>Informativo. No es falla real.</td></tr>
            <tr><td><Pill tipo="r">Alto</Pill></td><td><Pill tipo="r">Alto</Pill></td><td><strong>WiFi local degradado</strong>.</td><td>Interferencia, canal saturado, distancia.</td></tr>
            <tr><td><Pill tipo="r">Sin respuesta</Pill></td><td><Pill tipo="r">Sin respuesta</Pill></td><td><strong>Corte general</strong>.</td><td>Energía, router caído, dispositivo desenchufado.</td></tr>
          </tbody>
        </TableWrap>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Casos visibles en el dashboard · Acción y responsable"
          subtitulo="Catálogo de 16 escenarios reconocibles y la acción operativa correspondiente."
        />
        <TableWrap>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '28%' }}>Lo que ves en el dashboard</th>
              <th style={{ width: '24%' }}>Significa</th>
              <th>Acción inmediata</th>
              <th style={{ width: '14%' }}>Responsable</th>
              <th style={{ width: '8%' }}>Plazo</th>
            </tr>
          </thead>
          <tbody>
            {CASOS.map((c, i) => (
              <tr key={i}>
                {c.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader titulo="Rutinas de uso del dashboard" subtitulo="Tres flujos típicos: revisión diaria, atención de incidencia, análisis profundo." />
        <div className="grid-3">
          <Card titulo="1 · Revisión diaria (mañana y tarde)">
            <ul>
              <li>Abrir <code>/esp32</code>.</li>
              <li>Revisar <strong>mapa</strong>: contar puntos rojos.</li>
              <li>Cruzar con lista de "Dispositivos registrados".</li>
              <li>Para cada nodo caído → activar flujo de desconexión.</li>
              <li>Registrar conteo en checklist diario.</li>
            </ul>
            <Callout tipo="info" titulo="Frecuencia">08:30 y 16:00, días hábiles.</Callout>
          </Card>
          <Card titulo="2 · Atención de incidencia">
            <ul>
              <li>Clic en <strong>"Métricas"</strong> del nodo afectado.</li>
              <li>Mirar <strong>Conectividad en el tiempo</strong>.</li>
              <li>Usar matriz GW × INET para identificar tipo de falla.</li>
              <li>Mirar <strong>Resumen diario</strong> para detectar patrones.</li>
              <li>Aplicar caso correspondiente de la tabla anterior.</li>
            </ul>
            <Callout tipo="info" titulo="Cuándo">Al detectar caída o recibir reporte del Jefe de Obra.</Callout>
          </Card>
          <Card titulo="3 · Análisis preventivo (semanal)">
            <ul>
              <li>Para cada obra, abrir métricas de un nodo representativo.</li>
              <li>Revisar tendencia semanal de RSSI: ¿está bajando?</li>
              <li>Revisar reconexiones acumuladas: ¿hay días con &gt; 5?</li>
              <li>Comparar muestras esperadas vs. recibidas.</li>
              <li>Identificar nodos candidatos a mantenimiento preventivo.</li>
            </ul>
            <Callout tipo="info" titulo="Frecuencia">Lunes de cada semana.</Callout>
          </Card>
        </div>
      </div>

      <Callout tipo="warn" titulo="Documentar siempre">
        Toda observación, hipótesis y acción derivada del dashboard debe quedar registrada en la plataforma de gestión de proyectos, asociada al nodo y la obra. Sin registro no hay trazabilidad para análisis posterior ni para auditoría mensual de KPI.
      </Callout>

      <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-3)' }}>
        Esta sección responde <strong>"qué está pasando"</strong>. Para <strong>"cómo intervenir"</strong> (reinicios, cambios de configuración, hotspot remoto): ver sección <strong>Soporte remoto</strong>.
        Para acciones reactivas frente a fallas operativas: ver <strong>Mantenimiento correctivo</strong>.
      </p>
    </>
  );
}
