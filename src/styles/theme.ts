import { createContext, useContext } from 'react';
import { Colors } from './colors';

// Mantenemos la paleta original como base para el modo claro
export const lightColors = {
  ...Colors,
};

// Definimos un modo oscuro suave que el usuario puede ajustar después
export const darkColors = {
  ...Colors, // fallback
  backgroundLight: '#1e293b', // slate800
  backgroundDark: '#0f172a',  // slate900
  white: '#1e293b', // Para tarjetas
  slate900: '#f1f5f9', // Textos oscuros pasan a ser claros
  slate800: '#e2e8f0',
  slate700: '#cbd5e1',
  slate500: '#94a3b8',
  slate100: '#334155', // Bordes
};

export type ColorTheme = typeof lightColors;

type ThemeContextType = {
  theme: ColorTheme;
  isDark: boolean;
  themeMode: 'system' | 'light' | 'dark';
  setThemeMode: (mode: 'system' | 'light' | 'dark') => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightColors,
  isDark: false,
  themeMode: 'system',
  setThemeMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);
