import api from './base_service';

export const authService = {
  login: async (email: string, password: string) => {
    // OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', email); 
    formData.append('password', password);

    const response = await api.post('/usuarios/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/usuarios/', userData);
    return response.data;
  },

  recoverPassword: async (email: string) => {
    // Ajustaremos con tu endpoint real, por ahora asumimos /usuarios/recover
    const response = await api.post('/usuarios/recover', { email });
    return response.data;
  }
};
