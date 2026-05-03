import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';;
import { ReportCard } from '../../src/components/cards';
import { useTheme } from '../../src/styles/theme';
import { WasteColors } from '../../src/styles/colors';
import { wasteService, WasteReport } from '../../src/services/waste_service';
import { userService } from '../../src/services/user_service';
import { useAuth } from '../../src/store/authStore';
const TYPE_FILTERS = ['Todos', 'Aprovechable', 'Peligroso', 'Orgánico', 'No Aprovechable'] as const;
type FilterType = typeof TYPE_FILTERS[number] | 'Mis Reportes';

// Puedes mantener MOCK_REPORTS como fallback si falla la red
const MOCK_REPORTS: WasteReport[] = [
  { id: '1', type: 'Aprovechable', location: 'Zona Norte - Parque Central', material: 'Plástico PET y Cartón', dateStr: 'Hoy, 10:30 AM' },
  { id: '2', type: 'Peligroso', location: 'Zona Industrial 4', material: 'Baterías y Químicos', dateStr: 'Ayer, 04:15 PM' },
  { id: '3', type: 'Orgánico', location: 'Barrio Miraflores', material: 'Residuos de Alimentos', dateStr: '22 Oct, 08:00 AM' },
];

export default function ReportsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const [reports, setReports] = useState<any[]>([]); // Usamos any temporalmente para las nuevas propiedades del back
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!user) return;
    fetchReports();
    userService.getProfile()
      .then((profile) => setCurrentUserId(Number(profile.id)))
      .catch(() => setCurrentUserId(null));
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await wasteService.getAllReports(0, LIMIT);
      setReports(data || []);
      setSkip(0);
      setHasMore((data || []).length === LIMIT);
    } catch (e) {
      console.error('Error fetching reports:', e);
      setReports([]); // No mostramos mock por defecto si el usuario prefiere ver la realidad
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreReports = async () => {
    if (isFetchingMore || !hasMore || isLoading) return;
    setIsFetchingMore(true);
    const nextSkip = skip + LIMIT;
    try {
      const data = await wasteService.getAllReports(nextSkip, LIMIT);
      if (data && data.length > 0) {
        setReports((prev) => [...prev, ...data]);
        setSkip(nextSkip);
        if (data.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Error fetching more reports:', e);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const typeLabel = report.tipo_nombre || 'General';
    let matchesFilter: boolean;
    if (activeFilter === 'Mis Reportes') {
      matchesFilter = currentUserId !== null && Number(report.usuario_id) === currentUserId;
    } else {
      matchesFilter = activeFilter === 'Todos' || typeLabel === activeFilter;
    }
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
          <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={22} color={theme.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por zona o material..."
            placeholderTextColor={theme.slate400}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={20} color={theme.slate400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={{ overflow: 'visible' }}
        >
          {/* Filtro especial: Mis Reportes */}
          {!isAdmin && (
            <TouchableOpacity
              style={[styles.filterChip, styles.filterChipMine, activeFilter === 'Mis Reportes' && styles.filterChipMineActive]}
              onPress={() => setActiveFilter('Mis Reportes')}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="person"
                size={14}
                color={activeFilter === 'Mis Reportes' ? theme.white : theme.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.filterChipText, activeFilter === 'Mis Reportes' && styles.filterChipTextActive]}>Mis Reportes</Text>
            </TouchableOpacity>
          )}

          {/* Filtros por tipo */}
          {TYPE_FILTERS.map((filter) => {
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
          <View style={{ width: 16 }} />
        </ScrollView>
      </View>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filteredReports.length} reporte{filteredReports.length !== 1 ? 's' : ''} encontrados
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreReports}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name={activeFilter === 'Mis Reportes' ? 'person-outline' : 'inventory'}
                size={48}
                color={theme.slate200}
              />
              <Text style={styles.emptyText}>
                {activeFilter === 'Mis Reportes'
                  ? 'Aún no tienes reportes.'
                  : 'No hay reportes con este filtro.'}
              </Text>
              <Text style={styles.emptySubText}>
                {activeFilter === 'Mis Reportes'
                  ? '¡Anímate a hacer tu primer reporte!'
                  : 'Prueba cambiando el filtro o la búsqueda.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ReportCard
              type={item.tipo_nombre as any}
              location={item.zona_nombre}
              material={item.material_nombre}
              dateStr={item.fecha_reporte ? new Date(item.fecha_reporte.replace(' ', 'T') + 'Z').toLocaleDateString() : 'Recientemente'}
              onPress={() => router.push({ pathname: '/report-detail', params: { id: item.id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.backgroundLight },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: theme.slate900, letterSpacing: -0.3 },
  headerSpacer: { width: 40 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.white,
    borderRadius: 16, borderWidth: 2, borderColor: theme.primaryBorder,
    paddingHorizontal: 12, height: 48, gap: 8,
  },
  searchIcon: { marginRight: 4 },
  searchInput: { flex: 1, fontSize: 15, color: theme.slate900, height: '100%' },
  filtersWrapper: { paddingVertical: 4 },
  filtersContainer: { paddingHorizontal: 16, paddingVertical: 4, alignItems: 'center' },
  filterChip: {
    height: 36, paddingHorizontal: 16, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.primaryLight, borderWidth: 1, borderColor: theme.primaryBorder,
    marginRight: 8, flexShrink: 0,
  },
  filterChipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  filterChipText: { fontSize: 13, fontWeight: '500', color: theme.primary },
  filterChipTextActive: { fontWeight: '700', color: theme.white },
  resultsRow: { paddingHorizontal: 16, paddingBottom: 4 },
  resultsText: { fontSize: 12, color: theme.slate400, fontWeight: '500' },
  filterChipMine: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  filterChipMineActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 64, gap: 12 },
  emptyText: { fontSize: 15, color: theme.slate400, fontWeight: '500' },
  emptySubText: { fontSize: 13, color: theme.slate400, textAlign: 'center' },
});