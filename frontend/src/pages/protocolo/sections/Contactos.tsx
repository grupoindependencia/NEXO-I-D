import { PageHeader } from '@/components/ui/PageHeader';
import { Callout } from '@/components/ui/Card';
import { TableWrap } from '@/components/ui/Table';

const ESCENARIOS = [
  ['Solicitud de internet para una obra',        'Obra → Departamento de Informática',     'Jefe Depto. Servicios y Capacitación (registro)','Ticket + correo'],
  ['Activación de equipo (SN / tipo de kit)',    'Quien recibe el equipo → Servicios y Cap.', 'Jefe Depto. Servicios y Capacitación',         'Correo + plataforma'],
  ['Corte de internet Starlink en obra',         'Jefe de Obra → Axel Muñoz',              'Rodrigo Rojas (visita · autoriza Julio)',      'Llamada · plataforma'],
  ['Antena con obstrucción / reubicación',       'Axel Muñoz',                             'Rodrigo Rojas (terreno)',                      'Plataforma + foto'],
  ['Compra / reposición de equipo Starlink',     'Téc. terreno → Rodrigo Solís / Julio',   'Sucursal Santiago (cotización · 2–3 días háb.)','Cotización · plataforma'],
  ['LED rojo o dispositivo apagado',             'Jefe de Obra o de Departamento',         'Axel Muñoz (Soporte Integral)',                'Llamada · WhatsApp'],
  ['Necesidad de mover el dispositivo de lugar', 'Axel Muñoz',                              'Julio Sepúlveda (Coord. Soporte)',             'Correo · plataforma'],
  ['Dispositivo extraviado / sustraído',         'Jefe de Obra',                            'Julio Sepúlveda + Rodrigo Solís',              'Correo formal + acta'],
  ['Dispositivo dañado físicamente',             'Axel Muñoz',                              'Rodrigo Rojas (Mantenimiento) + Rodrigo Solís', 'Plataforma + foto del daño'],
  ['Cambio de WiFi de la obra',                   'Axel Muñoz (con antelación)',             'Julio Sepúlveda',                              'Correo previo a la fecha'],
  ['Bajón generalizado de internet en obra',     'Axel Muñoz',                              'Proveedor de Starlink / ISP',                  'Llamada · plataforma'],
  ['Solicitud de nuevo nodo en obra',            'Jefe de Obra → Rodrigo Solís',            '—',                                            'Correo + ticket'],
  ['Idea de mejora o feedback',                  'Cualquier usuario → Rodrigo Solís',       '—',                                            'Plataforma · sección comentarios'],
];

const CANALES = [
  ['Rodrigo Solís',    'Jefe I+D · Hardware',                    'rodrigo.solis@cindependencia.cl',     'L-V 09:00–18:30'],
  ['Julio Sepúlveda',  'Coord. Soporte y Equipos',                'julio.sepulveda@cindependencia.cl',   'L-V 08:30–18:00'],
  ['Axel Muñoz',       'Téc. Soporte Integral · Primera línea',   'axel.munoz@cindependencia.cl',        'L-V 08:30–18:00'],
  ['Rodrigo Rojas',    'Téc. Soporte y Mantenimiento · Terreno',  'rodrigo.rojas@cindependencia.cl',     'Visitas coordinadas vía Julio'],
];

export function ContactosSection() {
  return (
    <>
      <PageHeader
        titulo="Contactos y canales"
        subtitulo="A quién contactar según el escenario, y los datos de contacto de cada integrante del equipo."
        tag="Directorio"
      />

      <PageHeader titulo="Por escenario" subtitulo="Tabla rápida para saber a quién recurrir." />
      <TableWrap>
        <thead>
          <tr>
            <th>Escenario</th>
            <th>Primer contacto</th>
            <th>Si no responde / no resuelve</th>
            <th>Canal preferido</th>
          </tr>
        </thead>
        <tbody>
          {ESCENARIOS.map((e, i) => (
            <tr key={i}>{e.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </TableWrap>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Canales operativos del equipo"
          subtitulo="Datos de contacto y ventana de atención. Para responsabilidades detalladas de cada cargo: sección Roles & RACI."
        />
        <TableWrap>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Nombre</th>
              <th style={{ width: '28%' }}>Cargo</th>
              <th style={{ width: '30%' }}>Correo</th>
              <th>Ventana de atención</th>
            </tr>
          </thead>
          <tbody>
            {CANALES.map((c, i) => (
              <tr key={i}>
                <td><strong>{c[0]}</strong></td>
                <td>{c[1]}</td>
                <td><code>{c[2]}</code></td>
                <td>{c[3]}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <Callout tipo="warn" titulo="Importante">
        Los datos de contacto deben mantenerse actualizados en la plataforma de gestión. Cualquier cambio de personal
        debe reflejarse antes de 48 h.
      </Callout>
    </>
  );
}
