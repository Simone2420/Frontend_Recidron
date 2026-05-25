import { createContext, useContext } from 'react';
import { Colors } from './colors';

// Mantenemos la paleta original como base para el modo claro
export const lightColors = {
  ...Colors,
};

// Definimos un modo oscuro con la escala slate correctamente invertida
export const darkColors = {
  ...Colors, // fallback
  backgroundLight: '#0f172a', // slate900
  backgroundDark: '#020617',  // slate950
  card: '#1e293b', // slate800 - Fondo para tarjetas para que resalten
  shadow: '#000000', // Sombra siempre negra en modo oscuro
  
  // Invertir escala Slate completa
  slate900: '#f8fafc',
  slate800: '#f1f5f9',
  slate700: '#e2e8f0',
  slate500: '#94a3b8',
  slate400: '#64748b',
  slate200: '#334155',
  slate100: '#1e293b',
  
  // Alertas
  danger: '#ef4444',
  dangerLight: '#ef444425',
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
