import { create } from 'zustand';

type Role = 'admin' | 'user' | null;

interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  role: Role;
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
      // El backend devuelve el nombre del rol (admin/autor)
      const role: Role = data.rol === 'admin' ? 'admin' : 'user';
      const userData: AuthUser = {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        role,
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
