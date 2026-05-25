import React, { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext, lightColors, darkColors } from './theme';

type ThemeMode = 'system' | 'light' | 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nativeColorScheme = useNativeColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('@theme_mode');
        if (savedMode) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (e) {
        console.error('Failed to load theme mode', e);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('@theme_mode', mode);
    } catch (e) {
      console.error('Failed to save theme mode', e);
    }
  };

  const isDark = themeMode === 'system' ? nativeColorScheme === 'dark' : themeMode === 'dark';
  const theme = isDark ? darkColors : lightColors;

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ theme, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
