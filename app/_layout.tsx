import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from '../src/styles/ThemeProvider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report-detail" />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
}