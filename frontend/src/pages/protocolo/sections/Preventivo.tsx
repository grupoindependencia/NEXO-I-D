import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';

const ROWS: Array<{ frec: 'Diaria'|'Semanal'|'Mensual'|'Trimestral'|'Anual'; act: string; resp: string; salida: string }> = [
  { frec: 'Diaria',     act: 'Revisión rápida del dashboard: conteo de nodos activos, conectados, con GPS, alertas de desconexión.', resp: 'A. Muñoz',            salida: 'Reporte breve en checklist diario.' },
  { frec: 'Diaria',     act: 'Atender desconexiones detectadas (ver pestaña Flujo desconexión).',                                    resp: 'A. Muñoz',            salida: 'Cada nodo en alerta → ticket abierto.' },
  { frec: 'Semanal',    act: 'Revisión de calidad promedio (RSSI semanal, reconexiones, % nodos con problemas).',                    resp: 'A. Muñoz · J. Sepúlveda', salida: 'Informe semanal en plataforma.' },
  { frec: 'Semanal',    act: 'Verificación de nodos sin reporte en últimas 72 h (candidatos a falla silenciosa).',                   resp: 'A. Muñoz',            salida: 'Lista priorizada de visitas.' },
  { frec: 'Mensual',    act: 'Auditoría del inventario: MAC en plataforma vs. MAC reportando.',                                       resp: 'J. Sepúlveda',        salida: 'Reporte de discrepancias.' },
  { frec: 'Mensual',    act: 'Revisión de KPI: % uptime de la flota, peor RSSI promedio, obras con más incidencias.',                resp: 'R. Solís · J. Sepúlveda', salida: 'KPI publicado, decisiones de mejora.' },
  { frec: 'Mensual',    act: 'Evaluar necesidad de actualización de firmware.',                                                       resp: 'R. Solís',            salida: 'Decisión documentada.' },
  { frec: 'Trimestral', act: 'Revisión física de nodos críticos en obras grandes: cable, fuente, fijación, suciedad.',               resp: 'R. Rojas',            salida: 'Checklist físico firmado.' },
  { frec: 'Trimestral', act: 'Verificación de stock de repuestos (dispositivos, fuentes, cables, etiquetas).',                       resp: 'R. Rojas · Compras',  salida: 'Reposición si stock < 20%.' },
  { frec: 'Anual',      act: 'Auditoría general del proyecto: documentación, contraseñas, certificados, vigencia.',                  resp: 'R. Solís',            salida: 'Plan de renovación del año.' },
  { frec: 'Anual',      act: 'Evaluación de vida útil del hardware (>3 años → considerar reemplazo).',                                resp: 'R. Solís',            salida: 'Lista de reemplazos.' },
];

const FREC_TIPO: Record<string, 'c'|'i'|'a'|'r'> = { 'Diaria': 'c', 'Semanal': 'i', 'Mensual': 'a', 'Trimestral': 'r', 'Anual': 'r' };

export function PreventivoSection() {
  return (
    <>
      <PageHeader
        titulo="Mantenimiento preventivo"
        subtitulo="Calendario de actividades planificadas para mantener la flota de nodos en óptimas condiciones."
        tag="Cronograma"
      />

      <TableWrap>
        <thead>
          <tr>
            <th style={{ width: '14%' }}>Frecuencia</th>
            <th>Actividad</th>
            <th>Responsable</th>
            <th>Salida esperada</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i}>
              <td><Pill tipo={FREC_TIPO[r.frec]}>{r.frec}</Pill></td>
              <td>{r.act}</td>
              <td>{r.resp}</td>
              <td>{r.salida}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Callout tipo="info" titulo="Checklists ejecutables">
        Las actividades de esta tabla se materializan como <strong>checklists con respaldo formal</strong> en la sección
        <strong> Checklists</strong> del sidebar. Cada uno se ejecuta por el responsable, se completa item por item, y luego
        es revisado por el supervisor designado.
      </Callout>
    </>
  );
}
