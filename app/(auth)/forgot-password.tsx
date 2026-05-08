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
  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async () => {
    setError('');
    setIsLoading(true);
    try {
      if(email.length > 3) {
        await authService.recoverPassword(email);
        setIsSuccess(true);
      } else {
        setError('Por favor, ingresa un correo válido.');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'No se pudo enviar el correo de recuperación.');
      console.error(err);
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
          {!isSuccess ? (
            <Animated.View entering={FadeInDown.duration(600)} style={styles.formSection}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="lock-reset" size={48} color={theme.primary} />
              </View>
              <Text style={styles.title}>Recuperar Acceso</Text>
              <Text style={styles.subtitle}>
                Ingresa tu correo institucional registrado y te enviaremos instrucciones para generar una nueva contraseña.
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
              {error ? <Text style={{color: theme.danger, marginBottom: 12, textAlign: 'center'}}>{error}</Text> : null}

              <Button
                title="Enviar Enlace de Recuperación"
                onPress={handleRecover}
                isLoading={isLoading}
              />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(800)} style={styles.successSection}>
              <View style={styles.successCircle}>
                <MaterialIcons name="mark-email-read" size={56} color={theme.white} />
              </View>
              <Text style={styles.successTitle}>¡Revisa tu buzón!</Text>
              <Text style={styles.successSubtitle}>
                Hemos enviado un enlace temporal con código biométrico a: {'\n'}
                <Text style={styles.successEmailText}>{email}</Text>
              </Text>

              <View style={styles.infoBox}>
                <MaterialIcons name="info-outline" size={20} color={theme.primary} />
                <Text style={styles.infoText}>
                  El enlace expirará de tu buzón universitario en 15 minutos por tu seguridad.
                </Text>
              </View>

              <Button
                title="Volver al Login"
                onPress={() => router.replace('/(auth)/login')}
                style={styles.returnBtn}
              />
            </Animated.View>
          )}
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
    backgroundColor: theme.white,
    borderRadius: 20,
    shadowColor: theme.slate900,
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
  
  // -- Success view --
  successSection: {
    alignItems: 'center',
    marginTop: -40, // Centrar perceptualmente
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 15,
    color: theme.slate500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successEmailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.slate900,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.primary,
    fontWeight: '500',
    lineHeight: 18,
  },
  returnBtn: {
    width: '100%',
  },
});
