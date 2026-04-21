import api from './base_service';

export interface UserProfile {
  id?: string | number;
  full_name?: string;
  email?: string;
  student_code?: string;
  phone?: string;
  role?: string;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    // Apunta al endpoint para obtener mis datos (suponiendo /usuarios/me)
    const response = await api.get('/usuarios/me');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    // Apunta al endpoint para modificar mis datos 
    const response = await api.put('/usuarios/me', data);
    return response.data;
  },

  getUserDashboard: async () => {
    // Si tienes un panel específico para un estudiante, ejemplo /usuarios/mis-estadisticas
    // O si usas el /reportes/ para contar. Lo simulamos con la petición.
    const response = await api.get('/reportes/stats/my');
    return response.data; // { total_reports: 5, active_zones: 2, top_material: "Plástico"... }
  },

  getAllUsers: async () => {
    // Método administrativo: Listar todos
    const response = await api.get('/usuarios/');
    return response.data;
  },

  changeUserRole: async (userId: number, roleId: number) => {
    // Método administrativo: Cambiar el rol.
    const response = await api.put(`/usuarios/${userId}`, { rol_id: roleId });
    return response.data;
  }
};
