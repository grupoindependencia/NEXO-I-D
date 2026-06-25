import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';
import { TableWrap } from '@/components/ui/Table';

const TERMINOS: Array<[string, React.ReactNode]> = [
  ['Starlink Estándar',         'Antena satelital rectangular de mayor tamaño y potencia (~75–100 W). Uno de los dos modelos en uso.'],
  ['Starlink Mini',             'Antena satelital compacta con WiFi integrado y bajo consumo (~25–40 W, DC). Uno de los dos modelos en uso.'],
  ['Soporte base · mástil',     'Soporte institucional (base anclada a estructura + mástil) sobre el que se montan ambos modelos. Reemplaza el montaje sobre techo.'],
  ['Adaptador de tubo',         'Pieza de la antena (Estándar y Mini) que la acopla a un mástil o poste de Ø 31–63,5 mm.'],
  ['Enlace',                    'La conexión a internet provista por la antena Starlink. Es la "capa de enlace" del protocolo.'],
  ['SN · Número de serie',      'Identificador único del equipo Starlink. Es el único identificador del equipo que se registra para su seguimiento.'],
  ['BAM',                       'Banda Ancha Móvil: internet por red celular (módem/router de un operador). Alternativa a Starlink en obras con cobertura móvil.'],
  ['Obstrucción',               'Objeto (árbol, edificio, cableado) que cruza la vista al cielo y corta el enlace satelital. Se verifica con la app.'],
  ['Alineación',                'Orientación (giro e inclinación) de la antena que la app indica para optimizar la recepción.'],
  ['IP67',                      'Certificación de resistencia al agua y polvo de la antena. Se pierde al usar un cable RJ45 estándar en el puerto Ethernet.'],
  ['Switch',                    'Equipo que reparte el internet del router por cable Ethernet hacia varios galpones.'],
  ['Repetidor',                 'Equipo que recibe internet por cable en un galpón y genera su propia red WiFi local.'],
  ['Cámara biométrica',         'Cámara de reconocimiento facial conectada por Ethernet a la antena de acceso, para control de asistencia.'],
  ['Brownout',                  'Caída temporal de voltaje (no un corte total). Frecuente en obras; reinicia routers y daña equipos con el tiempo.'],
  ['UPS',                       'Sistema de alimentación ininterrumpida: batería que sostiene los equipos durante cortes y caídas de voltaje.'],
  ['AVR',                       <>Regulación automática de voltaje de una UPS line-interactive: corrige subidas/caídas de tensión <strong>sin</strong> pasar a batería.</>],
  ['Supresor de transientes',   'Dispositivo (surge protector) que absorbe picos de tensión por maquinaria, rayos o entrada de generador.'],
  ['Puesta a tierra',           'Conexión que descarga estática y sobretensiones a tierra; protege la antena en techos expuestos.'],
  ['USB-C PD',                  <>Power Delivery: estándar de alimentación por USB-C. El Starlink Mini requiere <strong>100 W (20 V·5 A)</strong>; permite respaldo por power bank.</>],
  ['DC5521',                    'Conector de alimentación de la antena Starlink Mini (entrada DC 12–48 V).'],
  ['Ley 21.719',                'Ley chilena de protección de datos personales (vigencia plena 1-dic-2026). Clasifica los datos biométricos como sensibles.'],
  ['Dato sensible',             'Categoría de dato personal de especial protección (p. ej. biométrico, como el rostro). Requiere resguardos reforzados.'],
  ['ESP32',                     'Microcontrolador con WiFi integrado utilizado como base del nodo NetSensor.'],
  ['MAC Address',               'Identificador único de hardware del dispositivo. Es lo que usamos para reconocerlo en el dashboard.'],
  ['RSSI',                      'Indicador de fuerza de señal WiFi medido en dBm. Más cercano a 0 = mejor (ej. -50 es excelente, -80 es débil).'],
  ['Gateway',                   'El router o equipo de salida a internet de la obra (típicamente el modem Starlink).'],
  ['Ping ICMP',                 'Prueba de conectividad que mide cuánto tarda un paquete en ir y volver a un destino.'],
  ['Pérdida de paquetes',       'Porcentaje de paquetes que se envían pero no reciben respuesta.'],
  ['Uptime',                    'Tiempo continuo encendido desde el último reinicio del dispositivo.'],
  ['Reconexiones',              'Cantidad de veces que el dispositivo perdió y recuperó conexión WiFi en el día.'],
  ['Firmware',                  'Software interno del dispositivo. Se actualiza para corregir errores o agregar funciones.'],
  ['Hotspot de configuración',  <>Red WiFi temporal que crea el dispositivo (<code>NetSensor-Config</code>) para configurarlo desde un celular.</>],
  ['Dashboard',                 'Panel web donde se visualiza la información de los nodos. Existen dos: el central (de la flota) y el local (del nodo individual).'],
  ['SLA',                       'Service Level Agreement — compromiso interno de tiempos de respuesta y resolución.'],
  ['NVS',                       'Memoria no volátil del ESP32 donde se almacenan la configuración WiFi y parámetros.'],
  ['Rollback',                  'Reversión a una versión anterior del firmware cuando un nuevo despliegue presenta fallas.'],
  ['Plantilla de checklist',    'Definición reutilizable de una verificación periódica: items, frecuencia y responsable.'],
  ['Ejecución (checklist)',     'Una instancia concreta del checklist en una fecha. Tiene estado: en progreso, completada, revisada o rechazada.'],
  ['Revisión',                  'Validación obligatoria de un supervisor sobre la ejecución completada de un checklist. Sirve como respaldo formal.'],
  ['Tarea recurrente',          'Item del checklist que aparece en cada ejecución periódica (todas las semanas, todos los meses, etc.).'],
  ['Tarea única',               'Item del checklist que aparece solo en la próxima ejecución y luego se archiva automáticamente.'],
  ['RACI',                      <>Matriz de responsabilidades: <strong>R</strong>esponsable de ejecutar · <strong>A</strong>probador (accountable) · <strong>C</strong>onsultado · <strong>I</strong>nformado.</>],
];

export function GlosarioSection() {
  return (
    <>
      <PageHeader
        titulo="Glosario técnico"
        subtitulo="Términos relevantes para comprender el protocolo y comunicarse con el equipo técnico."
        tag="Referencia"
      />

      <TableWrap>
        <thead><tr><th style={{ width: '22%' }}>Término</th><th>Significado</th></tr></thead>
        <tbody>
          {TERMINOS.map(([t, d], i) => (
            <tr key={i}>
              <td><strong>{t}</strong></td>
              <td>{d}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Callout tipo="info" titulo="Versión del documento">
        Protocolo de Conectividad en Obra · Enlace Starlink + Monitoreo NetSensor · v2.0 · Junio 2026 · Constructora Independencia · I+D Hardware<br/>
        Fuente técnica de la capa de enlace: Guía de instalación oficial Starlink Mini.<br/>
        Revisión próxima: Diciembre 2026 · Responsable: Rodrigo Solís
      </Callout>
    </>
  );
}
