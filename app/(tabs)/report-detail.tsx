import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';

export default function ReportDetailScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Reporte</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="share" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. Identificación */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="fingerprint" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Identificación</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Reporte ID</Text>
              <Text style={styles.cardValueMono}>#REC-98234-AX</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Fecha y Hora</Text>
              <Text style={styles.cardValue}>24 Oct, 2023 • 14:30</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Reportado por</Text>
              <View style={styles.cardUserRow}>
                <Text style={styles.cardValue}>Usuario de Prueba</Text>
                <View style={styles.cardUserAvatar}>
                  <MaterialIcons name="person" size={14} color={Colors.primary} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Clasificación del residuo */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="category" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Clasificación del residuo</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.classGrid}>
              <View style={styles.classCell}>
                <Text style={styles.classLabel}>TIPO</Text>
                <View style={styles.classBadge}>
                  <Text style={styles.classBadgeText}>Plásticos</Text>
                </View>
              </View>
              <View style={styles.classCell}>
                <Text style={styles.classLabel}>MATERIAL</Text>
                <View style={styles.classMaterialRow}>
                  <MaterialIcons name="recycling" size={18} color={Colors.primary} />
                  <Text style={styles.classValue}>PET / HDPE</Text>
                </View>
              </View>
              <View style={[styles.classCell, styles.classCellFull]}>
                <Text style={styles.classLabel}>TAMAÑO ESTIMADO</Text>
                <Text style={styles.classValue}>Mediano (2-5kg)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Ubicación */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="explore" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Ubicación</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconWrapper}>
                <MaterialIcons name="place" size={22} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.locationName}>Zona Reserva</Text>
                <Text style={styles.locationSub}>Sector Norte - Cuadrante B12</Text>
              </View>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.coordsGrid}>
              <View style={styles.coordCell}>
                <Text style={styles.classLabel}>COORDENADAS</Text>
                <Text style={styles.cardValueMono}>19.4326° N{'\n'}99.1332° W</Text>
              </View>
              <View style={styles.coordCell}>
                <Text style={styles.classLabel}>PRECISIÓN</Text>
                <View style={styles.classMaterialRow}>
                  <MaterialIcons name="gps-fixed" size={16} color={Colors.primary} />
                  <Text style={styles.cardValue}>+/- 2.4 m</Text>
                </View>
              </View>
              <View style={styles.coordCell}>
                <Text style={styles.classLabel}>ALTITUD</Text>
                <Text style={styles.cardValue}>2,240 msnm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Descripción */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="description" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Descripción</Text>
          </View>
          <View style={styles.descriptionBlock}>
            <Text style={styles.descriptionText}>
              "Se localizó un cúmulo de envases plásticos cerca del cauce del río. El material
              parece llevar varios meses en el lugar debido al desgaste solar. No se detectan
              olores químicos, principalmente residuos domésticos."
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>INTERNAL REGISTRY SYSTEM</Text>
          <Text style={styles.footerText}>Reference: ID-98234-AX-2023-V1</Text>
          <Text style={styles.footerText}>Endpoint: api.recidron.io/v1/reports/fetch/98234</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBorder,
    backgroundColor: Colors.backgroundLight,
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
    color: Colors.slate900,
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
    color: Colors.slate900,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.primaryBorder,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primary,
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.slate900,
  },
  cardValueMono: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: Colors.slate900,
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
    backgroundColor: Colors.primaryLight,
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
    color: Colors.primary,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  classBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  classMaterialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.slate900,
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
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.slate900,
  },
  locationSub: {
    fontSize: 12,
    color: Colors.primary,
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
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.slate700,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryBorder,
    gap: 4,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 11,
    color: Colors.slate400,
    textAlign: 'center',
  },
});