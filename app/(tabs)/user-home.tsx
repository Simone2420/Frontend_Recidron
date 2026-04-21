import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { StatCard } from '../../src/components/cards';
import { Colors } from '../../src/styles/colors';
import { userService } from '../../src/services/user_service';
import { useAuth } from '../../src/store/authStore';

const FALLBACK_STATS = [
  { title: 'Total Reportes', value: '128', subtitle: '+12 este mes' },
  { title: 'Zonas Activas', value: '12', subtitle: '4 en monitoreo' },
  { title: 'Material Top', value: 'Plástico', subtitle: '45% del total' },
  { title: 'Último Reporte', value: '2h', subtitle: 'En Zona Norte' },
];

export default function UserHomeScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);

  // Definimos el nombre para el saludo (si no hay nombre, usa el email o 'Usuario')
  const userName = user?.nombre || user?.email?.split('@')[0] || 'Usuario';
  const userInitials = userName.substring(0, 2).toUpperCase();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await userService.getUserDashboard();
        // Si tienes la data mapeada al formato:
        if (data && data.stats) {
           setStats(data.stats);
        }
      } catch (err) {
        console.error('User stats fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Header / Saludo ── */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.header}
        >
          <View style={styles.logoBox}>
            <MaterialIcons name="energy-savings-leaf" size={28} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Bienvenido de vuelta</Text>
            <Text style={styles.greetingText}>
              Hola, <Text style={styles.greetingName}>{userName}</Text>
            </Text>
          </View>
        </Animated.View>

        {/* ── Contenido principal ── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <Text style={styles.sectionTitle}>Resumen de actividad</Text>

            {loading ? (
               <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 24 }} />
            ) : (
              <View style={styles.grid}>
                {stats.map((stat, index) => (
                  <View key={index} style={styles.gridItem}>
                    <StatCard
                      title={stat.title}
                      value={stat.value}
                      subtitle={stat.subtitle}
                    />
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* ── FAB: Nuevo Reporte ── */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.fabContainer}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => router.push('/new-report')}
          >
            <MaterialIcons name="add" size={22} color={Colors.white} />
            <Text style={styles.fabText}>Nuevo Reporte</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 13,
    color: Colors.slate500,
    fontWeight: '500',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.slate900,
    lineHeight: 28,
  },
  greetingName: {
    color: Colors.primary,
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 120, // espacio para el FAB
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.slate900,
    marginBottom: 16,
    marginTop: 8,
  },

  // ── Grid 2×2 ──
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  gridItem: {
    // cada item ocupa ~50% menos el gap
    width: '47.5%',
  },

  // ── FAB ──
  fabContainer: {
    position: 'absolute',
    bottom: 90, // encima del tab bar
    right: 24,
    left: 24,
    alignItems: 'flex-end',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  fabText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});