import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Rect, Stop } from 'react-native-svg';
import { useAuth } from '../../src/store/authStore';
import { Colors, WasteColors } from '../../src/styles/colors';

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart() {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const strokeWidth = 24;
  const segments = [
    { pct: 0.35, color: '#2E7D32' },
    { pct: 0.30, color: '#00695C' },
    { pct: 0.20, color: '#78909C' },
    { pct: 0.15, color: '#C62828' },
  ];
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
          {arcs.map((arc, i) => (
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
          <Text style={styles.donutValue}>1.2k</Text>
          <Text style={styles.donutLabel}>TOTAL</Text>
        </View>
      </View>
      <View style={styles.legendGrid}>
        {[
          { color: '#2E7D32', label: 'Aprovechable (35%)' },
          { color: '#00695C', label: 'Orgánico (30%)' },
          { color: '#78909C', label: 'No Aprovechable (20%)' },
          { color: '#C62828', label: 'Peligroso (15%)' },
        ].map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart() {
  const data = [
    { label: 'Zona A', value: 40 },
    { label: 'Zona B', value: 65 },
    { label: 'Zona C', value: 92 },
    { label: 'Zona D', value: 55 },
  ];
  const max = 92;
  const chartH = 120;
  const barW = 36;
  const gap = 24;
  const totalW = data.length * (barW + gap) - gap;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={totalW + 16} height={chartH}>
        {data.map((item, i) => {
          const barH = (item.value / max) * chartH;
          const x = i * (barW + gap) + 8;
          const y = chartH - barH;
          const opacity = 0.2 + (item.value / max) * 0.8;
          return (
            <Rect key={item.label} x={x} y={y} width={barW} height={barH} rx={6} fill={Colors.primary} fillOpacity={opacity} />
          );
        })}
      </Svg>
      <View style={[styles.barLabelsRow, { width: totalW + 16 }]}>
        {data.map((item) => (
          <View key={item.label} style={{ width: barW + gap, alignItems: 'center' }}>
            <Text style={styles.barValue}>{item.value}</Text>
            <Text style={styles.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
function LineChart() {
  const points = [30, 10, 25, 15, 28, 12, 20, 18, 25, 10];
  const w = 280;
  const h = 100;
  const padX = 8;
  const padY = 8;
  const minV = Math.min(...points);
  const maxV = Math.max(...points);
  const range = maxV - minV || 1;
  const coords = points.map((v, i) => {
    const x = padX + (i / (points.length - 1)) * (w - padX * 2);
    const y = padY + ((maxV - v) / range) * (h - padY * 2);
    return `${x},${y}`;
  });
  const polyline = coords.join(' ');
  const firstX = padX;
  const lastX = w - padX;
  const areaPath = `M${firstX},${h} L${coords[0]} ${coords.slice(1).map((c) => `L${c}`).join(' ')} L${lastX},${h} Z`;

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
        <Text style={styles.lineLabel}>30 días atrás</Text>
        <Text style={styles.lineLabel}>Hoy</Text>
      </View>
    </View>
  );
}

// ─── Horizontal Bars ──────────────────────────────────────────────────────────
function HorizontalBars() {
  const data = [
    { label: 'Plástico PET', value: 450, pct: 0.85 },
    { label: 'Papel/Cartón', value: 320, pct: 0.65 },
    { label: 'Vidrio', value: 120, pct: 0.30 },
  ];
  return (
    <View style={styles.hBarsContainer}>
      {data.map((item) => (
        <View key={item.label} style={styles.hBarRow}>
          <View style={styles.hBarHeader}>
            <Text style={styles.hBarLabel}>{item.label}</Text>
            <Text style={styles.hBarValue}>{item.value}</Text>
          </View>
          <View style={styles.hBarTrack}>
            <View style={[styles.hBarFill, { width: `${item.pct * 100}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Recent Report Row ────────────────────────────────────────────────────────
type WasteType = keyof typeof WasteColors;
function RecentReportRow({ type, location, time }: { type: WasteType; location: string; time: string }) {
  const colors = WasteColors[type] || WasteColors['No Aprovechable'];
  return (
    <View style={styles.recentRow}>
      <View style={styles.recentLeft}>
        <View style={[styles.recentBadge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.recentBadgeText, { color: colors.text }]}>{type}</Text>
        </View>
        <Text style={styles.recentLocation}>{location}</Text>
      </View>
      <Text style={styles.recentTime}>{time}</Text>
    </View>
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
    const { user, logout } = useAuth();
  
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
          <View>
            <Text style={styles.topHeaderSubtitle}>Hola, {user?.fullName || 'Admin'}</Text>
            <Text style={styles.topHeaderTitle}>Panel de Control</Text>
          </View>
        </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Reportes</Text>
            <Text style={styles.kpiValue}>1,284</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Usuarios Activos</Text>
            <Text style={styles.kpiValue}>456</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Más Actividad</Text>
            <Text style={styles.kpiValue}>Zona Norte</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardDanger]}>
            <Text style={styles.kpiLabelDanger}>Res. Peligrosos</Text>
            <Text style={styles.kpiValueDanger}>82</Text>
          </View>
        </ScrollView>

        <ChartCard title="Distribución por Tipo de Residuo"><DonutChart /></ChartCard>
        <ChartCard title="Reportes por Zona del Campus"><BarChart /></ChartCard>
        <ChartCard title="Tendencia de Reportes (30d)"><LineChart /></ChartCard>
        <ChartCard title="Materiales más Reportados"><HorizontalBars /></ChartCard>

        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Reportes recientes</Text>
          </View>
          <View style={styles.recentList}>
            <RecentReportRow type="Aprovechable" location="Zona Central - Bloque L" time="Hoy, 14:30" />
            <View style={styles.recentDivider} />
            <RecentReportRow type="Peligroso" location="Laboratorio Química" time="Hoy, 12:15" />
            <View style={styles.recentDivider} />
            <RecentReportRow type="Orgánico" location="Comedor Estudiantil" time="Ayer, 18:45" />
            <View style={styles.recentDivider} />
            <RecentReportRow type="No Aprovechable" location="Zona Deportiva" time="Ayer, 10:20" />
            <View style={styles.recentDivider} />
            <RecentReportRow type="Aprovechable" location="Biblioteca General" time="22 Oct, 09:00" />
          </View>
        </View>

        <TouchableOpacity style={styles.pdfBtn} activeOpacity={0.85}>
          <MaterialIcons name="download" size={22} color={Colors.white} />
          <Text style={styles.pdfBtnText}>Descargar Reporte PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <MaterialIcons name="logout" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

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
  topHeaderSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
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
  logoutBtn: {
    marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 16,
    backgroundColor: Colors.dangerLight, borderWidth: 1, borderColor: '#C6282820',
  },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: Colors.danger },
});