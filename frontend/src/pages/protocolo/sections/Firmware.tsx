import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { Step, StepsContainer } from '@/components/ui/Step';

export function FirmwareSection() {
  return (
    <>
      <PageHeader
        titulo="Actualización de firmware"
        subtitulo="Cuándo y cómo actualizar, quién aprueba, qué riesgos asumir."
        tag="Mantención lógica"
      />

      <div className="grid-2">
        <Card titulo="Cuándo actualizar">
          <ul>
            <li>Cuando I+D HW publica un nuevo release estable.</li>
            <li>Cuando se detecta un bug que afecta a múltiples nodos.</li>
            <li>Cuando se agregan métricas nuevas necesarias para reportes.</li>
            <li>Cuando hay un cambio de URL de backend.</li>
            <li>Cuando hay vulnerabilidad de seguridad confirmada.</li>
          </ul>
        </Card>
        <Card titulo="Cuándo no actualizar">
          <ul>
            <li>Cuando el release no fue probado en al menos 3 nodos piloto.</li>
            <li>Cuando hay una obra en hito crítico.</li>
            <li>Cuando Rodrigo Rojas (terreno) no está disponible esa semana.</li>
            <li>En viernes después de mediodía o fines de semana.</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader titulo="Procedimiento de despliegue" subtitulo="Despliegue por etapas controladas para minimizar impacto." />
        <StepsContainer>
          <Step n={1} titulo="Pruebas en banco (I+D HW)"><p>Compilar el firmware en banco, validar funcionamiento contra backend de prueba durante mínimo 48 horas.</p></Step>
          <Step n={2} titulo="Pilotaje en producción"><p>Aplicar el firmware en 3 nodos piloto (idealmente Oficina Central). Esperar 1 semana sin incidencias.</p></Step>
          <Step n={3} titulo="Aprobación formal"><p>Rodrigo Solís firma autorización en plataforma de gestión. Sin esta autorización, no se actualiza el resto de la flota.</p></Step>
          <Step n={4} titulo="Despliegue progresivo"><p>Aplicar firmware al resto de la flota por bloques: obras pequeñas → medianas → críticas. Esperar 48 h entre bloques.</p></Step>
          <Step n={5} titulo="Verificación post-despliegue"><p>Confirmar que todos los nodos actualizados reportan correctamente. Cualquier nodo que falle post-actualización se rollback.</p></Step>
          <Step n={6} titulo="Documentación"><p>Registrar en plataforma: versión, fecha, nodos actualizados, anomalías encontradas y solución aplicada.</p></Step>
        </StepsContainer>
      </div>

      <Callout tipo="crit" titulo="Rollback obligatorio">
        Si más del 10% de los nodos actualizados presenta fallas en las primeras 24 h, se detiene el despliegue, se revierte el firmware en los nodos afectados y se reabre la fase de pruebas.
      </Callout>
    </>
  );
}
