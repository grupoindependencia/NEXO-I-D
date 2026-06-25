import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import './Topbar.css';

interface Proyecto {
  proyectoId: number;
  proyectoCodigo: string;
  proyectoNombre: string;
}

export function Topbar() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const activoCodigo = location.pathname.match(/\/proyectos\/([^/]+)/)?.[1] || 'netsensor';
  const seccionActual = location.pathname.match(/\/proyectos\/[^/]+\/([^/]+)/)?.[1] || 'resumen';

  useEffect(() => {
    api.get<Proyecto[]>('/api/proyectos').then(setProyectos).catch(() => {});
  }, []);

  return (
    <header className="topbar">
      <div className="top-label">Protocolos</div>
      <div className="project-chips">
        {proyectos.map((p) => (
          <button
            key={p.proyectoCodigo}
            className={`chip ${activoCodigo === p.proyectoCodigo ? 'active' : ''}`}
            onClick={() => navigate(`/proyectos/${p.proyectoCodigo}/${seccionActual}`)}
          >
            {p.proyectoNombre}
          </button>
        ))}
      </div>
      <div className="top-meta">v1.0 · {new Date().toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}</div>
    </header>
  );
}
