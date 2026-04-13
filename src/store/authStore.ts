import { create } from 'zustand';

type Role = 'admin' | 'user' | null;

interface AuthUser {
  email: string;
  fullName: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  login: (email: string, fullName: string, role: Role) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (email: string, fullName: string, role: Role): void => {
    set({ user: { email, fullName, role } });
  },
  logout: () => {
    set({ user: null });
  },
}));
