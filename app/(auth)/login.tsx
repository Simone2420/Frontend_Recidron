import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button, InputField } from '../../src/components/ui';
import { useAuth } from '../../src/store/authStore';
import { useTheme } from '../../src/styles/theme';

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);

    const { success, error: loginError } = await login(email, password);
    
    setIsLoading(false);

    if (!success) {
      setError(loginError || 'Credenciales inválidas.');
      return;
    }

    const currentUser = useAuth.getState().user;
    if (currentUser?.role === 'admin') {
      router.replace('/(tabs)/admin-home');
    } else {
      router.replace('/(tabs)/user-home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <MaterialIcons name="recycling" size={60} color={theme.primary} />
          </View>
          <Text style={styles.title}>Recidron</Text>
          <Text style={styles.subtitle}>Gestión de Residuos — UniCundinamarca</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(800).delay(400)} style={styles.formContainer}>
          <InputField
            label="Email"
            placeholder="usuario@unicundinamarca.edu.co"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Contraseña"
            placeholder="••••••••"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? "visibility" : "visibility-off"}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          <View style={styles.forgotPasswordContainer}>
            <Button
              title="¿Olvidaste tu contraseña?"
              variant="text"
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPasswordBtn}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            title="Iniciar sesión"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginBtn}
          />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(800).delay(600)} style={styles.footerContainer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerText}>Regístrate</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

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
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 96,
    height: 96,
    backgroundColor: theme.white,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.slate500,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 32,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: -8,
  },
  forgotPasswordBtn: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  loginBtn: {
    marginTop: 8,
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
  },
  footerText: {
    color: theme.slate500,
    fontSize: 14,
  },
  registerText: {
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