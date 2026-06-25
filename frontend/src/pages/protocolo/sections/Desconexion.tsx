import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import './FlowChart.css';

export function DesconexionSection() {
  return (
    <>
      <PageHeader
        titulo="Flujo de atención por desconexión"
        subtitulo="Árbol de decisión cuando un nodo deja de reportar al dashboard."
        tag="Flujo"
      />

      <div className="flow-wrap">
        <svg viewBox="0 0 1200 920" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#00684A"/>
            </marker>
          </defs>
          <g><rect x="420" y="20" width="360" height="44" rx="8" fill="#002E22"/><text x="600" y="48" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#fff">Dashboard marca nodo desconectado</text></g>
          <line x1="600" y1="64" x2="600" y2="96" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><rect x="420" y="100" width="360" height="56" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/><text x="600" y="124" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">1 · Axel Muñoz verifica en /esp32</text><text x="600" y="142" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#4A5550">Último reporte · Histórico · Otros nodos de la misma obra</text></g>
          <line x1="600" y1="156" x2="600" y2="190" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><polygon points="600,190 780,250 600,310 420,250" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/><text x="600" y="244" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">¿Otros nodos de la</text><text x="600" y="261" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">misma obra también</text><text x="600" y="278" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">están caídos?</text></g>
          <text x="335" y="244" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="12" fill="#00684A">Sí</text>
          <line x1="420" y1="250" x2="350" y2="250" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="350" y1="250" x2="350" y2="340" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><rect x="170" y="345" width="360" height="72" rx="8" fill="#FBF3DF" stroke="#F0DDA3" strokeWidth="1.2"/><text x="350" y="370" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#6E4E10">2A · Corte general en la obra</text><text x="350" y="390" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#6E4E10">Llamar a Jefe de Obra</text><text x="350" y="408" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#6E4E10">Verificar luz, router, Starlink, ISP</text></g>
          <text x="855" y="244" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="12" fill="#00684A">No</text>
          <line x1="780" y1="250" x2="850" y2="250" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="850" y1="250" x2="850" y2="340" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><rect x="670" y="345" width="360" height="72" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/><text x="850" y="370" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">2B · Nodo aislado</text><text x="850" y="390" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#4A5550">Llamar a Jefe de Obra del departamento</text><text x="850" y="408" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#4A5550">Confirmar estado físico, LEDs, enchufe</text></g>
          <line x1="350" y1="417" x2="350" y2="460" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="850" y1="417" x2="850" y2="460" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="350" y1="460" x2="600" y2="460" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="850" y1="460" x2="600" y2="460" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="600" y1="460" x2="600" y2="495" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><polygon points="600,495 800,555 600,615 400,555" fill="#F7F8F7" stroke="#D5E4DC" strokeWidth="1.2"/><text x="600" y="540" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">¿La falla se resuelve</text><text x="600" y="557" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">remotamente</text><text x="600" y="574" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">o por teléfono?</text></g>
          <text x="335" y="553" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="12" fill="#00684A">Sí</text>
          <line x1="400" y1="555" x2="290" y2="555" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="290" y1="555" x2="290" y2="645" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><rect x="110" y="650" width="360" height="64" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/><text x="290" y="675" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">3A · Documentar y cerrar</text><text x="290" y="695" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#4A5550">Registrar causa, tiempo de resolución y aprendizajes</text></g>
          <text x="865" y="553" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="12" fill="#00684A">No</text>
          <line x1="800" y1="555" x2="910" y2="555" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="910" y1="555" x2="910" y2="645" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><rect x="730" y="650" width="360" height="64" rx="8" fill="#F8E5E5" stroke="#ECC1C1" strokeWidth="1.2"/><text x="910" y="675" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#6E2828">3B · Escalar a R. Rojas (Mantenimiento)</text><text x="910" y="695" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#6E2828">J. Sepúlveda autoriza · ticket abierto y agenda</text></g>
          <line x1="910" y1="714" x2="910" y2="755" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><rect x="730" y="760" width="360" height="64" rx="8" fill="#EEF5F1" stroke="#00684A" strokeWidth="1.2"/><text x="910" y="785" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#1A2420">4 · Visita, diagnóstico y reparación</text><text x="910" y="805" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11.5" fill="#4A5550">Cierre del ticket con foto y firma</text></g>
          <line x1="290" y1="714" x2="290" y2="860" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="910" y1="824" x2="910" y2="860" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="290" y1="860" x2="600" y2="860" stroke="#00684A" strokeWidth="1.5"/>
          <line x1="910" y1="860" x2="600" y2="860" stroke="#00684A" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <g><rect x="440" y="868" width="320" height="36" rx="8" fill="#00684A"/><text x="600" y="891" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="13" fill="#fff">Incidente cerrado y documentado</text></g>
        </svg>
        <div className="flow-legend">
          <span className="lk"><span className="sq" style={{ background: '#002E22' }} />Inicio</span>
          <span className="lk"><span className="sq" style={{ background: '#EEF5F1', border: '1px solid #00684A' }} />Acción Soporte Integral</span>
          <span className="lk"><span className="sq" style={{ background: '#FBF3DF', border: '1px solid #F0DDA3' }} />Coordinación con obra</span>
          <span className="lk"><span className="sq" style={{ background: '#F7F8F7', border: '1px solid #D5E4DC' }} />Decisión / Resolución</span>
          <span className="lk"><span className="sq" style={{ background: '#F8E5E5', border: '1px solid #ECC1C1' }} />Escalamiento a terreno</span>
          <span className="lk"><span className="sq" style={{ background: '#00684A' }} />Cierre</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <Card titulo="Tiempos de respuesta (SLA interno)">
          <ul>
            <li><strong>Detección</strong>: ≤ 1 h desde la desconexión real.</li>
            <li><strong>Primer contacto con obra</strong>: ≤ 2 h hábiles tras detección.</li>
            <li><strong>Resolución remota</strong>: ≤ 4 h hábiles tras primer contacto.</li>
            <li><strong>Visita a terreno</strong>: ≤ 72 h hábiles tras escalamiento.</li>
            <li><strong>Cierre documentado</strong>: ≤ 24 h después de resolver.</li>
          </ul>
        </Card>
        <Card titulo="Prioridad por tipo de obra">
          <ul>
            <li><strong>P1 · Oficina Central</strong>: respuesta inmediata, ≤ 2 h.</li>
            <li><strong>P2 · Obra &gt; 5 trabajadores admin.</strong>: 24 h.</li>
            <li><strong>P3 · Obra 1 a 5 trabajadores</strong>: 48 h.</li>
            <li><strong>P4 · Punto secundario</strong>: hasta 1 semana.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
