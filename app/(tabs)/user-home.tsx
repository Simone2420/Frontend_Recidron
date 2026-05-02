import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { StatCard } from '../../src/components/cards';
import { Colors } from '../../src/styles/colors';
import { userService } from '../../src/services/user_service';
import { wasteService } from '../../src/services/waste_service';
import { useAuth } from '../../src/store/authStore';

export default function UserHomeScreen() {
  const { user } = useAuth();
  const [gridStats, setGridStats] = useState<{ title: string; value: string; subtitle: string }[]>([]);
  const [rankStat, setRankStat] = useState<{ value: string; subtitle: string } | null>(null);
  const [lastReport, setLastReport] = useState<string | null>(null);
  const [totalReports, setTotalReports] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const userName = user?.nombre || user?.email?.split('@')[0] || 'Usuario';

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Cargar estadísticas del usuario
        const data = await userService.getUserDashboard();
        if (data && Array.isArray(data.stats)) {
          const rank = data.stats.find((s: any) => s.title === 'Mi Rango');
          // Filtrar Zonas Limpias/Activas ya que se reemplaza por Total Reportes
          const others = data.stats.filter((s: any) =>
            s.title !== 'Mi Rango' && s.title !== 'Zonas Limpias' && s.title !== 'Zonas Activas'
          );
          if (rank) setRankStat({ value: rank.value, subtitle: rank.subtitle });
          setGridStats(others);
        }
        // Cargar el último reporte del usuario
        const reports = await wasteService.getAllReports(0, 50);
        if (reports && reports.length > 0) {
          setTotalReports(reports.length);
          const myId = user?.id;
          const myReports = reports.filter((r: any) => Number(r.usuario_id) === Number(myId));
          if (myReports.length > 0) {
            const latest = myReports[0];
            const zona = latest.zona_nombre || 'Zona desconocida';
            const fecha = latest.fecha_reporte
              ? new Date(latest.fecha_reporte.replace(' ', 'T') + 'Z').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
              : 'Reciente';
            setLastReport(`${zona} · ${fecha}`);
          } else {
            setLastReport('Sin reportes aún');
          }
        }
      } catch (err) {
        console.error('User stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Orden: Mis Reportes | Total Reportes | Material Top | Último Reporte
  const miReportes = gridStats.find(s => s.title === 'Mis Reportes');
  const otrosStats = gridStats.filter(s => s.title !== 'Mis Reportes');
  const finalGrid = [
    miReportes ?? { title: 'Mis Reportes', value: '—', subtitle: 'Total acumulado' },
    { title: 'Total Reportes', value: totalReports !== null ? String(totalReports) : '—', subtitle: 'En el sistema' },
    ...otrosStats,
    { title: 'Último Reporte', value: lastReport ?? '—', subtitle: 'Tu actividad reciente' },
  ];

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
              <>
                {/* ── Tarjeta ancha: Mi Rango ── */}
                {rankStat && (
                  <View style={styles.rankCard}>
                    <View style={styles.rankCardLeft}>
                      <View style={styles.rankIconBox}>
                        <MaterialIcons name="workspace-premium" size={28} color={Colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.rankLabel}>Mi Rango</Text>
                        <Text style={styles.rankValue}>{rankStat.value}</Text>
                        <Text style={styles.rankSubtitle}>{rankStat.subtitle}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.rankBadge}
                      onPress={() => router.push('/(tabs)/profile')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.rankBadgeText}>Ver perfil</Text>
                      <MaterialIcons name="chevron-right" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}

                {/* ── Grid de estadísticas ── */}
                <View style={styles.grid}>
                  {finalGrid.map((stat, index) => (
                    <View key={index} style={styles.gridItem}>
                      <StatCard
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  container: { flex: 1, backgroundColor: Colors.backgroundLight },

  // ── Header ──
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8,
  },
  logoBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  welcomeText: { fontSize: 13, color: Colors.slate500, fontWeight: '500' },
  greetingText: { fontSize: 22, fontWeight: 'bold', color: Colors.slate900, lineHeight: 28 },
  greetingName: { color: Colors.primary },

  // ── Scroll ──
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 120 },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: Colors.slate900,
    marginBottom: 16, marginTop: 8,
  },

  // ── Tarjeta ancha: Mi Rango ──
  rankCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.primaryBorder,
    paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  rankCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  rankLabel: {
    fontSize: 11, color: Colors.slate500, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  rankValue: { fontSize: 18, fontWeight: 'bold', color: Colors.slate900, marginTop: 2 },
  rankSubtitle: { fontSize: 11, color: Colors.primary, fontWeight: '500', marginTop: 1 },
  rankBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  rankBadgeText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  // ── Grid 2×2 ──
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  gridItem: { width: '47.5%' },
});