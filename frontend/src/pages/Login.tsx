import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import './Login.css';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: { client_id: string; callback: (r: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const FEATURES = [
  'Gestión y seguimiento de proyectos tecnológicos I+D',
  'Protocolos de instalación, operación y mantención',
  'Historial técnico, mantenciones y órdenes de compra',
  'Reportes por proyecto y asignación de tareas',
];

export function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const loginGoogle = useAuth((s) => s.loginGoogle);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setCargando(true);
    try {
      await login(correo.trim().toLowerCase(), password);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error inesperado');
    } finally { setCargando(false); }
  };

  // Carga Google Identity Services y renderiza el botón "Continuar con Google"
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const init = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          setError(''); setCargando(true);
          try {
            await loginGoogle(resp.credential);
            navigate('/');
          } catch (err) {
            setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión con Google');
          } finally { setCargando(false); }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', width: 360, text: 'continue_with', shape: 'rectangular', locale: 'es',
      });
    };

    if (window.google) { init(); return; }

    const SCRIPT_ID = 'google-gsi';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', init);
    return () => script?.removeEventListener('load', init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-logo-card">
            <img src="/logo-icon.png" alt="Independencia" />
          </div>
          <h1>NEXO<span className="login-brand-accent"> I+D</span></h1>
          <p className="login-sub">Plataforma tecnológica de Investigación y Desarrollo      Constructora Independencia</p>
          <ul className="login-features">
            {FEATURES.map((f) => (
              <li key={f}>
                <span className="login-check"><Check size={14} /></span>
                {f}
              </li>
            ))}
          </ul>
          <div className="login-decor" />
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <h2>Bienvenido</h2>
          <p className="login-form-sub">Ingresa con tu correo y contraseña corporativos.</p>

          <form onSubmit={onSubmit} className="login-form">
            <label>
              Correo corporativo
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="nombre@cindependencia.cl"
                required
                autoFocus
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          {GOOGLE_CLIENT_ID && (
            <>
              <div className="login-divider"><span>o</span></div>
              <div ref={googleBtnRef} className="login-google" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
