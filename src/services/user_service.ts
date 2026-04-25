import api from './base_service';

export interface UserProfile {
  id?: string | number;
  nombre?: string;
  email?: string;
  codigo_estudiantil?: string;
  rol_id?: number | string;
  nombre_rol?: string;
  creado_en?: string;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    // Apunta al endpoint para obtener mis datos (suponiendo /usuarios/me)
    const response = await api.get('/usuarios/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    // PUT /usuarios/me — mapeamos los campos del front al contrato del backend
    const backendData: any = {};
    if (data.nombre)             backendData.nombre             = data.nombre;
    if (data.email)              backendData.email              = data.email;
    if (data.codigo_estudiantil) backendData.codigo_estudiantil = data.codigo_estudiantil;

    // Contraseña: sólo se incluye si el usuario quiso cambiarla
    if (data.nueva_password)    backendData.nueva_password    = data.nueva_password;
    if (data.confirmar_password) backendData.confirmar_password = data.confirmar_password;

    const response = await api.put('/usuarios/me', backendData);
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

  getUserById: async (id: number): Promise<UserProfile> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  changeUserRole: async (userId: number, roleId: number) => {
    // Método administrativo: Cambiar el rol.
    const response = await api.put(`/usuarios/${userId}`, { rol_id: roleId });
    return response.data;
  }
};
