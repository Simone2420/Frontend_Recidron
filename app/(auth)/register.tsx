import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button, InputField } from '../../src/components/ui';
import { useTheme } from '../../src/styles/theme';
import { authService } from '../../src/services/auth_service';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [fullName, setFullName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!fullName || !studentCode || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos para registrarte.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // Mandar los datos que coincide con la estructura de un usuario (ajusta las propiedades en base a tu backend)
      // El authService ya mapea full_name -> nombre automáticamente
      await authService.register({
        full_name: fullName,
        student_code: studentCode,
        email: email.toLowerCase(),
        password: password
      });
      setIsLoading(false);
      // Volvemos exitosamente atrás (Login)
      router.back();
    } catch (err: any) {
      setIsLoading(false);
      console.error('Registration error:', err.response?.data || err.message);
      // Mostramos el detalle real del backend si existe
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Error al registrar la cuenta.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.headerContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.slate900} />
          </TouchableOpacity>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Súmate al control responsable de la Universidad con Recidron</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(800).delay(300)} style={styles.formContainer}>
          <InputField
            label="Nombre Completo"
            placeholder="Ej. María López"
            icon="person"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <InputField
            label="Código Estudiantil"
            placeholder="Ej. 100456"
            icon="badge"
            value={studentCode}
            onChangeText={setStudentCode}
            keyboardType="numeric"
          />
          <InputField
            label="Correo Institucional"
            placeholder="usuario@unicundinamarca.edu.co"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Contraseña segura"
            placeholder="Mínimo 8 caracteres"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? "visibility" : "visibility-off"}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          <InputField
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            icon="lock"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            rightIcon={showConfirmPassword ? "visibility" : "visibility-off"}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Button
            title="Registrarse"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.registerBtn}
          />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(800).delay(500)} style={styles.footerContainer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta en Recidron? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <Text style={styles.loginText}>Inicia sesión</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      {/* Ondas decorativas de fondo para consistencia visual */}
      <View style={styles.waveContainer} pointerEvents="none">
        <View style={styles.waveLayer1} />
        <View style={styles.waveLayer2} />
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    zIndex: 10,
  },
  headerContainer: {
    marginBottom: 40,
    marginTop: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.slate500,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  registerBtn: {
    marginTop: 16,
  },
  errorText: {
    color: theme.danger,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  footerText: {
    color: theme.slate500,
    fontSize: 14,
  },
  loginText: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
    zIndex: 0,
  },
  waveLayer1: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    right: -100,
    height: 300,
    backgroundColor: theme.primaryLight,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
    opacity: 0.5,
    transform: [{ scaleX: 1.5 }],
  },
  waveLayer2: {
    position: 'absolute',
    bottom: -200,
    left: -50,
    right: -150,
    height: 300,
    backgroundColor: theme.primaryLight,
    borderTopLeftRadius: 800,
    borderTopRightRadius: 1200,
    opacity: 0.8,
    transform: [{ scaleX: 1.2 }],
  },
});
