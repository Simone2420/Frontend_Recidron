import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors } from '../src/styles/colors';
import { userService, UserProfile } from '../src/services/user_service';
import { useAuth } from '../src/store/authStore';
import api from '../src/services/base_service';
import Toast from 'react-native-toast-message';

export default function AdminUsersScreen() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const isSuperAdmin = currentUser?.email === 'admin@recidron.com';

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // IDs reales de los roles (vienen del backend, no se asumen)
  const [adminRoleId, setAdminRoleId] = useState<number | null>(null);
  const [autorRoleId, setAutorRoleId] = useState<number | null>(null);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // Carga los IDs reales de roles desde el backend (nunca se asumen como 1 y 2)
  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles/');
      const roles: any[] = response.data || [];
      const adminRol = roles.find((r: any) => r.nombre_rol === 'admin');
      const autorRol = roles.find((r: any) => r.nombre_rol === 'autor');
      if (adminRol) setAdminRoleId(adminRol.id);
      if (autorRol) setAutorRoleId(autorRol.id);
    } catch (err) {
      console.error('Error al obtener roles:', err);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRole = async (user: UserProfile & { rol_id?: number, nombre_rol?: string }) => {
    const isCurrentlyAdmin = user.nombre_rol === 'admin';

    // Evitar revocar al administrador maestro identificándolo por su correo principal
    if (isCurrentlyAdmin && user.email === 'admin@recidron.com') {
      Toast.show({
        type: 'error',
        text1: 'Acción no permitida',
        text2: 'No se pueden revocar los permisos del administrador maestro.',
      });
      return;
    }

    // Usar los IDs reales obtenidos de la BD
    const newRoleId = isCurrentlyAdmin
      ? (autorRoleId ?? user.rol_id)  // bajar a autor
      : (adminRoleId ?? user.rol_id); // subir a admin

    const actionText = isCurrentlyAdmin ? 'Revocar permisos de Administrador' : 'Ascender a Administrador';

    Alert.alert(
      "Confirmar Acción",
      `¿Deseas ${actionText} a ${user.full_name || (user as any).nombre || user.email}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          style: isCurrentlyAdmin ? "destructive" : "default",
          onPress: async () => {
            setIsUpdatingRole(true);
            try {
              if (user.id) {
                await userService.changeUserRole(typeof user.id === 'string' ? parseInt(user.id) : user.id, newRoleId);
                
                if (isCurrentlyAdmin && (user.id === currentUser?.id || String(user.id) === String(currentUser?.id))) {
                  Alert.alert(
                    "Permisos revocados", 
                    "Te has revocado los permisos de administrador. Tu sesión se cerrará.",
                    [{
                      text: "OK", 
                      onPress: () => {
                        logout();
                        router.replace('/(auth)/login');
                      }
                    }]
                  );
                } else {
                  await fetchUsers();
                  Toast.show({
                    type: 'success',
                    text1: '¡Rol actualizado!',
                    text2: `Se han modificado los permisos de ${user.nombre || user.email}.`,
                  });
                }
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo actualizar el rol. Inténtalo de nuevo.',
              });
            } finally {
              setIsUpdatingRole(false);
            }
          }
        }
      ]
    );
  };

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    const name = u.nombre || (u as any).full_name || '';
    return name.toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query);
  });

  const handleToggleActive = async (user: UserProfile) => {
    Alert.alert(
      "Confirmar Acción",
      `¿Deseas ${user.es_activo ? 'desactivar' : 'activar'} la cuenta de ${user.nombre || user.email}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          style: user.es_activo ? "destructive" : "default",
          onPress: async () => {
            setIsUpdatingRole(true);
            try {
              if (user.id) {
                await userService.updateUser(typeof user.id === 'string' ? parseInt(user.id) : user.id, { es_activo: !user.es_activo });
                Toast.show({ type: 'success', text1: `Cuenta ${user.es_activo ? 'desactivada' : 'activada'}` });
                fetchUsers();
              }
            } catch (err) {
              Toast.show({ type: 'error', text1: 'Error al actualizar cuenta' });
            } finally {
              setIsUpdatingRole(false);
            }
          }
        }
      ]
    );
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editingUser.id) return;
    
    if (editPassword || editConfirmPassword) {
      if (editPassword !== editConfirmPassword) {
        Toast.show({ type: 'error', text1: 'Las contraseñas no coinciden' });
        return;
      }
      if (editPassword.length < 8) {
        Toast.show({ type: 'error', text1: 'La contraseña debe tener al menos 8 caracteres' });
        return;
      }
    }

    setIsUpdatingRole(true);
    try {
      const dataToUpdate: any = {};
      if (editName !== (editingUser.nombre || (editingUser as any).full_name)) dataToUpdate.nombre = editName;
      if (editEmail !== editingUser.email) dataToUpdate.email = editEmail;
      if (editPassword.trim().length >= 8) dataToUpdate.password = editPassword;

      await userService.updateUser(typeof editingUser.id === 'string' ? parseInt(editingUser.id) : editingUser.id, dataToUpdate);
      Toast.show({ type: 'success', text1: '¡Usuario actualizado!' });
      setIsEditModalVisible(false);
      fetchUsers();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.response?.data?.detail || 'No se pudo actualizar el usuario.' });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={Colors.slate400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o correo..."
          placeholderTextColor={Colors.slate400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="people-outline" size={48} color={Colors.slate200} />
                <Text style={styles.emptyText}>No hay usuarios en el sistema</Text>
              </View>
            }
            renderItem={({ item }: { item: UserProfile & { rol_id?: number, nombre_rol?: string, nombre?: string } }) => {
              const isAdmin = item.nombre_rol === 'admin';
              const displayName = item.full_name || item.nombre || 'Sin Nombre';
              const isTargetSuperAdmin = item.email === 'admin@recidron.com';
              const canEdit = isSuperAdmin || !isTargetSuperAdmin;
              
              return (
                <View style={[styles.userCard, isAdmin && styles.adminCard]}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{displayName.substring(0,2).toUpperCase()}</Text>
                    </View>
                    <View style={styles.userTextCol}>
                      <Text style={styles.userName}>{displayName}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                      <View style={{flexDirection: 'row', gap: 6}}>
                        <View style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeAutor]}>
                          <Text style={[styles.roleText, isAdmin && {color: Colors.white}]}>
                            {isAdmin ? 'ADMINISTRADOR' : 'ESTUDIANTE / AUTOR'}
                          </Text>
                        </View>
                        {item.es_activo === false && (
                          <View style={[styles.roleBadge, {backgroundColor: Colors.dangerLight}]}>
                            <Text style={[styles.roleText, {color: Colors.danger}]}>INACTIVO</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.cardActions}>
                    {canEdit && (
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.btnEdit]}
                        onPress={() => {
                          setEditingUser(item as any);
                          setEditName(displayName);
                          setEditEmail(item.email || '');
                          setEditPassword('');
                          setEditConfirmPassword('');
                          setShowPassword(false);
                          setShowConfirmPassword(false);
                          setIsEditModalVisible(true);
                        }}
                      >
                        <MaterialIcons name="edit" size={16} color={Colors.white} />
                        <Text style={[styles.actionBtnText, {color: Colors.white, marginLeft: 4}]}>Editar</Text>
                      </TouchableOpacity>
                    )}

                    {isSuperAdmin && !isTargetSuperAdmin && (
                      <TouchableOpacity 
                        style={[styles.actionBtn, isAdmin ? styles.btnRevocar : styles.btnAscender]}
                        onPress={() => handleToggleRole(item)}
                      >
                        <Text style={[styles.actionBtnText, isAdmin && {color: Colors.danger}]}>
                          {isAdmin ? 'Revocar' : 'Hacer Admin'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {canEdit && !isTargetSuperAdmin && (
                      <TouchableOpacity 
                        style={[styles.actionBtn, item.es_activo === false ? styles.btnAscender : styles.btnRevocar]}
                        onPress={() => handleToggleActive(item)}
                      >
                        <Text style={[styles.actionBtnText, item.es_activo === false ? {color: Colors.primary} : {color: Colors.danger}]}>
                          {item.es_activo === false ? 'Activar' : 'Desactivar'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>

      {isUpdatingRole && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Usuario</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={Colors.slate500} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Nombre del usuario"
              />

              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Nueva Contraseña (Opcional)</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={editPassword}
                  onChangeText={setEditPassword}
                  placeholder="Dejar en blanco para no cambiar"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color={Colors.slate400} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={editConfirmPassword}
                  onChangeText={setEditConfirmPassword}
                  placeholder="Repite la nueva contraseña"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color={Colors.slate400} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateUser}>
                <Text style={styles.saveBtnText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 14, 
    backgroundColor: Colors.slate800 
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.white, letterSpacing: -0.3 },
  headerSpacer: { width: 40 },
  content: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 40, gap: 12 },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.slate200,
    gap: 12
  },
  adminCard: {
    borderColor: Colors.primaryBorder,
    backgroundColor: '#F8FAF9', // Muy leve verde
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.slate100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.slate600
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.slate900,
    marginBottom: 2
  },
  userEmail: {
    fontSize: 13,
    color: Colors.slate500,
    marginBottom: 6
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeAutor: {
    backgroundColor: Colors.slate100,
  },
  roleBadgeAdmin: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.slate600
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnAscender: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  btnRevocar: {
    backgroundColor: Colors.dangerLight,
    borderColor: '#C6282820',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 64, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.slate400, fontWeight: '500' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.slate900,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btnEdit: {
    backgroundColor: Colors.slate700,
    borderColor: Colors.slate800,
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.slate900,
  },
  closeBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate700,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.slate900,
    backgroundColor: Colors.slate50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,
    backgroundColor: Colors.slate50,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: Colors.slate900,
  },
  eyeIcon: {
    padding: 12,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
