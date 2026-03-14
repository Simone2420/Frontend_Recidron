import React, { useState } from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, FlatList,} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, WasteColors } from '../../styles/colors';
import { ReportCard } from '../../components/cards';

const FILTERS = ['Todos', 'Aprovechable', 'Peligroso', 'Orgánico', 'No Aprovechable'] as const;
type FilterType = typeof FILTERS[number];

type Report = {
  id: string;
  type: keyof typeof WasteColors;
  location: string;
  material: string;
  dateStr: string;
};

const MOCK_REPORTS: Report[] = [
  { id: '1', type: 'Aprovechable', location: 'Zona Norte - Parque Central', material: 'Plástico PET y Cartón', dateStr: 'Hoy, 10:30 AM' },
  { id: '2', type: 'Peligroso', location: 'Zona Industrial 4', material: 'Baterías y Químicos', dateStr: 'Ayer, 04:15 PM' },
  { id: '3', type: 'Orgánico', location: 'Barrio Miraflores', material: 'Residuos de Alimentos', dateStr: '22 Oct, 08:00 AM' },
  { id: '4', type: 'No Aprovechable', location: 'Centro Histórico', material: 'Papel higiénico y servilletas', dateStr: '21 Oct, 11:20 AM' },
  { id: '5', type: 'Aprovechable', location: 'Biblioteca General', material: 'Cartón y Papel', dateStr: '20 Oct, 09:00 AM' },
  { id: '6', type: 'Orgánico', location: 'Comedor Estudiantil', material: 'Residuos de cocina', dateStr: '19 Oct, 07:30 AM' },
];

export default function ReportsScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const filteredReports = MOCK_REPORTS.filter((report) => {
    const matchesFilter = activeFilter === 'Todos' || report.type === activeFilter;
    const matchesSearch =
      search === '' ||
      report.location.toLowerCase().includes(search.toLowerCase()) ||
      report.material.toLowerCase().includes(search.toLowerCase());
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
            placeholder="Buscar reportes por zona..."
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
          {filteredReports.length} reporte{filteredReports.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color={Colors.slate200} />
            <Text style={styles.emptyText}>No se encontraron reportes</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ReportCard
            type={item.type}
            location={item.location}
            material={item.material}
            dateStr={item.dateStr}
            onPress={() => router.push({ pathname: '/report-detail', params: { id: item.id } })}
          />
        )}
      />
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