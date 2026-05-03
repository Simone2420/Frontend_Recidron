import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';;
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Rect, Stop } from 'react-native-svg';
import { DashboardStats, statsService } from '../../src/services/stats_service';
import { useAuth } from '../../src/store/authStore';
import { Colors, WasteColors } from '../../src/styles/colors';

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const strokeWidth = 24;

  const actualTotal = data.reduce((sum, item) => sum + item.value, 0);
  const divisorTotal = actualTotal || 1; // Para evitar división por cero
  const colors = ['#2E7D32', '#00695C', '#78909C', '#C62828', '#FBC02D', '#5D4037'];

  const segments = data.map((item, i) => ({
    pct: item.value / divisorTotal,
    color: colors[i % colors.length],
    label: `${item.label} (${Math.round((item.value / divisorTotal) * 100)}%)`
  }));

  const circumference = 2 * Math.PI * r;
  let cumulative = 0;
  const arcs = segments.map((seg) => {
    const offset = circumference * (1 - cumulative);
    const dash = circumference * seg.pct;
    const result = { ...seg, offset, dash };
    cumulative += seg.pct;
    return result;
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle cx={cx} cy={cy} r={r} fill="none" stroke={Colors.slate100} strokeWidth={strokeWidth} />
          {actualTotal > 0 && arcs.map((arc, i) => (
            <Circle
              key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={arc.color} strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={arc.offset}
              rotation="-90" origin={`${cx}, ${cy}`}
            />
          ))}
        </Svg>
        <View style={styles.donutCenter}>
          <Text style={styles.donutValue}>{actualTotal}</Text>
          <Text style={styles.donutLabel}>{actualTotal === 1 ? 'REPORTE' : 'REPORTES'}</Text>
        </View>
      </View>
      <View style={styles.legendGrid}>
        {actualTotal > 0 ? (
          segments.filter(s => s.pct > 0).map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: Colors.slate400, fontSize: 12, marginTop: 16 }}>No hay datos registrados</Text>
        )}
      </View>
    </View>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const chartH = 120;
  const barW = 40;
  const gap = 20;
  const totalW = data.length * (barW + gap);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
      <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
        <Svg width={totalW} height={chartH}>
          {data.map((item, i) => {
            const barH = (item.value / max) * (chartH - 20);
            const x = i * (barW + gap);
            const y = chartH - barH - 20;
            const opacity = 0.5 + (item.value / max) * 0.5;
            return (
              <Rect key={item.label} x={x} y={y} width={barW} height={barH} rx={4} fill={Colors.primary} fillOpacity={opacity} />
            );
          })}
        </Svg>
        <View style={[styles.barLabelsRow, { width: totalW }]}>
          {data.map((item) => (
            <View key={item.label} style={{ width: barW + gap, alignItems: 'center' }}>
              <Text style={styles.barValue}>{item.value}</Text>
              <Text style={styles.barLabel}>{item.label.split(' ')[0]}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
function LineChart({ data }: { data: Array<{ fecha: string; cantidad: number }> }) {
  if (!data || data.length === 0) return <View style={{ height: 100, justifyContent: 'center' }}><Text>Sin datos</Text></View>;

  const points = data.map(d => d.cantidad);
  const w = 280;
  const h = 100;
  const padX = 8;
  const padY = 8;
  const minV = Math.min(...points);
  const maxV = Math.max(...points);
  const range = maxV - minV || 1;
  const divisorX = points.length > 1 ? points.length - 1 : 1;

  const coords = points.map((v, i) => {
    const x = padX + (i / divisorX) * (w - padX * 2);
    const y = padY + ((maxV - v) / range) * (h - padY * 2);
    return `${x},${y}`;
  });
  const polyline = coords.join(' ');
  const firstX = padX;
  const lastX = w - padX;
  const areaPath = coords.length > 1
    ? `M${firstX},${h} L${coords[0]} ${coords.slice(1).map((c) => `L${c}`).join(' ')} L${lastX},${h} Z`
    : `M${firstX},${h} L${coords[0]} L${lastX},${coords[0].split(',')[1]} L${lastX},${h} Z`;

  return (
    <View>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={Colors.primary} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={Colors.primary} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#lineGrad)" />
        <Polyline points={polyline} fill="none" stroke={Colors.primary} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
      <View style={styles.lineLabelsRow}>
        <Text style={styles.lineLabel}>{data[0].fecha}</Text>
        <Text style={styles.lineLabel}>{data[data.length - 1].fecha}</Text>
      </View>
    </View>
  );
}

// ─── Horizontal Bars ──────────────────────────────────────────────────────────
function HorizontalBars({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <View style={styles.hBarsContainer}>
      {data.map((item) => (
        <View key={item.label} style={styles.hBarRow}>
          <View style={styles.hBarHeader}>
            <Text style={styles.hBarLabel}>{item.label}</Text>
            <Text style={styles.hBarValue}>{item.value}</Text>
          </View>
          <View style={styles.hBarTrack}>
            <View style={[styles.hBarFill, { width: `${(item.value / max) * 100}%` }]} />
          </View>
        </View>
      ))}
      {data.length === 0 && <Text style={{ textAlign: 'center', color: Colors.slate400 }}>Sin datos de materiales</Text>}
    </View>
  );
}

// ─── Recent Report Row ────────────────────────────────────────────────────────
type WasteType = keyof typeof WasteColors;
function RecentReportRow({ type, location, time, onPress }: { type: WasteType; location: string; time: string; onPress?: () => void }) {
  const colors = WasteColors[type] || WasteColors['No Aprovechable'];
  return (
    <TouchableOpacity style={styles.recentRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.recentLeft}>
        <View style={[styles.recentBadge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.recentBadgeText, { color: colors.text }]}>{type}</Text>
        </View>
        <Text style={styles.recentLocation}>{location}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={styles.recentTime}>{time}</Text>
        {onPress && <MaterialIcons name="chevron-right" size={16} color={Colors.slate400} />}
      </View>
    </TouchableOpacity>
  );
}

// ─── Chart Card ───────────────────────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartCardHeader}>
        <Text style={styles.chartCardTitle}>{title}</Text>
        <MaterialIcons name="info-outline" size={18} color={Colors.slate400} />
      </View>
      <View style={styles.chartCardBody}>{children}</View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminHomeScreen() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsData, trendData, reportsData] = await Promise.all([
        statsService.getDashboardStats(),
        statsService.getTrendStats(),
        statsService.getRecentReports()
      ]);
      setStats(statsData);
      setTrends(trendData);
      setRecentReports(reportsData.slice(0, 5));
    } catch (error) {
      console.log('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <View style={styles.topHeaderIcon}>
          <MaterialIcons name="security" size={24} color={Colors.white} />
        </View>
        <Text style={styles.topHeaderTitle}>Panel de Administración</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 24 }} />
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Total Reportes</Text>
                <Text style={styles.kpiValue}>{stats?.total_reportes || 0}</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Usuarios Activos</Text>
                <Text style={styles.kpiValue}>{stats?.usuarios_activos || 0}</Text>
              </View>
            </ScrollView>

            <ChartCard title="Distribución por Tipo de Residuo">
              <DonutChart data={stats?.distribucion_tipos || []} />
            </ChartCard>

            <ChartCard title="Reportes por Zona del Campus">
              <BarChart data={stats?.distribucion_zonas || []} />
            </ChartCard>
          </>
        )}

        <ChartCard title="Tendencia de Reportes (Últimos 30d)">
          <LineChart data={trends} />
        </ChartCard>

        <ChartCard title="Materiales más Reportados">
          <HorizontalBars data={stats?.distribucion_materiales || []} />
        </ChartCard>

        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Reportes recientes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/reports')}>
              <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '600' }}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentList}>
            {recentReports.length > 0 ? (
              recentReports.map((report, idx) => (
                <React.Fragment key={report.id || idx}>
                  <RecentReportRow
                    type={(report.tipo_nombre || 'No Aprovechable') as WasteType}
                    location={report.zona_nombre || report.descripcion?.slice(0, 40) || 'Ubicación desconocida'}
                    time={
                      report.fecha_reporte
                        ? new Date(report.fecha_reporte.replace(' ', 'T') + 'Z').toLocaleString('es-CO', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                          })
                        : 'Reciente'
                    }
                    onPress={() => router.push({ pathname: '/report-detail', params: { id: report.id } })}
                  />
                  {idx < recentReports.length - 1 && <View style={styles.recentDivider} />}
                </React.Fragment>
              ))
            ) : (
              <Text style={{ padding: 16, textAlign: 'center', color: Colors.slate400 }}>No hay reportes recientes</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.pdfBtn} activeOpacity={0.85}>
          <MaterialIcons name="download" size={22} color={Colors.white} />
          <Text style={styles.pdfBtnText}>Descargar Reporte PDF</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  topHeader: {
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  topHeaderIcon: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 10 },
  topHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.white, letterSpacing: -0.3 },
  scrollContent: { paddingBottom: 48, gap: 16 },
  kpiRow: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  kpiCard: {
    minWidth: 140, backgroundColor: Colors.white, borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: Colors.primaryBorder,
    shadowColor: Colors.slate900, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  kpiCardDanger: { backgroundColor: '#FFF5F5', borderColor: '#FFCDD2' },
  kpiLabel: { fontSize: 11, color: Colors.slate500, fontWeight: '500', marginBottom: 4 },
  kpiValue: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  kpiLabelDanger: { fontSize: 11, color: '#E53935', fontWeight: '500', marginBottom: 4 },
  kpiValueDanger: { fontSize: 22, fontWeight: 'bold', color: '#C62828' },
  chartCard: {
    marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.slate100, overflow: 'hidden',
    shadowColor: Colors.slate900, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  chartCardHeader: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.primaryBorder,
  },
  chartCardTitle: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  chartCardBody: { padding: 16, alignItems: 'center' },
  donutCenter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  donutValue: { fontSize: 24, fontWeight: 'bold', color: Colors.slate900 },
  donutLabel: { fontSize: 10, color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.5 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: '45%' },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.slate700 },
  barLabelsRow: { flexDirection: 'row', marginTop: 4 },
  barValue: { fontSize: 10, fontWeight: 'bold', color: Colors.slate700, textAlign: 'center' },
  barLabel: { fontSize: 10, color: Colors.slate400, textAlign: 'center' },
  lineLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  lineLabel: { fontSize: 10, color: Colors.slate400 },
  hBarsContainer: { width: '100%', gap: 16 },
  hBarRow: { gap: 6 },
  hBarHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  hBarLabel: { fontSize: 11, fontWeight: '500', color: Colors.slate700 },
  hBarValue: { fontSize: 11, fontWeight: '500', color: Colors.slate700 },
  hBarTrack: { height: 8, backgroundColor: Colors.slate100, borderRadius: 999, overflow: 'hidden' },
  hBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 999 },
  recentList: {},
  recentRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  recentDivider: { height: 1, backgroundColor: Colors.slate100, marginHorizontal: 16 },
  recentLeft: { gap: 4 },
  recentBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  recentBadgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.3 },
  recentLocation: { fontSize: 12, fontWeight: '500', color: Colors.slate700 },
  recentTime: { fontSize: 10, color: Colors.slate400 },
  pdfBtn: {
    marginHorizontal: 16, backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  pdfBtnText: { fontSize: 15, fontWeight: 'bold', color: Colors.white },
});