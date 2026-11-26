import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'recidron_onboarding_completed_v1';

/**
 * Consulta si el usuario ya visualizó y completó el onboarding inicial.
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.warn('[OnboardingService] Error al leer estado de onboarding:', error);
    return false;
  }
}

/**
 * Registra que el usuario completó o saltó el onboarding.
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.warn('[OnboardingService] Error al guardar estado de onboarding:', error);
  }
}

/**
 * Restablece la bandera de onboarding para permitir volver a probarlo en primera ejecución.
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
  } catch (error) {
    console.warn('[OnboardingService] Error al restablecer estado de onboarding:', error);
  }
}
