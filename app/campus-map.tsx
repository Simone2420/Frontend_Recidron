import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image as RNImage } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { wasteService } from '../src/services/waste_service';
import { useTheme } from '../src/styles/theme';

// Importar nuestra imagen de mapa estático
const mapImage = require('../assets/images/campus_map.png');

// Mapeo de nombres de zonas a sus posiciones aproximadas X/Y en el mapa (porcentajes 0-100)
const ZONE_COORDINATES: Record<string, { x: number; y: number }> = {
  'Biblioteca': { x: 25, y: 30 },
  'Edificio A': { x: 30, y: 60 },
  'Edificio B': { x: 70, y: 60 },
  'Cafetería': { x: 50, y: 45 },
  'Zona Deportiva': { x: 80, y: 30 },
  'Parqueadero': { x: 50, y: 80 },
  'default': { x: 50, y: 50 },
};

export default function CampusMapScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const totalReports = reports.length;
  
  const mostCommonType = useMemo(() => {
    if (!reports || reports.length === 0) return 'Ninguno';
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      const type = r.tipo_nombre || 'Desconocido';
      counts[type] = (counts[type] || 0) + 1;
    });
    let max = 0;
    let mostCommon = 'Ninguno';
    for (const [type, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        mostCommon = type;
      }
    }
    return mostCommon;
  }, [reports]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Fetch más reportes para tener puntos en el mapa
      const data = await wasteService.getAllReports(0, 100);
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports for map:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoordinatesForZone = (zonaNombre: string, index: number) => {
    const baseCoords = ZONE_COORDINATES[zonaNombre] || ZONE_COORDINATES['default'];
    // Añadimos un pequeño "jitter" (desplazamiento) para que los puntos en la misma zona
    // no se superpongan exactamente unos sobre otros.
    const jitterX = (Math.sin(index * 13) * 5); // aprox -5 a +5 por ciento
    const jitterY = (Math.cos(index * 17) * 5);
    
    return {
      x: Math.max(5, Math.min(95, baseCoords.x + jitterX)),
      y: Math.max(5, Math.min(95, baseCoords.y + jitterY)),
    };
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 12, color: theme.slate500 }}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa del Campus</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapContainer}>
        {/* Resumen superior */}
        <View style={styles.topSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalReports}</Text>
            <Text style={styles.summaryLabel}>Total Reportes</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{mostCommonType}</Text>
            <Text style={styles.summaryLabel}>Más Frecuente</Text>
          </View>
        </View>

        {/* La imagen del mapa */}
        <RNImage source={mapImage} style={styles.mapImage} resizeMode="cover" />

        {/* Los puntos de los reportes sobre el mapa */}
        {reports.map((report, index) => {
          const coords = getCoordinatesForZone(report.zona_nombre || '', index);
          const isSelected = selectedReport?.id === report.id;

          return (
            <TouchableOpacity
              key={report.id || index}
              style={[
                styles.pointContainer,
                { left: `${coords.x}%`, top: `${coords.y}%` },
                isSelected && { zIndex: 10 }
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedReport(isSelected ? null : report)}
            >
              <View style={[styles.pointDot, isSelected && styles.pointDotSelected]} />
              
              {isSelected && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipTitle}>{report.tipo_nombre || 'Residuo'}</Text>
                  <Text style={styles.tooltipText} numberOfLines={1}>
                    {report.zona_nombre || 'Zona desconocida'}
                  </Text>
                  <Text style={styles.tooltipDate}>
                    {report.fecha_reporte ? new Date(report.fecha_reporte.replace(' ', 'T') + 'Z').toLocaleDateString() : 'Reciente'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Zonas Activas</Text>
          <Text style={styles.legendSubtitle}>
            Cada punto representa un reporte de residuos. Toca un punto para ver detalles.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.backgroundLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.slate200,
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.slate900 },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E8F5E9', 
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  topSummary: {
    position: 'absolute',
    top: 16,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.slate200,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.primary,
  },
  summaryLabel: {
    fontSize: 10,
    color: theme.slate500,
    textTransform: 'uppercase',
    marginTop: 2,
    fontWeight: '600',
  },
  pointContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    marginLeft: -15, 
    marginTop: -15, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E53935', // Rojo alerta
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  pointDotSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.primary,
  },
  tooltip: {
    position: 'absolute',
    bottom: 25,
    width: 130,
    backgroundColor: theme.card,
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  tooltipTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 2,
  },
  tooltipText: {
    fontSize: 10,
    color: theme.slate600,
    marginBottom: 2,
  },
  tooltipDate: {
    fontSize: 9,
    color: theme.slate400,
  },
  legend: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 4,
  },
  legendSubtitle: {
    fontSize: 12,
    color: theme.slate600,
    lineHeight: 18,
  },
});
