import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';

export function UsoSection() {
  return (
    <>
      <PageHeader
        titulo="Uso en obra (operación cotidiana)"
        subtitulo="Lo que el equipo en obra debe saber sobre el dispositivo. Sencillo y directo."
        tag="Usuarios finales"
      />

      <div className="grid-2">
        <Card titulo="Qué sí hacer">
          <ul>
            <li>Dejarlo conectado siempre, 24/7.</li>
            <li>Mantenerlo en su ubicación original.</li>
            <li>Verificar de vez en cuando que el LED esté verde o amarillo.</li>
            <li>Avisar a tu Jefe de Obra si notas que el LED está rojo de forma permanente.</li>
            <li>Avisar a tu Jefe de Obra si el dispositivo está apagado (sin LEDs).</li>
          </ul>
        </Card>
        <Card titulo="Qué no hacer">
          <ul>
            <li><strong>No desconectar</strong> el dispositivo de la corriente.</li>
            <li><strong>No moverlo</strong> de su ubicación sin coordinar con el equipo de soporte.</li>
            <li><strong>No abrirlo</strong> ni desarmarlo.</li>
            <li><strong>No usar la fuente</strong> para cargar otros equipos (celulares, etc.).</li>
            <li><strong>No presionar</strong> los botones del dispositivo, salvo instrucción del soporte técnico.</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Lectura de los LEDs"
          subtitulo="Los tres LEDs son tu indicador visual inmediato de cómo está la señal WiFi en tu oficina."
        />
        <TableWrap>
          <thead><tr><th>LED encendido</th><th>Significado</th><th>Acción</th></tr></thead>
          <tbody>
            <tr><td><Pill tipo="ok">Verde</Pill></td><td>Señal excelente. Internet funcionando normalmente.</td><td>Ninguna. Todo está bien.</td></tr>
            <tr><td><Pill tipo="a">Amarillo</Pill></td><td>Señal aceptable pero débil. Internet podría experimentar lentitud puntual.</td><td>Si persiste y notas lentitud, avisar a Jefe de Obra para evaluar reubicación.</td></tr>
            <tr><td><Pill tipo="r">Rojo</Pill></td><td>Señal crítica o WiFi caída. Probable falla de cobertura, router o Starlink.</td><td>Avisar a Jefe de Obra de inmediato. El equipo de soporte ya tiene la alerta en su dashboard.</td></tr>
            <tr><td><Pill tipo="i">Apagado</Pill></td><td>Sin energía. Cable desconectado o falla de la fuente.</td><td>Verificar enchufe. Si está enchufado y sigue apagado, avisar a Jefe de Obra.</td></tr>
          </tbody>
        </TableWrap>

        <Callout tipo="ok" titulo="Recuerda">
          Cuando un dispositivo está en rojo o apagado, Oficina Central ya está al tanto en cuestión de minutos. Tu reporte solo acelera la solución; no es necesario que llames de urgencia salvo que la falla afecte tu trabajo de forma crítica.
        </Callout>
      </div>
    </>
  );
}
