import api from './base_service';

export const authService = {
  login: async (email: string, password: string) => {
    // El backend ahora espera UsuarioLogin (JSON) directamente, no Form-Data
    const response = await api.post('/usuarios/login', {
      email,
      password,
    });

    return response.data;
  },

  register: async (userData: any) => {
    // Mapeamos los datos del frontend (full_name, student_code) a los del backend (nombre, codigo_estudiantil)
    const backendData = {
      nombre: userData.full_name || userData.nombre,
      email: userData.email,
      password: userData.password,
      codigo_estudiantil: userData.student_code || userData.codigo_estudiantil
    };
    const response = await api.post('/usuarios/', backendData);
    return response.data;
  },

  recoverPassword: async (email: string) => {
    // Ajustaremos con tu endpoint real, por ahora asumimos /usuarios/recover
    const response = await api.post('/usuarios/recover', { email });
    return response.data;
  }
};
