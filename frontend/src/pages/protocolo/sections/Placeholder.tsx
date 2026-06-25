import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';

interface PlaceholderProps {
  titulo: string;
  proyecto?: string;
  enPreparacion?: boolean;
}

export function PlaceholderSection({ titulo, proyecto, enPreparacion = false }: PlaceholderProps) {
  return (
    <>
      <PageHeader titulo={titulo} tag={enPreparacion ? 'En preparación' : 'Por migrar'} />
      <div className="placeholder">
        <h3>{enPreparacion ? 'Sección en preparación' : 'Contenido por migrar'}</h3>
        <p>
          {enPreparacion
            ? `El protocolo del proyecto ${proyecto} compartirá la misma estructura de 15 secciones que NetSensor. Se completará en próximas iteraciones.`
            : `La sección "${titulo}" será migrada desde el HTML original. El contenido está disponible en D:\\DOCUMENTOS\\INDEPENDENCIA\\PROYECTOS\\CONECTIVIDAD\\protocolo\\protocolo_netsensor.html y será portado a componente React.`}
        </p>
        <Callout tipo="info" titulo="Próximos pasos">
          {enPreparacion
            ? 'Definir contenido en conjunto con el equipo I+D y poblar las secciones desde el seed o desde el panel admin.'
            : 'Migrar el HTML estático a componente React preservando el diseño minimalista verde, los flowcharts SVG y las tablas.'}
        </Callout>
      </div>
    </>
  );
}
