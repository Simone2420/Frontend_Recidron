import { create } from 'zustand';

type Role = 'admin' | 'user' | null;

interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  role: Role;
  rol_id?: number;
  token?: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

import { authService } from '../services/auth_service';
import * as SecureStore from 'expo-secure-store';

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    try {
      const data = await authService.login(email, password);
      console.log('[AuthStore] Respuesta del backend:', data); // debug temporal
      // El backend devuelve data.rol = nombre del rol ('admin' | 'autor')
      // También comparamos por rol_id === 1 como respaldo
      const esAdmin = data.rol === 'admin' || data.rol_id === 1;
      const role: Role = esAdmin ? 'admin' : 'user';
      const userData: AuthUser = {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        role,
        rol_id: data.rol_id,
        token: data.token
      };

      if (data.token) {
        await SecureStore.setItemAsync('user_token', data.token);
      }

      set({ user: userData });
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Error de conexión';
      return { success: false, error: msg };
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('user_token');
    set({ user: null });
  },
}));
