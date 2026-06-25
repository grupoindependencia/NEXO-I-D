import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap } from '@/components/ui/Table';

export function DocsSection() {
  return (
    <>
      <PageHeader
        titulo="Documentación técnica"
        subtitulo="Referencia técnica, firmwares y manuales rápidos para ingenieros de soporte."
        tag="Referencia"
      />

      <div className="grid-2">
        <Card titulo="Equipos actuales en uso">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.85 }}>
            <li>Starlink Standard Kit (firmware auto-actualizado por Starlink)</li>
            <li>Starlink Mini Kit (firmware auto-actualizado por Starlink)</li>
            <li>Módem BAM (modelo según proveedor y cobertura en obra)</li>
            <li>Router TP-Link Archer (o similar con puerto WAN)</li>
            <li>Switch PoE 8 puertos</li>
            <li>Repetidores WiFi (mesh o standalone según layout)</li>
            <li>UPS CyberPower o APC con AVR</li>
          </ul>
        </Card>

        <Card titulo="Accesos de administración">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.85 }}>
            <li>
              <strong>Router admin</strong> → <code>192.168.1.1</code> (usuario: <code>admin</code>)
            </li>
            <li>
              <strong>App Starlink</strong> → disponible en iOS y Android
            </li>
            <li>
              <strong>Plataforma institucional</strong> →{' '}
              <code>comunicacionesti.cindependencia.cl</code>
            </li>
            <li>
              <strong>Speedtest</strong> → fast.com / speedtest.net
            </li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 40 }}>
        <PageHeader
          titulo="Firmwares y actualizaciones"
          subtitulo="Política de actualización para los equipos del proyecto."
        />

        <div className="grid-2">
          <Card titulo="Starlink (antena + router)">
            <p>
              El firmware es gestionado automáticamente por Starlink. No se requieren actualizaciones manuales.
              Revisar ocasionalmente la app Starlink para confirmar que el equipo está en el firmware vigente.
            </p>
            <p style={{ marginTop: 10, fontSize: 12.5, color: 'var(--ink-3)' }}>
              No interrumpir la energía durante un ciclo de actualización — el LED de la antena parpadea en blanco
              mientras actualiza.
            </p>
          </Card>

          <Card titulo="Router / Switch / Repetidores">
            <p>
              Revisar disponibilidad de actualizaciones de firmware en cada mantenimiento preventivo programado.
              Acceder vía la interfaz de administración del equipo.
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>Actualizar solo fuera del horario de uso de la obra.</li>
              <li>Documentar la versión de firmware antes y después de la actualización.</li>
              <li>Reiniciar el equipo tras la actualización y verificar conectividad.</li>
            </ul>
          </Card>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <PageHeader
          titulo="Síntomas comunes y primera acción"
          subtitulo="Referencia rápida para diagnóstico inicial en terreno o soporte remoto."
        />
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Síntoma</th>
                <th>Causa probable</th>
                <th>Primera acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Internet lento</td>
                <td>Saturación de usuarios</td>
                <td>Revisar número de dispositivos conectados; reiniciar el router.</td>
              </tr>
              <tr>
                <td>Sin internet (Starlink)</td>
                <td>Obstrucción o tormenta</td>
                <td>Esperar 10–15 min; revisar la app Starlink; verificar fuente de energía.</td>
              </tr>
              <tr>
                <td>Sin internet (BAM)</td>
                <td>Sin señal celular</td>
                <td>Verificar cobertura; reubicar el modem; contactar al operador.</td>
              </tr>
              <tr>
                <td>WiFi presente pero lento</td>
                <td>Repetidor congestionado</td>
                <td>Reiniciar el repetidor; verificar su posición respecto al router.</td>
              </tr>
              <tr>
                <td>UPS pitando</td>
                <td>Batería baja o falla de red</td>
                <td>Verificar alimentación eléctrica; si persiste, reemplazar la batería.</td>
              </tr>
              <tr>
                <td>Router sin luces</td>
                <td>Sin alimentación</td>
                <td>Verificar cable de poder y estado de la UPS.</td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
      </div>

      <Callout tipo="info" titulo="Actualización de esta documentación">
        Esta sección es mantenida por el jefe del departamento I+D Hardware. Cualquier cambio en los equipos estándar
        del proyecto requiere actualizar tanto esta sección como la sección de{' '}
        <strong>Materiales</strong> para que ambas queden sincronizadas.
      </Callout>
    </>
  );
}
