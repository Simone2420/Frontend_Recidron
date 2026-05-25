import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';;
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Button, InputField } from '../../src/components/ui';
import { authService } from '../../src/services/auth_service';
import { useTheme } from '../../src/styles/theme';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async () => {
    setError('');
    if (email.length < 4) {
      setError('Por favor, ingresa un correo válido.');
      return;
    }
    setIsLoading(true);
    try {
      await authService.recoverPassword(email);
      // Navegar directamente a la pantalla de código, pasando el email
      router.push({ pathname: '/(auth)/reset-password' as any, params: { email } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'No se pudo enviar el correo de recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.slate900} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.formSection}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="lock-reset" size={48} color={theme.primary} />
            </View>
            <Text style={styles.title}>Recuperar Acceso</Text>
            <Text style={styles.subtitle}>
              Ingresa tu correo institucional registrado y te enviaremos un código de verificación.
            </Text>

            <View style={styles.inputArea}>
              <InputField
                label="Correo Electrónico"
                placeholder="usuario@unicundinamarca.edu.co"
                icon="mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              title="Enviar Código de Recuperación"
              onPress={handleRecover}
              isLoading={isLoading}
            />

            {/* Acceso directo si ya se recibió el código anteriormente */}
            <TouchableOpacity
              style={styles.alreadyCodeContainer}
              onPress={() => router.push({ pathname: '/(auth)/reset-password', params: { email } })}
              activeOpacity={0.7}
            >
              <Text style={styles.alreadyCodeText}>
                ¿Ya tienes un código?{' '}
                <Text style={styles.alreadyCodeLink}>Ingrésalo aquí</Text>
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.card,
    borderRadius: 20,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  formSection: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: theme.slate500,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  inputArea: {
    width: '100%',
    marginBottom: 24,
  },
  errorText: {
    color: theme.danger,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
    width: '100%',
  },
  alreadyCodeContainer: {
    marginTop: 20,
  },
  alreadyCodeText: {
    fontSize: 13,
    color: theme.slate500,
    textAlign: 'center',
  },
  alreadyCodeLink: {
    color: theme.primary,
    fontWeight: '600',
  },
});
