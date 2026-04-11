import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button, InputField } from '../../src/components/ui';
import { useAuth } from '../../src/context/AuthContext';
import { Colors } from '../../src/styles/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (!email || !password) {
        setError('Por favor, ingresa tu correo y contraseña.');
        return;
      }

      const success = login(email, password);
      if (!success) {
        setError('Credenciales inválidas.');
        return;
      }

      if (email.toLowerCase() === 'admin@test.com') {
        router.replace('/(tabs)/admin-home');
      } else {
        router.replace('/(tabs)/user-home');
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <MaterialIcons name="recycling" size={60} color={Colors.primary} />
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
            secureTextEntry
          />
          <View style={styles.forgotPasswordContainer}>
            <Button
              title="¿Olvidaste tu contraseña?"
              variant="text"
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
          <Text style={styles.registerText}>Regístrate</Text>
        </Animated.View>

      </ScrollView>

      <View style={styles.waveContainer} pointerEvents="none">
        <View style={styles.waveLayer1} />
        <View style={styles.waveLayer2} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
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
    backgroundColor: Colors.white,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.slate900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.slate500,
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
    color: Colors.danger,
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
    color: Colors.slate500,
    fontSize: 14,
  },
  registerText: {
    color: Colors.primary,
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
    backgroundColor: Colors.primaryLight,
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
    backgroundColor: Colors.primaryLight,
    borderTopLeftRadius: 800,
    borderTopRightRadius: 1200,
    opacity: 0.8,
    transform: [{ scaleX: 1.2 }],
  },
});