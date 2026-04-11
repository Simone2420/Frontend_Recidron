import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Colors } from '../../src/styles/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const userName = 'Usuario de Prueba';
  const userInitials = 'CP';
  const userRole = user?.role === 'admin' ? 'Administrador' : 'Invitado';
  const reportCount = 128;
  const memberSince = 'Oct 2023';

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity style={styles.headerMenuBtn}>
          <MaterialIcons name="more-vert" size={24} color={Colors.slate900} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{userRole}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>REPORTES{'\n'}ENVIADOS</Text>
            <Text style={styles.statValueGreen}>{reportCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MIEMBRO{'\n'}DESDE</Text>
            <Text style={styles.statValueDark}>{memberSince}</Text>
          </View>
        </View>

        <View style={styles.optionsList}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push('/(tabs)/reports')}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconWrapper}>
                <MaterialIcons name="description" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.optionText}>Mis Reportes</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.slate400} />
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <MaterialIcons name="logout" size={20} color={Colors.danger} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundLight,
  },
  headerBackBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.slate900, letterSpacing: -0.3 },
  headerMenuBtn: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  scrollContent: { paddingBottom: 32 },
  profileSection: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  avatarCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2, borderColor: Colors.primaryBorder,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: Colors.primary },
  userName: { fontSize: 22, fontWeight: 'bold', color: Colors.slate900, letterSpacing: -0.3, textAlign: 'center', marginBottom: 4 },
  userEmail: { fontSize: 15, fontWeight: '500', color: Colors.primary, textAlign: 'center' },
  badgeRow: { alignItems: 'center', paddingVertical: 8 },
  roleBadge: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999,
    backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primaryBorder,
  },
  roleBadgeText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  statsGrid: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingVertical: 8 },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: Colors.primaryBorder,
    shadowColor: Colors.slate900, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, gap: 8,
  },
  statLabel: { fontSize: 11, fontWeight: '500', color: Colors.slate500, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 16 },
  statValueGreen: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, letterSpacing: -0.5 },
  statValueDark: { fontSize: 22, fontWeight: 'bold', color: Colors.slate900, letterSpacing: -0.5 },
  optionsList: { paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  optionItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.slate100,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIconWrapper: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  optionText: { fontSize: 15, fontWeight: '600', color: Colors.slate900 },
  spacer: { height: 32 },
  logoutWrapper: { paddingHorizontal: 16 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 16,
    backgroundColor: Colors.dangerLight, borderWidth: 1, borderColor: '#C6282820',
  },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: Colors.danger },
});