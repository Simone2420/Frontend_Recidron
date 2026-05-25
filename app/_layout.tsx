import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/styles/ThemeProvider';
import { useEffect } from 'react';
import { useAuth } from '../src/store/authStore';

export default function RootLayout() {
  const { checkSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="report-detail" />
        </Stack>
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}