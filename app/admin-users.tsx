import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../src/styles/colors';
import { userService, UserProfile } from '../src/services/user_service';
import { useAuth } from '../src/store/authStore';
import api from '../src/services/base_service';

export default function AdminUsersScreen() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
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
      Alert.alert("Acción no permitida", "No se pueden revocar los permisos del administrador maestro.");
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
                }
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo actualizar el rol");
            } finally {
              setIsUpdatingRole(false);
            }
          }
        }
      ]
    );
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

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={users}
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
              return (
                <View style={[styles.userCard, isAdmin && styles.adminCard]}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{displayName.substring(0,2).toUpperCase()}</Text>
                    </View>
                    <View style={styles.userTextCol}>
                      <Text style={styles.userName}>{displayName}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                      <View style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeAutor]}>
                        <Text style={[styles.roleText, isAdmin && {color: Colors.white}]}>
                          {isAdmin ? 'ADMINISTRADOR' : 'ESTUDIANTE / AUTOR'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {!(isAdmin && item.email === 'admin@recidron.com') && (
                    <TouchableOpacity 
                      style={[styles.actionBtn, isAdmin ? styles.btnRevocar : styles.btnAscender]}
                      onPress={() => handleToggleRole(item)}
                    >
                      <Text style={[styles.actionBtnText, isAdmin && {color: Colors.danger}]}>
                        {isAdmin ? 'Revocar Admin' : 'Hacer Admin'}
                      </Text>
                    </TouchableOpacity>
                  )}
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
    width: '100%',
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
});
