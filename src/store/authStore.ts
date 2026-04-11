import { create } from 'zustand';

type Role = 'admin' | 'user' | null;

interface AuthUser {
  email: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (email: string, password: string): boolean => {
    if (!email || !password) return false;

    const role: Role = email.toLowerCase() === 'admin@test.com' ? 'admin' : 'user';
    set({ user: { email, role } });
    return true;
  },
  logout: () => {
    set({ user: null });
  },
}));
