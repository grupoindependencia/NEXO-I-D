import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';

export function InstalacionSection() {
  return (
    <>
      <PageHeader
        titulo="Protocolo de instalación inicial"
        subtitulo="Procedimiento estándar para el primer despliegue de un nodo en una obra nueva."
        tag="Procedimiento"
      />

      <Callout tipo="info" titulo="Antes de partir a terreno">
        Verifica que tengas: dispositivo NetSensor ya flasheado con firmware vigente, fuente de poder USB, cable USB con datos, etiqueta autoadhesiva con MAC visible, y acceso a la red WiFi de la obra (SSID y contraseña entregados por el equipo de soporte).
      </Callout>

      <StepsContainer>
        <Step n={1} titulo="Selección del punto de instalación" meta="Responsable: Rodrigo Rojas · Aprobador: Jefe de Obra">
          <p>El dispositivo debe instalarse en un punto representativo del consumo real de la obra: oficina de jefatura, sala de digitación, adquisiciones o bodega. Evitar instalar dentro de cajas metálicas o detrás de muros gruesos que atenúen la señal WiFi.</p>
        </Step>
        <Step n={2} titulo="Conexión física">
          <p>Conectar la fuente USB al dispositivo y a un tomacorriente <strong>no compartido con maquinaria pesada</strong> (evita ruido eléctrico). Verificar el test de LEDs al arranque: verde → amarillo → rojo → apagados.</p>
        </Step>
        <Step n={3} titulo="Modo portal de configuración">
          <p>Si el dispositivo es nuevo o no tiene WiFi configurado, levantará automáticamente la red <code>NetSensor-Config</code>. Si tiene WiFi anterior y necesitas reconfigurar, presiona el botón <kbd>BOOT</kbd> en el ESP32 hasta que el portal se active.</p>
          <ul>
            <li>SSID del portal: <code>NetSensor-Config</code></li>
            <li>Clave del portal: <code>12345678</code></li>
            <li>IP del portal: <code>http://192.168.4.1</code></li>
          </ul>
        </Step>
        <Step n={4} titulo="Configuración desde tu teléfono">
          <p>Conéctate con tu celular a la red <code>NetSensor-Config</code>. Abre el navegador y entra a <code>http://192.168.4.1</code>. Completa el formulario:</p>
          <ul>
            <li><strong>Escanear redes</strong> y seleccionar la WiFi de la obra.</li>
            <li><strong>Contraseña WiFi</strong> de la obra.</li>
            <li><strong>Contraseña API</strong> (entregada por Rodrigo Solís).</li>
            <li><strong>Latitud y Longitud</strong> de la obra (Google Maps → clic derecho → copiar coordenadas).</li>
            <li>Presionar <strong>Guardar y Conectar</strong>. El dispositivo se reinicia automáticamente.</li>
          </ul>
        </Step>
        <Step n={5} titulo="Verificación de conexión">
          <p>Tras el reinicio, esperar 60 segundos y validar que un LED esté encendido (verde, amarillo o rojo). Si el LED queda <strong>rojo permanentemente</strong>, reubicar el dispositivo a un punto con mejor cobertura.</p>
          <p style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-3)' }}>
            Significado completo de cada color: ver sección <strong>Uso en obra</strong>.
          </p>
        </Step>
        <Step n={6} titulo="Validación con Oficina Central" meta="Confirmación obligatoria antes de salir de la obra">
          <p>Llamar a <strong>Axel Muñoz (Soporte Integral)</strong> y confirmar que el nodo aparece en el dashboard con su MAC correspondiente, en la ubicación correcta del mapa, y reportando métricas. Tiempo máximo esperado: <strong>5 minutos</strong> desde la conexión.</p>
        </Step>
        <Step n={7} titulo="Etiquetado y registro">
          <p>Pegar la etiqueta con la MAC del dispositivo en lugar visible. Pegar adyacente la ficha "Manual usuario". Registrar el nodo en la plataforma de gestión con: MAC, obra, punto de instalación, fecha, responsable de instalación y nombre del jefe de departamento custodio.</p>
        </Step>
        <Step n={8} titulo="Briefing al equipo de la obra" meta="Sin briefing = instalación incompleta">
          <p>Reunir 5 minutos al equipo de la oficina para explicar: qué es el dispositivo, para qué sirve, por qué <strong>no debe desconectarse</strong>, y a quién llamar si presenta una anomalía. Entregar copia impresa del manual de usuario al jefe de departamento.</p>
        </Step>
      </StepsContainer>
    </>
  );
}
