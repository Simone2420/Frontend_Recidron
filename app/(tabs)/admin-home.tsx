import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../styles/colors';
import { Button } from '../../components/ui';

export default function AdminHomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administrador</Text>
        <Text style={styles.subtitle}>Gestor principal de Residuos Sólidos</Text>
      </View>

      <View style={styles.content}>
        <Button
          title="Cerrar sesión"
          variant="outline"
          icon="logout"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.slate900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.slate500,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
