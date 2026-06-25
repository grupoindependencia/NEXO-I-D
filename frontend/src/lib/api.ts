// ============================================================
// Cliente HTTP minimalista con manejo de JWT
// ============================================================

// ?? en lugar de || para que VITE_API_URL="" (proxy nginx) no caiga al fallback
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

class ApiClient {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('cii_access_token');
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) localStorage.setItem('cii_access_token', token);
    else localStorage.removeItem('cii_access_token');
  }

  getAccessToken() { return this.accessToken; }

  async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };
    if (this.accessToken) headers.Authorization = `Bearer ${this.accessToken}`;

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 401) {
      // Token expirado: intentar refresh
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        headers.Authorization = `Bearer ${this.accessToken}`;
        const retry = await fetch(`${API_URL}${path}`, { ...options, headers });
        if (!retry.ok) throw new ApiError(retry.status, await safeJson(retry));
        return retry.json();
      }
      // Si refresh falla, limpiar y rechazar
      this.setAccessToken(null);
      localStorage.removeItem('cii_refresh_token');
      throw new ApiError(401, { error: 'No autenticado' });
    }

    if (!res.ok) throw new ApiError(res.status, await safeJson(res));
    if (res.status === 204) return undefined as unknown as T;
    return res.json();
  }

  async tryRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem('cii_refresh_token');
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      this.setAccessToken(data.accessToken);
      return true;
    } catch { return false; }
  }

  get<T = any>(path: string) { return this.request<T>(path); }
  post<T = any>(path: string, body?: any) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }
  put<T = any>(path: string, body?: any) {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }
  patch<T = any>(path: string, body?: any) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  }
  delete<T = any>(path: string) { return this.request<T>(path, { method: 'DELETE' }); }
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    super(data?.error || `HTTP ${status}`);
    this.status = status;
    this.data = data;
  }
}

async function safeJson(res: Response) {
  try { return await res.json(); } catch { return { error: res.statusText }; }
}

export const api = new ApiClient();
