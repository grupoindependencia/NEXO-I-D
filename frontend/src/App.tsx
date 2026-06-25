import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Login } from '@/pages/Login';
import { Hub } from '@/pages/Hub';
import { ProjectLayout } from '@/pages/project/ProjectLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div style={{ padding: 40, color: 'var(--ink-3)' }}>Cargando…</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ProjectRedirect() {
  const { projectId } = useParams<{ projectId: string }>();
  return <Navigate to={`/p/${projectId}/resumen`} replace />;
}

function LegacyRedirect() {
  const { codigo, seccion } = useParams<{ codigo: string; seccion?: string }>();
  // netsensor previously had all sections; map to conectividad for connectivity-specific ones
  const targetProject = codigo === 'netsensor' ? 'netsensor' : codigo;
  return <Navigate to={`/p/${targetProject}/${seccion || 'resumen'}`} replace />;
}

export function App() {
  const inicializar = useAuth((s) => s.inicializar);
  useEffect(() => { inicializar(); }, [inicializar]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Hub — home */}
        <Route path="/" element={<ProtectedRoute><Hub /></ProtectedRoute>} />

        {/* Project pages */}
        <Route path="/p/:projectId" element={<ProjectRedirect />} />
        <Route
          path="/p/:projectId/:section"
          element={<ProtectedRoute><ProjectLayout /></ProtectedRoute>}
        />

        {/* Legacy redirects from old /proyectos/* routes */}
        <Route path="/proyectos/:codigo/:seccion" element={<LegacyRedirect />} />
        <Route path="/proyectos/:codigo" element={<LegacyRedirect />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
