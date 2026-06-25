import { create } from 'zustand';
import { api } from './api';

export interface Usuario {
  usuarioId: number;
  correo: string;
  nombre: string;
  rol: string;
  cargo?: string | null;
  departamento?: string | null;
}

interface AuthState {
  usuario: Usuario | null;
  cargando: boolean;
  inicializar: () => Promise<void>;
  login: (correo: string, password: string) => Promise<void>;
  loginGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  usuario: null,
  cargando: true,

  inicializar: async () => {
    if (!api.getAccessToken()) {
      set({ cargando: false });
      return;
    }
    try {
      const usuario = await api.get<Usuario>('/api/auth/me');
      set({ usuario, cargando: false });
    } catch {
      api.setAccessToken(null);
      localStorage.removeItem('cii_refresh_token');
      set({ usuario: null, cargando: false });
    }
  },

  login: async (correo, password) => {
    const data = await api.post('/api/auth/login', { correo, password });
    api.setAccessToken(data.accessToken);
    localStorage.setItem('cii_refresh_token', data.refreshToken);
    set({ usuario: data.usuario });
  },

  loginGoogle: async (credential) => {
    const data = await api.post('/api/auth/google', { credential });
    api.setAccessToken(data.accessToken);
    localStorage.setItem('cii_refresh_token', data.refreshToken);
    set({ usuario: data.usuario });
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('cii_refresh_token');
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch { /* ignorar */ }
    api.setAccessToken(null);
    localStorage.removeItem('cii_refresh_token');
    set({ usuario: null });
  },
}));
