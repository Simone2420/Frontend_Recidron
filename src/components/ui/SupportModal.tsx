import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../services/base_service';
import { useTheme } from '../../styles/theme';

interface AdminContact {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SupportModal({ visible, onClose }: SupportModalProps) {
  const { theme } = useTheme();
  const [admins, setAdmins] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      fetchAdmins();
    }
  }, [visible]);

  const fetchAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/usuarios/soporte');
      setAdmins(response.data);
    } catch (err) {
      console.error('Error fetching support admins', err);
      setError('No se pudo cargar la información de soporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalContent, { backgroundColor: theme.white }]} onStartShouldSetResponder={() => true}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.slate100 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="support-agent" size={24} color={theme.primary} />
              <Text style={[styles.modalTitle, { color: theme.slate900 }]}>Contacto de Soporte</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme.slate400} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={[styles.description, { color: theme.slate500 }]}>
              Si tienes problemas con la plataforma o tu cuenta, comunícate con alguno de nuestros administradores:
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
            ) : error ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
            ) : admins.length === 0 ? (
              <Text style={[styles.errorText, { color: theme.slate500 }]}>No hay contactos disponibles.</Text>
            ) : (
              admins.map((admin) => (
                <View key={admin.id} style={[styles.adminCard, { backgroundColor: theme.backgroundLight, borderColor: theme.slate100 }]}>
                  <View style={[styles.avatarBox, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: theme.primary }]}>
                      {admin.nombre.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.adminInfo}>
                    <Text style={[styles.adminName, { color: theme.slate900 }]}>{admin.nombre}</Text>
                    <Text style={[styles.adminRole, { color: theme.primary }]}>{admin.rol}</Text>
                    <Text style={[styles.adminEmail, { color: theme.slate500 }]}>{admin.email}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContent: { borderRadius: 24, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  description: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  errorText: { textAlign: 'center', marginTop: 10, fontSize: 14 },
  adminCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12, gap: 12 },
  avatarBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold' },
  adminInfo: { flex: 1 },
  adminName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  adminRole: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  adminEmail: { fontSize: 13 },
});
