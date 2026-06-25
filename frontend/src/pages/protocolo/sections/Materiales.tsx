import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';

export function MaterialesSection() {
  return (
    <div>
      <PageHeader
        titulo="Materiales y equipos"
        subtitulo="Listado de equipos, materiales y herramientas por tipo de instalación."
        tag="Preparación"
      />

      <Callout tipo="info" titulo="Selección previa requerida">
        El listado de equipos depende de la tecnología elegida (BAM o Starlink). La decisión se
        toma durante la etapa de evaluación del sitio, según cobertura móvil disponible.
      </Callout>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <Card titulo="Opción A · Starlink">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Antena Starlink (kit Standard o Mini)</li>
            <li>Mástil / soporte de montaje</li>
            <li>Cable de la antena (incluido en el kit, ~15 m)</li>
            <li>Router Starlink (incluido en el kit)</li>
            <li>Switch PoE 8 puertos</li>
            <li>Repetidores WiFi (según número de oficinas)</li>
            <li>Cable Cat6 (metros según layout del sitio)</li>
            <li>UPS con AVR (protección de router y switch)</li>
            <li>Herramientas de montaje: llave hexagonal del kit, taladro, fijaciones</li>
          </ul>
        </Card>

        <Card titulo="Opción B · BAM">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Módem BAM (banda ancha móvil)</li>
            <li>SIM card activa (operador según cobertura en obra)</li>
            <li>Antena externa opcional (si señal es débil)</li>
            <li>Router con puerto WAN</li>
            <li>Switch PoE 8 puertos</li>
            <li>Repetidores WiFi (según número de oficinas)</li>
            <li>Cable Cat6 (metros según layout del sitio)</li>
            <li>UPS con AVR (protección de equipos activos)</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Materiales comunes (ambas opciones)</h3>
        <TableWrap>
          <thead>
            <tr>
              <th style={{ width: '34%' }}>Ítem</th>
              <th style={{ width: '16%' }}>Cantidad</th>
              <th style={{ width: '14%' }}>Prioridad</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            {/* ── Red activa ── */}
            <tr>
              <td colSpan={4} style={{ background: 'var(--line-2)', padding: '6px 14px', fontWeight: 700, fontSize: 11, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--ink-2)', borderBottom: '1px solid var(--line)' }}>
                Red activa
              </td>
            </tr>
            <tr>
              <td><strong>Switch PoE 8 puertos</strong></td>
              <td>1</td>
              <td><Pill tipo="r">Crítico</Pill></td>
              <td>Administrable preferido; distribuye energía a APs por PoE</td>
            </tr>
            <tr>
              <td><strong>Repetidores WiFi</strong></td>
              <td>1 por galpón / oficina</td>
              <td><Pill tipo="a">Recomendado</Pill></td>
              <td>Cantidad según layout del sitio y cobertura requerida</td>
            </tr>

            {/* ── Cableado ── */}
            <tr>
              <td colSpan={4} style={{ background: 'var(--line-2)', padding: '6px 14px', fontWeight: 700, fontSize: 11, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--ink-2)', borderBottom: '1px solid var(--line)' }}>
                Cableado
              </td>
            </tr>
            <tr>
              <td><strong>Cable UTP Cat6</strong></td>
              <td>Variable</td>
              <td><Pill tipo="r">Crítico</Pill></td>
              <td>Calcular según distancias del sitio — máx. 100 m por tramo</td>
            </tr>
            <tr>
              <td><strong>Patch cables Cat6</strong></td>
              <td>4 – 6</td>
              <td><Pill tipo="r">Crítico</Pill></td>
              <td>Conexiones entre equipos activos (switch, router, APs)</td>
            </tr>

            {/* ── Protección eléctrica ── */}
            <tr>
              <td colSpan={4} style={{ background: 'var(--line-2)', padding: '6px 14px', fontWeight: 700, fontSize: 11, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--ink-2)', borderBottom: '1px solid var(--line)' }}>
                Protección eléctrica
              </td>
            </tr>
            <tr>
              <td><strong>UPS con AVR</strong></td>
              <td>1</td>
              <td><Pill tipo="r">Crítico</Pill></td>
              <td>Protege router y switch de cortes y transientes de voltaje en obra</td>
            </tr>

            {/* ── Sujeción e instalación ── */}
            <tr>
              <td colSpan={4} style={{ background: 'var(--line-2)', padding: '6px 14px', fontWeight: 700, fontSize: 11, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--ink-2)', borderBottom: '1px solid var(--line)' }}>
                Sujeción e instalación
              </td>
            </tr>
            <tr>
              <td><strong>Bridas y sujetacables</strong></td>
              <td>20+</td>
              <td><Pill tipo="a">Recomendado</Pill></td>
              <td>Orden y fijación del tendido de cable</td>
            </tr>
            <tr>
              <td><strong>Cinta autofusionante</strong></td>
              <td>1 rollo</td>
              <td><Pill tipo="a">Recomendado</Pill></td>
              <td>Sellar entrada del cable de antena al interior</td>
            </tr>
            <tr>
              <td><strong>Tacos y tornillos</strong></td>
              <td>Variable</td>
              <td><Pill tipo="i">Opcional</Pill></td>
              <td>Fijar canaletas y soportes según estructura del sitio</td>
            </tr>
          </tbody>
        </TableWrap>
      </div>

      <div style={{ marginTop: 40 }}>
        <PageHeader
          titulo="Herramientas"
          subtitulo="Kit mínimo para cada salida a terreno."
        />

        <div className="grid-2" style={{ marginTop: 16 }}>
          <Card titulo="Eléctricas y montaje">
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>Taladro inalámbrico</li>
              <li>Broca para hormigón</li>
              <li>Llave hexagonal (incluida en kit Starlink)</li>
              <li>Destornilladores Phillips y plano</li>
              <li>Escalera tijera o extensible (según altura de montaje)</li>
            </ul>
          </Card>

          <Card titulo="Red y verificación">
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>Laptop con acceso a las herramientas de diagnóstico</li>
              <li>Cable Ethernet directo (para pruebas)</li>
              <li>Testador de cable RJ45</li>
              <li>Aplicación Starlink (si aplica)</li>
              <li>Apps de speedtest y WiFi analyzer</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
