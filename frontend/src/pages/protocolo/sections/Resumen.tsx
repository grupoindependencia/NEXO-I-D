import { Compass, Wifi } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';

export function ResumenSection() {
  return (
    <>
      <PageHeader
        titulo="Protocolo de Internet en Obra"
        subtitulo="Instalación y gestión de conectividad a internet (BAM o Starlink) en obras de Constructora Independencia."
        tag="Visión general"
      />

      <Callout tipo="info" titulo="Tecnología según cobertura del sitio">
        La tecnología de enlace se selecciona en función de la cobertura disponible en la obra.{' '}
        <strong>BAM (banda ancha móvil)</strong> se utiliza cuando existe buena cobertura de red celular en el sitio.{' '}
        <strong>Starlink</strong> se utiliza en obras remotas o con cobertura móvil insuficiente. El resto del protocolo
        (red local, distribución, soporte) es común a ambas tecnologías.
      </Callout>

      <div className="grid-2">
        <Card titulo="Enlace de datos · BAM o Starlink" icon={<Compass size={16} />}>
          <p>
            El enlace a internet puede provenir de dos fuentes, según las condiciones del sitio:
          </p>
          <ul>
            <li>
              <strong>BAM:</strong> módem SIM con plan de datos corporativo. Se usa cuando la obra tiene buena
              cobertura celular (3G/4G/LTE). Instalación más simple y menor costo.
            </li>
            <li>
              <strong>Starlink:</strong> antena satelital (Estándar o Mini) con su router. Se usa en obras
              remotas o con cobertura móvil insuficiente. Requiere vista despejada al cielo.
            </li>
          </ul>
          <p>
            La decisión de tecnología se toma durante la etapa de evaluación, antes de preparar los equipos.
          </p>
        </Card>

        <Card titulo="Distribución en obra · Red local" icon={<Wifi size={16} />}>
          <p>
            Independientemente del enlace utilizado, la distribución interna de internet en la obra es
            la misma:
          </p>
          <ul>
            <li><strong>Router:</strong> asigna la red local y gestiona el tráfico.</li>
            <li><strong>Switch:</strong> conecta los dispositivos cableados en la obra.</li>
            <li><strong>Repetidores WiFi:</strong> extienden la cobertura a cada oficina o galpón.</li>
            <li><strong>UPS:</strong> protege los equipos de cortes y fluctuaciones de voltaje.</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 32 }}>
        <PageHeader
          titulo="Arquitectura del sistema"
          subtitulo="Del enlace de datos a cada oficina de la obra."
        />
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: 22, overflowX: 'auto' }}>
          <svg viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto', minWidth: 640, maxWidth: '100%' }}>
            {/* Layer label */}
            <text x="20" y="30" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="10.5" letterSpacing="0.6" fill="#7A8580">ARQUITECTURA DE RED EN OBRA</text>

            {/* 1 · BAM / Starlink */}
            <g>
              <rect x="20" y="52" width="190" height="88" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/>
              <text x="115" y="82" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">BAM o Starlink</text>
              <text x="115" y="100" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">Enlace de datos</text>
              <text x="115" y="118" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10.5" fill="#7A8580">Celular o satelital</text>
            </g>
            <line x1="212" y1="96" x2="246" y2="96" stroke="#00684A" strokeWidth="1.2"/>
            <polygon points="246,96 238,92 238,100" fill="#00684A"/>

            {/* 2 · Router */}
            <g>
              <rect x="248" y="52" width="160" height="88" rx="8" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/>
              <text x="328" y="82" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">Router</text>
              <text x="328" y="100" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">Red local · DHCP</text>
              <text x="328" y="118" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10.5" fill="#7A8580">Gestión de tráfico</text>
            </g>
            <line x1="410" y1="96" x2="444" y2="96" stroke="#00684A" strokeWidth="1.2"/>
            <polygon points="444,96 436,92 436,100" fill="#00684A"/>

            {/* 3 · Switch */}
            <g>
              <rect x="446" y="52" width="160" height="88" rx="8" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/>
              <text x="526" y="82" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">Switch</text>
              <text x="526" y="100" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#4A5550">Distribución cableada</text>
              <text x="526" y="118" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10.5" fill="#7A8580">Conexión entre equipos</text>
            </g>
            <line x1="608" y1="96" x2="642" y2="96" stroke="#00684A" strokeWidth="1.2"/>
            <polygon points="642,96 634,92 634,100" fill="#00684A"/>

            {/* 4 · Red WiFi Obra */}
            <g>
              <rect x="644" y="52" width="236" height="88" rx="8" fill="#00684A" stroke="#00513B" strokeWidth="1.2"/>
              <text x="762" y="82" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#fff">Red WiFi Obra</text>
              <text x="762" y="100" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="#D5E4DC">Repetidores por oficina</text>
              <text x="762" y="118" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10.5" fill="#A8C8B8">Cobertura en cada galpón</text>
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
