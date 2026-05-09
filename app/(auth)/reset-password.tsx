import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Button, InputField } from '../../src/components/ui';
import { authService } from '../../src/services/auth_service';
import { useTheme } from '../../src/styles/theme';

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // El email puede venir como parámetro de navegación (desde forgot-password)
  // pero el usuario puede editarlo si entró directo a esta pantalla.
  const params = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(params.email ?? '');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async () => {
    setError('');

    // Validaciones locales
    if (!email || !codigo || !nuevaPassword || !confirmarPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (codigo.length !== 6) {
      setError('El código debe tener exactamente 6 caracteres.');
      return;
    }
    if (nuevaPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, codigo.toUpperCase(), nuevaPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Código inválido o expirado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View entering={FadeIn.duration(800)} style={styles.successSection}>
            <View style={styles.successCircle}>
              <MaterialIcons name="check-circle" size={64} color={theme.white} />
            </View>
            <Text style={styles.successTitle}>¡Contraseña actualizada!</Text>
            <Text style={styles.successSubtitle}>
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </Text>
            <Button
              title="Ir al Login"
              onPress={() => router.replace('/(auth)/login')}
              style={styles.actionBtn}
            />
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header con botón atrás */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.slate900} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.formSection}>

            {/* Ícono */}
            <View style={styles.iconCircle}>
              <MaterialIcons name="vpn-key" size={48} color={theme.primary} />
            </View>

            <Text style={styles.title}>Restablecer Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa el código de 6 dígitos enviado a tu correo y define tu nueva contraseña.
            </Text>

            {/* Banner informativo */}
            <View style={styles.infoBox}>
              <MaterialIcons name="schedule" size={18} color={theme.primary} />
              <Text style={styles.infoText}>El código expira en 15 minutos.</Text>
            </View>

            {/* Campos */}
            <View style={styles.fieldsContainer}>
              <InputField
                label="Correo Electrónico"
                placeholder="usuario@unicundinamarca.edu.co"
                icon="mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="Código de verificación"
                placeholder="AB1C2D"
                icon="dialpad"
                value={codigo}
                onChangeText={(t) => setCodigo(t.toUpperCase())}
                autoCapitalize="characters"
                maxLength={6}
              />

              <InputField
                label="Nueva Contraseña"
                placeholder="Mínimo 8 caracteres"
                icon="lock"
                value={nuevaPassword}
                onChangeText={setNuevaPassword}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'visibility' : 'visibility-off'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <InputField
                label="Confirmar Contraseña"
                placeholder="Repite tu nueva contraseña"
                icon="lock-outline"
                value={confirmarPassword}
                onChangeText={setConfirmarPassword}
                secureTextEntry={!showConfirm}
                rightIcon={showConfirm ? 'visibility' : 'visibility-off'}
                onRightIconPress={() => setShowConfirm(!showConfirm)}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title="Restablecer Contraseña"
                onPress={handleReset}
                isLoading={isLoading}
                style={styles.actionBtn}
              />
            </View>

            {/* Enlace para volver a solicitar el código */}
            <TouchableOpacity
              style={styles.resendContainer}
              onPress={() => router.replace('/(auth)/forgot-password')}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>
                ¿No recibiste el código?{' '}
                <Text style={styles.resendLink}>Solicitar uno nuevo</Text>
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
    width: '100%',
  },
  fieldsContainer: {
    width: '100%',
    marginTop: 4,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: theme.slate500,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 24,
    gap: 8,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.primary,
    fontWeight: '500',
  },
  errorText: {
    color: theme.danger,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
    width: '100%',
  },
  actionBtn: {
    width: '100%',
    marginTop: 8,
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 13,
    color: theme.slate500,
    textAlign: 'center',
  },
  resendLink: {
    color: theme.primary,
    fontWeight: '600',
  },

  // — Success view —
  successSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 14,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    color: theme.slate500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});
