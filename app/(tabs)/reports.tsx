import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { ReportCard } from '../../src/components/cards';
import { getAllReports, getReportsByUser } from '../../src/services/database';
import { useAuth } from '../../src/store/authStore';
import { Colors, WasteColors } from '../../src/styles/colors';
import { WasteReport } from '../../src/types/report';

const FILTERS = ['Todos', 'Aprovechable', 'Peligroso', 'Orgánico', 'No Aprovechable'] as const;
type FilterType = typeof FILTERS[number];

export default function ReportsScreen() {
  const { user } = useAuth();
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: WasteReport[] = [];
      if (user?.role === 'admin') {
        data = await getAllReports();
      } else if (user?.email) {
        data = await getReportsByUser(user.email);
      }
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const filteredReports = reports.filter((report) => {
    const matchesFilter = activeFilter === 'Todos' || report.category === activeFilter;
    const matchesSearch =
      search === '' ||
      report.zone.toLowerCase().includes(search.toLowerCase()) ||
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
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadReports}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color={Colors.slate200} />
            <Text style={styles.emptyText}>No se encontraron reportes</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ReportCard
            type={item.category}
            location={item.zone}
            material={item.material}
            dateStr={new Date(item.createdAt).toLocaleDateString() === new Date().toLocaleDateString() 
              ? `Hoy, ${new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : new Date(item.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
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