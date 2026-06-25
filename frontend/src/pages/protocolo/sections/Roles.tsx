import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import { TableWrap, Pill } from '@/components/ui/Table';

interface PersonaCardProps {
  nombre: string;
  cargo: string;
  descripcion: string;
  items: string[];
}

function PersonaCard({ nombre, cargo, descripcion, items }: PersonaCardProps) {
  return (
    <Card titulo={nombre}>
      <div style={{ fontSize: 12, color: 'var(--green-dark)', fontWeight: 600, marginBottom: 8 }}>{cargo}</div>
      <p>{descripcion}</p>
      <ul>{items.map((i) => <li key={i} dangerouslySetInnerHTML={{ __html: i }} />)}</ul>
    </Card>
  );
}

export function RolesSection() {
  return (
    <>
      <PageHeader
        titulo="Roles y responsabilidades"
        subtitulo="Quién hace qué dentro del ciclo de vida del dispositivo. Modelo RACI por actividad."
        tag="RACI"
      />

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 10 }}>
        Liderazgo · Nivel 1
      </div>
      <div className="grid-2" style={{ marginBottom: 18 }}>
        <PersonaCard
          nombre="Rodrigo Solís"
          cargo="Jefe de Investigación y Desarrollo · Hardware"
          descripcion="Responsable global del proyecto NetSensor. Aprueba despliegues, actualizaciones de firmware, criterios de reemplazo y mejoras de hardware."
          items={[
            'Define roadmap del proyecto y prioridades técnicas.',
            'Autoriza compras, reposición y actualizaciones.',
            'Revisa KPI mensual del sistema.',
            'Lidera el área de I+D y desarrollo de hardware.',
          ]}
        />
        <PersonaCard
          nombre="Julio Sepúlveda"
          cargo="Jefe de Servicios y Capacitación · Coordinador de Soporte y Equipos"
          descripcion="Lidera la operación de soporte y la gestión del parque tecnológico. Supervisa el monitoreo diario, coordina respuesta a incidencias y planifica visitas a terreno."
          items={[
            'Coordinación general del área de soporte técnico.',
            'Supervisión del monitoreo del dashboard.',
            'Aprueba salidas a terreno y asigna técnico.',
            'Reporta estado del parque tecnológico.',
          ]}
        />
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 10 }}>
        Equipo Técnico · Nivel 2
      </div>
      <div className="grid-2" style={{ marginBottom: 18 }}>
        <PersonaCard
          nombre="Rodrigo Rojas"
          cargo="Técnico de Soporte y Mantenimiento"
          descripcion="Ejecuta mantenimiento preventivo y correctivo de los nodos. Atiende incidencias técnicas que requieren intervención presencial o diagnóstico avanzado."
          items={[
            'Mantenimiento preventivo trimestral en obras.',
            'Diagnóstico y reparación de fallas de hardware.',
            'Instalación y reconfiguración de dispositivos.',
            'Registro y seguimiento de tickets de soporte.',
          ]}
        />
        <PersonaCard
          nombre="Axel Muñoz"
          cargo="Técnico de Soporte Integral"
          descripcion="Primera línea de soporte. Vigila el dashboard a diario, detecta nodos desconectados, ejecuta resolución remota y escala cuando corresponde."
          items={[
            'Revisa dashboard 2× al día (mañana y tarde).',
            'Atiende llamadas iniciales con jefes de obra.',
            'Documenta incidentes en la plataforma.',
            'Apoyo transversal en instalación y configuración.',
          ]}
        />
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 10 }}>
        Roles Externos al Equipo
      </div>
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <PersonaCard
          nombre="Jefe de Obra / Departamento"
          cargo="Custodio del dispositivo"
          descripcion="Custodio del dispositivo en su obra. Responde llamadas de soporte, verifica estado físico y reporta novedades."
          items={[
            'Asegura que el dispositivo permanezca conectado.',
            'Atiende llamadas del equipo de soporte.',
            'Reporta extravío, daño o reubicación.',
          ]}
        />
        <PersonaCard
          nombre="Trabajador del departamento"
          cargo="Usuario final"
          descripcion="Usuario final. No opera el dispositivo, pero comprende su función y respeta las indicaciones del manual."
          items={[
            'No desconecta el dispositivo bajo ningún motivo.',
            'Reporta a su jefe de obra cualquier anomalía visible.',
            'Sabe que el dispositivo está para mejorar su conexión.',
          ]}
        />
        <PersonaCard
          nombre="Proveedor / Compras"
          cargo="Gestión de reposición"
          descripcion="Gestiona reposición de dispositivos y componentes según indicación del Jefe I+D Hardware."
          items={[
            'Mantiene contacto con proveedor de ESP32 y fuentes.',
            'Coordina importación / despacho.',
            'Lleva inventario de repuestos.',
          ]}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Matriz RACI"
          subtitulo="R = Responsable de ejecutar · A = Accountable / Aprobador · C = Consultado · I = Informado"
        />
        <TableWrap>
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Actividad</th>
              <th>R. Solís<br/><span style={{ fontWeight: 400, fontSize: 10, textTransform: 'none', letterSpacing: 0, color: 'var(--ink-3)' }}>Jefe I+D / HW</span></th>
              <th>J. Sepúlveda<br/><span style={{ fontWeight: 400, fontSize: 10, textTransform: 'none', letterSpacing: 0, color: 'var(--ink-3)' }}>Coord. Soporte</span></th>
              <th>A. Muñoz<br/><span style={{ fontWeight: 400, fontSize: 10, textTransform: 'none', letterSpacing: 0, color: 'var(--ink-3)' }}>Téc. Soporte Int.</span></th>
              <th>R. Rojas<br/><span style={{ fontWeight: 400, fontSize: 10, textTransform: 'none', letterSpacing: 0, color: 'var(--ink-3)' }}>Téc. Mant.</span></th>
              <th>Jefe de Obra</th>
              <th>Trabajador</th>
            </tr>
          </thead>
          <tbody>
            <RaciRow act="Instalación inicial del nodo en obra" cells={['I','A','C','R','C','I']} />
            <RaciRow act="Configuración WiFi y coordenadas GPS" cells={['I','C','R','C','I','—']} />
            <RaciRow act="Monitoreo diario del dashboard" cells={['I','A','R','—','—','—']} />
            <RaciRow act="Detección de nodo desconectado" cells={['I','C','R','—','C','—']} />
            <RaciRow act="Diagnóstico remoto y resolución" cells={['C','A','R','C','C','—']} />
            <RaciRow act="Visita a terreno por falla" cells={['I','A','C','R','C','I']} />
            <RaciRow act="Actualización de firmware" cells={['A','C','R','C','I','—']} />
            <RaciRow act="Reemplazo de dispositivo" cells={['A','C','C','R','I','—']} />
            <RaciRow act="Reposición / compra" cells={['A','R','I','—','—','—']} />
            <RaciRow act="Reporte de extravío o daño" cells={['I','A','R','C','R','C']} />
            <RaciRow act="Auditoría mensual de KPI" cells={['A','R','C','I','I','—']} />
          </tbody>
        </TableWrap>
      </div>

      <Callout tipo="info" titulo="Regla de oro">
        Toda acción sobre un nodo (cambio de configuración, visita, reemplazo, actualización) debe quedar registrada en el módulo de gestión de proyectos con el usuario responsable, fecha, motivo y resultado. Sin registro = no se hizo.
      </Callout>

      <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-3)' }}>
        Datos de contacto y canales operativos: ver sección <strong>Contactos</strong>.
      </p>
    </>
  );
}

function RaciRow({ act, cells }: { act: string; cells: string[] }) {
  const pillType = (c: string): 'r' | 'a' | 'c' | 'i' | undefined => {
    if (c.startsWith('R')) return 'r';
    if (c.startsWith('A')) return 'a';
    if (c.startsWith('C')) return 'c';
    if (c.startsWith('I')) return 'i';
    return undefined;
  };
  return (
    <tr>
      <td>{act}</td>
      {cells.map((c, i) => (
        <td key={i}>{c === '—' ? '—' : <Pill tipo={pillType(c)!}>{c}</Pill>}</td>
      ))}
    </tr>
  );
}
