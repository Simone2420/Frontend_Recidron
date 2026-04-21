import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ReportCard } from '../../src/components/cards';
import { Colors, WasteColors } from '../../src/styles/colors';
import { wasteService, WasteReport } from '../../src/services/waste_service';

const FILTERS = ['Todos', 'Aprovechable', 'Peligroso', 'Orgánico', 'No Aprovechable'] as const;
type FilterType = typeof FILTERS[number];

// Puedes mantener MOCK_REPORTS como fallback si falla la red
const MOCK_REPORTS: WasteReport[] = [
  { id: '1', type: 'Aprovechable', location: 'Zona Norte - Parque Central', material: 'Plástico PET y Cartón', dateStr: 'Hoy, 10:30 AM' },
  { id: '2', type: 'Peligroso', location: 'Zona Industrial 4', material: 'Baterías y Químicos', dateStr: 'Ayer, 04:15 PM' },
  { id: '3', type: 'Orgánico', location: 'Barrio Miraflores', material: 'Residuos de Alimentos', dateStr: '22 Oct, 08:00 AM' },
];

export default function ReportsScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const [reports, setReports] = useState<any[]>([]); // Usamos any temporalmente para las nuevas propiedades del back
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await wasteService.getAllReports();
      setReports(data || []);
    } catch (e) {
      console.error('Error fetching reports:', e);
      setReports([]); // No mostramos mock por defecto si el usuario prefiere ver la realidad
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    // Ajustamos filtros a los nuevos nombres del backend
    const typeLabel = report.tipo_nombre || 'General';
    const matchesFilter = activeFilter === 'Todos' || typeLabel === activeFilter;
    const matchesSearch =
      search === '' ||
      (report.zona_nombre || '').toLowerCase().includes(search.toLowerCase()) ||
      (report.material_nombre || '').toLowerCase().includes(search.toLowerCase()) ||
      (report.descripcion || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={22} color={Colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por zona o material..."
            placeholderTextColor={Colors.slate400}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={20} color={Colors.slate400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{filter}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filteredReports.length} reporte{filteredReports.length !== 1 ? 's' : ''} encontrados
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inventory" size={48} color={Colors.slate200} />
              <Text style={styles.emptyText}>Aún no se han registrado reportes.</Text>
              <Text style={styles.emptySubText}>¡Sé el primero en reportar un residuo!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ReportCard
              type={item.tipo_nombre as any}
              location={item.zona_nombre}
              material={item.material_nombre}
              dateStr={item.fecha_reporte ? new Date(item.fecha_reporte).toLocaleDateString() : 'Recientemente'}
              onPress={() => router.push({ pathname: '/report-detail', params: { id: item.id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.backgroundLight },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.slate900, letterSpacing: -0.3 },
  headerSpacer: { width: 40 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 16, borderWidth: 2, borderColor: Colors.primaryBorder,
    paddingHorizontal: 12, height: 48, gap: 8,
  },
  searchIcon: { marginRight: 4 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.slate900, height: '100%' },
  filtersContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  filterChip: {
    height: 36, paddingHorizontal: 20, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primaryBorder,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '500', color: Colors.primary },
  filterChipTextActive: { fontWeight: '700', color: Colors.white },
  resultsRow: { paddingHorizontal: 16, paddingBottom: 4 },
  resultsText: { fontSize: 12, color: Colors.slate400, fontWeight: '500' },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 64, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.slate400, fontWeight: '500' },
});