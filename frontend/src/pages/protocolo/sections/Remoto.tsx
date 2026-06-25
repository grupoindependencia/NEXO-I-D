import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';

const ACCIONES = [
  ['Cambiar intervalo de reporte',  'Dashboard local → Editar Configuración → Intervalo', 'Para reducir tráfico o aumentar frecuencia ante diagnóstico activo.', 'c', 'Bajo'],
  ['Cambiar coordenadas GPS',       'Dashboard local → Editar Configuración → Lat / Lon', 'Cuando el dispositivo fue reubicado físicamente.', 'c', 'Bajo'],
  ['Cambiar URL de endpoint API',   'Dashboard local → Editar Configuración → URL del Endpoint', 'Solo si Rodrigo Solís autoriza migración de backend.', 'a', 'Medio'],
  ['Forzar hotspot de configuración', 'Dashboard local → Activar Hotspot', 'Para reconfigurar WiFi desde celular en la obra.', 'a', 'Medio'],
  ['Borrar credenciales WiFi',      'Dashboard local → Borrar WiFi', 'Cuando cambió el WiFi de la obra y el nodo no logra reconectar.', 'r', 'Alto'],
  ['Reinicio remoto del dispositivo', <>Comando <code>restart</code> via dashboard local o serial</>, 'Cuando el nodo está congelado o no reporta.', 'c', 'Bajo'],
  ['Reset total (NVS)',             <>Comando <code>reset</code> via serial</>, 'Última instancia antes de visita; pierde toda configuración.', 'r', 'Alto'],
] as const;

export function RemotoSection() {
  return (
    <>
      <PageHeader
        titulo="Soporte remoto y diagnóstico"
        subtitulo="Cómo intervenir un nodo desde la Oficina Central, sin ir a terreno."
        tag="Diagnóstico"
      />

      <div className="grid-2">
        <Card titulo="Dashboard central">
          <p>Vista única de toda la flota. Acceso desde:</p>
          <p style={{ marginTop: 8, padding: '10px 12px', background: 'var(--green-soft)', borderRadius: 6, fontSize: 12.5 }}>
            <strong style={{ color: 'var(--green-deep)' }}>URL:</strong>{' '}
            <a href="https://comunicacionesti.cindependencia.cl/esp32" style={{ color: 'var(--green-dark)', fontWeight: 500 }}>comunicacionesti.cindependencia.cl/esp32</a>
            <br/>
            <strong style={{ color: 'var(--green-deep)' }}>Ruta:</strong> Menú lateral → <em>Estado de internet</em>
          </p>
          <ul>
            <li>Mapa con ubicación de cada nodo.</li>
            <li>Estado actual: conectado / desconectado / sin GPS.</li>
            <li>Últimas métricas + resumen diario por dispositivo.</li>
            <li>Gráfico de conectividad en el tiempo.</li>
            <li>Acceso al dashboard local del nodo desde "Abrir".</li>
          </ul>
        </Card>
        <Card titulo="Dashboard local del nodo">
          <p>Cada nodo expone un panel web en su IP local (red de la obra). Acceso vía Basic Auth.</p>
          <ul>
            <li>Métricas en vivo: RSSI, IP, gateway, uptime, reconexiones.</li>
            <li>Configuración editable: URL endpoint, intervalo, lat/lon, contraseña API.</li>
            <li>Acciones: activar hotspot de configuración, borrar credenciales WiFi.</li>
            <li>Útil si el equipo de soporte está conectado vía VPN a la obra.</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Acciones remotas disponibles"
          subtitulo="Catálogo de intervenciones posibles sin presencia física."
        />
        <TableWrap>
          <thead><tr><th>Acción</th><th>Cómo se ejecuta</th><th>Cuándo usarla</th><th>Riesgo</th></tr></thead>
          <tbody>
            {ACCIONES.map((a, i) => (
              <tr key={i}>
                <td>{a[0]}</td>
                <td>{a[1]}</td>
                <td>{a[2]}</td>
                <td><Pill tipo={a[3] as any}>{a[4]}</Pill></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <Callout tipo="warn" titulo="Antes de cualquier acción remota">
        Avisar al Jefe de Obra del departamento que el dispositivo podría reiniciarse o cambiar de estado momentáneamente. La conexión WiFi del nodo se interrumpe durante el reinicio (~30 segundos) y no afecta el resto del WiFi de la obra.
      </Callout>

      <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-3)' }}>
        Esta sección responde <strong>"cómo intervenir"</strong>. Para <strong>"qué está pasando"</strong> (lectura de variables, casos del dashboard): ver sección <strong>Diagnóstico</strong>.
      </p>
    </>
  );
}
