import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

export default function ProfileMockScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sección de Perfil</Text>
      <Text style={styles.subtitle}>En construcción</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.slate900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.slate500,
  },
});
