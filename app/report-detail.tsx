import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { userService } from '../src/services/user_service';
import { WasteReport, wasteService } from '../src/services/waste_service';

import {
  ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';;
import { useTheme } from '../src/styles/theme';

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'Sin fecha';
  try {
    const date = new Date(dateStr.replace(' ', 'T') + 'Z');
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export default function ReportDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<WasteReport | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [zone, setZone] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [reporter, setReporter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const reportData = await wasteService.getReportById(Number(id));
        setReport(reportData);
        const [typeData, materialData, zoneData, sizeData] = await Promise.all([
          wasteService.getTypeById(reportData.tipo_residuo_id),
          wasteService.getMaterialById(reportData.material_id),
          wasteService.getZoneById(reportData.zona_id),
          wasteService.getSizeById(reportData.tamano_id),
        ]);
        setType(typeData.nombre_tipo);
        setMaterial(materialData.nombre_material);
        setZone(zoneData.nombre_zona);
        setSize(sizeData.nombre_tamano);
        try {
          const userData = await userService.getUserById(reportData.usuario_id);
          setReporter(userData.nombre || `Usuario #${reportData.usuario_id}`);
        } catch {
          setReporter(`Usuario #${reportData.usuario_id}`);
        }
      } catch (error) {
        console.error("Error al obtener el reporte:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]); 
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Reporte</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="share" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 1. Identificación */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="fingerprint" size={22} color={theme.primary} />
              <Text style={styles.sectionTitle}>Identificación</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>ID</Text>
                <Text style={styles.cardValueMono}>{report?.id}</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Fecha y Hora</Text>
                <Text style={styles.cardValue}>{formatDate(report?.fecha_reporte)}</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Reportado por</Text>
                <View style={styles.cardUserRow}>
                  <View style={styles.cardUserAvatar}>
                    <MaterialIcons name="person" size={14} color={theme.primary} />
                  </View>
                  <Text style={styles.cardValue}>{reporter ?? `#${report?.usuario_id}`}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2. Clasificación del residuo */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="category" size={22} color={theme.primary} />
              <Text style={styles.sectionTitle}>Clasificación del residuo</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.classGrid}>
                <View style={styles.classCell}>
                  <Text style={styles.classLabel}>TIPO</Text>
                  <View style={styles.classBadge}>
                    <Text style={styles.classBadgeText}>{type}</Text>
                  </View>
                </View>
                <View style={styles.classCell}>
                  <Text style={styles.classLabel}>MATERIAL</Text>
                  <View style={styles.classMaterialRow}>
                    <MaterialIcons name="recycling" size={18} color={theme.primary} />
                    <Text style={styles.classValue}>{material}</Text>
                  </View>
                </View>
                <View style={[styles.classCell, styles.classCellFull]}>
                  <Text style={styles.classLabel}>TAMAÑO ESTIMADO</Text>
                  <Text style={styles.classValue}>{size}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. Ubicación */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="explore" size={22} color={theme.primary} />
              <Text style={styles.sectionTitle}>Ubicación</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.locationHeader}>
                <View style={styles.locationIconWrapper}>
                  <MaterialIcons name="place" size={22} color={theme.primary} />
                </View>
                <View>
                  <Text style={styles.locationName}>Zona: {zone}</Text>
                  <Text style={styles.locationSub}>Localización registrada</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.coordsGrid}>
                <View style={styles.coordCell}>
                  <Text style={styles.classLabel}>COORDENADAS</Text>
                  <Text style={styles.cardValueMono}>No especificada</Text>
                </View>
                <View style={styles.coordCell}>
                  <Text style={styles.classLabel}>PRECISIÓN</Text>
                  <View style={styles.classMaterialRow}>
                    <MaterialIcons name="gps-fixed" size={16} color={theme.primary} />
                    <Text style={styles.cardValue}>No especificada</Text>
                  </View>
                </View>
                <View style={styles.coordCell}>
                  <Text style={styles.classLabel}>ALTITUD</Text>
                  <Text style={styles.cardValue}>No especificada</Text>
                </View>
              </View>
            </View>
          </View> 

          {/* 4. Descripción */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="description" size={22} color={theme.primary} />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <View style={styles.descriptionBlock}>
              <Text style={styles.descriptionText}>
                {report?.descripcion || "Sin descripción proporcionada."}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerLabel}>RECIDRON · SISTEMA DE REPORTES</Text>
            <Text style={styles.footerText}>Reporte #{id}</Text>
            <Text style={styles.footerText}>{formatDate(report?.fecha_reporte)}</Text>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.primaryBorder,
    backgroundColor: theme.backgroundLight,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.slate900,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.slate900,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: theme.primaryBorder,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.primary,
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.slate900,
  },
  cardValueMono: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: theme.slate900,
  },
  cardUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardUserAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  classCell: {
    flex: 1,
    minWidth: '40%',
    gap: 6,
  },
  classCellFull: {
    flexBasis: '100%',
    flex: 0,
  },
  classLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.primary,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  classBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.primary,
  },
  classMaterialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classValue: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.slate900,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  locationIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.slate900,
  },
  locationSub: {
    fontSize: 12,
    color: theme.primary,
    opacity: 0.7,
  },
  coordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 12,
  },
  coordCell: {
    gap: 4,
    minWidth: '40%',
  },
  descriptionBlock: {
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    paddingLeft: 16,
    paddingVertical: 8,
    backgroundColor: theme.primaryLight,
    borderRadius: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.slate700,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.primaryBorder,
    gap: 4,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.primary,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 11,
    color: theme.slate400,
    textAlign: 'center',
  },
});