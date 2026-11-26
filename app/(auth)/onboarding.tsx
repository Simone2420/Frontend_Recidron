import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingCarousel } from '../../src/components/onboarding';
import { setOnboardingCompleted } from '../../src/services/onboarding_service';

export default function OnboardingScreen() {
  const params = useLocalSearchParams<{ fromLogin?: string }>();
  const isFromLogin = params.fromLogin === 'true';

  const handleFinish = async () => {
    try {
      await setOnboardingCompleted();
    } catch (e) {
      console.warn('[OnboardingScreen] Error al registrar onboarding completado:', e);
    }

    if (isFromLogin && router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <OnboardingCarousel onComplete={handleFinish} onSkip={handleFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051a12',
  },
});
