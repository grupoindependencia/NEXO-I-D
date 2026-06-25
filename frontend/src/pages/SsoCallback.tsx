import { useEffect } from 'react';

const PORTAL_ORIGIN = 'https://portal.cindependencia.cl';

// Destino del SSO del Portal: GET /api/auth/portal-sso redirige aquí con los
// tokens (at/rt) en la URL. Se guardan en localStorage (mismas claves que el
// login normal) y se vuelve al portal para que cargue el iframe ya autenticado.
export function SsoCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const at = params.get('at');
    const rt = params.get('rt');
    const returnTo = params.get('returnTo') ?? '/';

    if (at) localStorage.setItem('cii_access_token', at);
    if (rt) localStorage.setItem('cii_refresh_token', rt);

    let destino = '/';
    if (returnTo.startsWith('/')) {
      destino = returnTo;
    } else {
      try {
        if (new URL(returnTo).origin === PORTAL_ORIGIN) destino = returnTo;
      } catch {
        /* URL inválida: queda "/" */
      }
    }
    window.location.replace(destino);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>
      Iniciando sesión…
    </div>
  );
}
