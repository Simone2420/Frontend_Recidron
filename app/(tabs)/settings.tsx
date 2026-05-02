import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Platform } from 'react-native';
import { useAuth } from '../../src/store/authStore';
import { Colors } from '../../src/styles/colors';
import { useTheme } from '../../src/styles/theme';

export default function SettingsScreen() {
  const { themeMode, setThemeMode, theme, isDark } = useTheme();
  const { logout } = useAuth();
  
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const THEME_OPTIONS = [
    { label: 'Sistema', value: 'system', icon: 'settings-suggest' },
    { label: 'Claro', value: 'light', icon: 'light-mode' },
    { label: 'Oscuro', value: 'dark', icon: 'dark-mode' },
  ];

  const getThemeIcon = () => {
    if (themeMode === 'system') return 'settings-suggest';
    if (themeMode === 'dark') return 'dark-mode';
    return 'light-mode';
  };

  const getThemeLabel = () => {
    if (themeMode === 'system') return 'Sistema';
    if (themeMode === 'dark') return 'Oscuro';
    return 'Claro';
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundLight }]}>
      <View style={[styles.header, { backgroundColor: theme.backgroundLight }]}>
        <Text style={[styles.headerTitle, { color: theme.slate900 }]}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.slate500 }]}>APARIENCIA</Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, { backgroundColor: theme.white, borderColor: theme.slate100 }]} 
            activeOpacity={0.7}
            onPress={() => setThemeModalVisible(true)}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: theme.slate100 }]}>
                <MaterialIcons name={getThemeIcon()} size={20} color={theme.slate700} />
              </View>
              <Text style={[styles.settingLabel, { color: theme.slate900 }]}>Tema de la aplicación</Text>
            </View>
            <View style={styles.settingRowRight}>
              <Text style={[styles.settingValue, { color: theme.slate500 }]}>{getThemeLabel()}</Text>
              <MaterialIcons name="chevron-right" size={20} color={theme.slate400} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingRow, { backgroundColor: theme.white, borderColor: theme.slate100, marginTop: 16 }]} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: Colors.dangerLight }]}>
                <MaterialIcons name="logout" size={20} color={Colors.danger} />
              </View>
              <Text style={[styles.settingLabel, { color: Colors.danger, fontWeight: 'bold' }]}>Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modal para seleccionar el tema */}
      <Modal
        visible={themeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setThemeModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.white }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.slate100 }]}>
              <Text style={[styles.modalTitle, { color: theme.slate900 }]}>Elige un tema</Text>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.slate400} />
              </TouchableOpacity>
            </View>

            {THEME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.themeOptionBtn, 
                  { borderBottomColor: theme.slate100 },
                  themeMode === opt.value && { backgroundColor: theme.primaryLight }
                ]}
                onPress={() => {
                  setThemeMode(opt.value as any);
                  setThemeModalVisible(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <MaterialIcons 
                    name={opt.icon as any} 
                    size={22} 
                    color={themeMode === opt.value ? theme.primary : theme.slate500} 
                  />
                  <Text style={[
                    styles.themeOptionText, 
                    { color: themeMode === opt.value ? theme.primary : theme.slate700 },
                    themeMode === opt.value && { fontWeight: 'bold' }
                  ]}>
                    {opt.label}
                  </Text>
                </View>
                {themeMode === opt.value && (
                  <MaterialIcons name="check-circle" size={22} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: -0.5 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginLeft: 12, letterSpacing: 0.5 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  settingRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  settingRowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValue: { fontSize: 14 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingHorizontal: 20, paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  themeOptionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderRadius: 12 },
  themeOptionText: { fontSize: 16 },
});
