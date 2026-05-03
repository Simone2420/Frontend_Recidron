import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';;
import { useAuth } from '../../src/store/authStore';
import { useTheme } from '../../src/styles/theme';
import { Button, InputField } from '../../src/components/ui';
import { userService } from '../../src/services/user_service';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { user, logout, setUser } = useAuth();

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [reportCount, setReportCount] = useState('0');
  const [memberSince, setMemberSince] = useState('...');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const profile = await userService.getProfile();
        setEditName(profile.nombre || 'Usuario');
        setEditEmail(profile.email || user?.email || '');
        
        if (profile.creado_en) {
          // Reemplazo el espacio por 'T' para asegurar compatibilidad ISO en React Native (Hermes/JSC)
          const isoDate = profile.creado_en.replace(' ', 'T');
          const date = new Date(isoDate);
          if (!isNaN(date.getTime())) {
            setMemberSince(date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }));
          } else {
            setMemberSince('Reciente');
          }
        }

        const dashboard = await userService.getUserDashboard();
        if (dashboard && dashboard.stats && dashboard.stats.length > 0) {
          // Buscamos el valor de "Mis Reportes"
          const totalStat = dashboard.stats.find((s: any) => s.title === "Mis Reportes");
          if (totalStat) setReportCount(totalStat.value);
        }
      } catch (err) {
        console.log('Error al cargar perfil o stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  const userName = editName || user?.nombre || 'Usuario';
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userRole = user?.role === 'admin' ? 'Administrador' : 'Estudiante'; 

  const handleSave = async () => {
    setSaveError(null);

    // Validaciones locales antes de llamar al backend
    if (editPassword || editConfirmPassword) {
      if (!editPassword || !editConfirmPassword) {
        setSaveError('Debes completar ambos campos de contraseña.');
        return;
      }
      if (editPassword !== editConfirmPassword) {
        setSaveError('Las contraseñas no coinciden.');
        return;
      }
      if (editPassword.length < 8) {
        setSaveError('La contraseña debe tener mínimo 8 caracteres.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const dataToUpdate: any = {
        nombre: editName,
        email:  editEmail,
      };
      if (editPassword) {
        dataToUpdate.nueva_password    = editPassword;
        dataToUpdate.confirmar_password = editConfirmPassword;
      }
      await userService.updateProfile(dataToUpdate);

      // Actualizar el estado global del store
      setUser({ ...user!, nombre: editName, email: editEmail });

      setIsEditVisible(false);
      setEditPassword('');
      setEditConfirmPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Error al actualizar el perfil.';
      setSaveError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsSaving(false);
    }
  };

  const isPasswordWeak   = editPassword.length > 0 && editPassword.length < 8;
  const isPasswordStrong = editPassword.length >= 8;
  const passwordMismatch = editConfirmPassword.length > 0 && editPassword !== editConfirmPassword;
  const passwordMatch    = editConfirmPassword.length > 0 && editPassword === editConfirmPassword && isPasswordStrong;

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity style={styles.headerMenuBtn}>
          <MaterialIcons name="more-vert" size={24} color={theme.slate900} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 60 }} />
        ) : (
          <>
            <View style={styles.profileSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userInitials}</Text>
              </View>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{editEmail}</Text>
            </View>

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{userRole}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {user?.role !== 'admin' && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>REPORTES{'\n'}ENVIADOS</Text>
              <Text style={styles.statValueGreen}>{reportCount}</Text>
            </View>
          )}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MIEMBRO{'\n'}DESDE</Text>
            <Text style={styles.statValueDark}>{memberSince}</Text>
          </View>
        </View>

        <View style={styles.optionsList}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setIsEditVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconWrapper}>
                <MaterialIcons name="person-outline" size={22} color={theme.primary} />
              </View>
              <Text style={styles.optionText}>Editar Perfil y Seguridad</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.slate400} />
          </TouchableOpacity>
          {user?.role === 'admin' ? (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push('/admin-users')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconWrapper}>
                  <MaterialIcons name="people" size={22} color={theme.primary} />
                </View>
                <Text style={styles.optionText}>Gestión de Usuarios y Roles</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.slate400} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push('/(tabs)/reports')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconWrapper}>
                  <MaterialIcons name="description" size={22} color={theme.primary} />
                </View>
                <Text style={styles.optionText}>Mis Reportes</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.slate400} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.spacer} />

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <MaterialIcons name="logout" size={20} color={theme.danger} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
          </>
        )}
      </ScrollView>

      {/* BOTTOM SHEET: Editar Perfil */}
      <Modal
        visible={isEditVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Ajustes de Perfil</Text>
              <TouchableOpacity onPress={() => setIsEditVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={22} color={theme.slate900} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sheetSubtitle}>Modifica tu identidad y protege tu cuenta.</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetForm}>
              <InputField
                label="Nombre Público"
                icon="person"
                value={editName}
                onChangeText={setEditName}
              />
              <InputField
                label="Correo de Notificaciones"
                icon="mail"
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <View style={styles.separator} />

              <InputField
                label="Nueva Contraseña (opcional)"
                icon="lock"
                value={editPassword}
                onChangeText={setEditPassword}
                secureTextEntry
                placeholder="Escribe tu nueva clave"
                error={isPasswordWeak ? 'Insegura: mínimo 8 caracteres.' : undefined}
              />
              {isPasswordStrong && (
                <Text style={styles.passwordSuccessText}>✓ Nivel de seguridad óptimo</Text>
              )}

              <InputField
                label="Confirmar Nueva Contraseña"
                icon="lock"
                value={editConfirmPassword}
                onChangeText={setEditConfirmPassword}
                secureTextEntry
                placeholder="Repite tu nueva clave"
                error={passwordMismatch ? 'Las contraseñas no coinciden.' : undefined}
              />
              {passwordMatch && (
                <Text style={styles.passwordSuccessText}>✓ Las contraseñas coinciden</Text>
              )}

              {saveError && (
                <Text style={styles.errorText}>{saveError}</Text>
              )}

              <Button
                title="Actualizar Datos"
                onPress={handleSave}
                isLoading={isSaving}
                style={styles.saveBtn}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
    paddingVertical: 12,
    backgroundColor: theme.backgroundLight,
  },
  headerBackBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.slate900, letterSpacing: -0.3 },
  headerMenuBtn: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  scrollContent: { paddingBottom: 32 },
  profileSection: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  avatarCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: theme.primaryLight,
    borderWidth: 2, borderColor: theme.primaryBorder,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: theme.primary },
  userName: { fontSize: 22, fontWeight: 'bold', color: theme.slate900, letterSpacing: -0.3, textAlign: 'center', marginBottom: 4 },
  userEmail: { fontSize: 15, fontWeight: '500', color: theme.primary, textAlign: 'center' },
  badgeRow: { alignItems: 'center', paddingVertical: 8 },
  roleBadge: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999,
    backgroundColor: theme.primaryLight, borderWidth: 1, borderColor: theme.primaryBorder,
  },
  roleBadgeText: { fontSize: 13, fontWeight: '600', color: theme.primary },
  statsGrid: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingVertical: 8 },
  statCard: {
    flex: 1, backgroundColor: theme.white, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: theme.primaryBorder,
    shadowColor: theme.slate900, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, gap: 8,
  },
  statLabel: { fontSize: 11, fontWeight: '500', color: theme.slate500, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 16 },
  statValueGreen: { fontSize: 28, fontWeight: 'bold', color: theme.primary, letterSpacing: -0.5 },
  statValueDark: { fontSize: 22, fontWeight: 'bold', color: theme.slate900, letterSpacing: -0.5 },
  optionsList: { paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  optionItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.white, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: theme.slate100,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIconWrapper: { width: 40, height: 40, borderRadius: 10, backgroundColor: theme.primaryLight, alignItems: 'center', justifyContent: 'center' },
  optionText: { fontSize: 15, fontWeight: '600', color: theme.slate900 },
  spacer: { height: 32 },
  logoutWrapper: { paddingHorizontal: 16 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 16,
    backgroundColor: theme.dangerLight, borderWidth: 1, borderColor: '#C6282820',
  },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: theme.danger },

  // --- Estilos del Bottom Sheet ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.slate900,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: theme.slate100,
    borderRadius: 16,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: theme.slate500,
    marginBottom: 20,
  },
  sheetForm: {
    paddingBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: theme.slate200,
    marginVertical: 16,
  },
  saveBtn: {
    marginTop: 24,
  },
  passwordSuccessText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '600',
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
});