import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import './Login.css';

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
        </div>
      </div>
    </div>
  );
}
