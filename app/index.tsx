import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { isOnboardingCompleted } from '../src/services/onboarding_service';

export default function Index() {
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkInitialFlow() {
      try {
        const completed = await isOnboardingCompleted();
        if (!completed) {
          if (isMounted) setTargetRoute('/(auth)/onboarding');
          return;
        }

        // Si ya completó el onboarding, verificar si hay sesión activa
        const userDataStr = await SecureStore.getItemAsync('user_data');
        if (userDataStr) {
          try {
            const user = JSON.parse(userDataStr);
            if (user?.role === 'admin') {
              if (isMounted) setTargetRoute('/(tabs)/admin-home');
              return;
            } else if (user?.role === 'user') {
              if (isMounted) setTargetRoute('/(tabs)/user-home');
              return;
            }
          } catch {
            // Error parseando sesión, continuar a login
          }
        }

        if (isMounted) setTargetRoute('/(auth)/login');
      } catch (err) {
        console.warn('[Index] Error verificando flujo inicial:', err);
        if (isMounted) setTargetRoute('/(auth)/login');
      }
    }

    checkInitialFlow();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!targetRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return <Redirect href={targetRoute as any} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#051a12',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
