import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';
import { TableWrap } from '@/components/ui/Table';

const ROWS = [
  ['Nodo desconectado > 1 h',                              'WiFi caída en obra, corte de luz o dispositivo desconectado físicamente.', 'Llamar a Jefe de Obra para verificar luz, router/Starlink y estado físico del nodo.', 'Visita a terreno.'],
  ['RSSI < -78 dBm permanente',                            'Mala ubicación o pérdida de cobertura por cambio en distribución de la obra.', 'Coordinar con jefe de obra para reubicar el dispositivo a un punto con mejor señal.', 'Visita + repetidor WiFi.'],
  ['Pérdida de paquetes > 40% a internet (gateway OK)',    'Falla de ISP o Starlink (no de WiFi local).', 'Verificar estado de Starlink/ISP del enlace. Coordinar con proveedor.', 'Escalar al jefe de comunicaciones.'],
  ['Pérdida de paquetes al gateway > 10%',                 'WiFi inestable: interferencia, canal saturado o cobertura marginal.', 'Revisar canal WiFi, cambiar canal del router si es posible.', 'Reubicar o agregar AP.'],
  ['Reconexiones > 5 por día',                             'Inestabilidad de la red local o de la fuente del nodo.', 'Revisar histórico, identificar patrón horario. Revisar fuente del dispositivo.', 'Reemplazar fuente USB.'],
  ['Sin reportes > 24 h, sin alerta de desconexión',       'Dispositivo congelado o falla de firmware.', 'Coordinar reinicio remoto via dashboard local o reinicio físico.', 'Reflasheo o reemplazo.'],
  ['Dispositivo sin alimentación (apagado)',               'Fuente quemada, cable cortado o tomacorriente sin energía.', 'Validar enchufe con jefe de obra. Probar otra fuente USB si está disponible.', 'Visita con repuestos.'],
  ['Coordenadas no aparecen en mapa',                      'Latitud/Longitud no fueron configuradas o están vacías.', 'Pedir al jefe de obra coordenadas exactas. Reconfigurar desde dashboard local.', 'Visita para reconfigurar.'],
  ['Dispositivo extraviado o robado',                      'Dispositivo movido sin coordinación o sustraído.', 'Confirmar con jefe de obra. Bloquear MAC en backend y abrir incidente.', 'Reposición + investigación.'],
];

export function CorrectivoSection() {
  return (
    <>
      <PageHeader
        titulo="Mantenimiento correctivo"
        subtitulo="Acciones reactivas frente a fallas detectadas. Matriz de síntomas y procedimiento."
        tag="Acción frente a falla"
      />

      <TableWrap>
        <thead>
          <tr>
            <th style={{ width: '22%' }}>Síntoma observado</th>
            <th style={{ width: '24%' }}>Diagnóstico probable</th>
            <th>Acción inicial (remota)</th>
            <th style={{ width: '18%' }}>Si no resuelve</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => <td key={j}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Callout tipo="warn" titulo="Importante">
        Toda visita correctiva en terreno debe ser <em>autorizada</em> por Julio Sepúlveda (Coord. Soporte) y debe quedar registrada con: motivo, fecha, técnico asignado, resultado y costo (si aplica). Sin autorización previa, Rodrigo Rojas no se desplaza.
      </Callout>

      <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-3)' }}>
        Para identificar la causa raíz desde el dashboard antes de actuar: ver sección <strong>Diagnóstico</strong> (matriz cruzada GW × INET y 16 casos típicos).
        Para acciones específicas que se pueden hacer sin ir a terreno: ver sección <strong>Soporte remoto</strong>.
        El flujo formal cuando un nodo deja de reportar está en sección <strong>Flujo desconexión</strong>.
      </p>
    </>
  );
}
