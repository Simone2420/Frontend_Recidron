import api from './base_service';

export const authService = {
  login: async (email: string, password: string) => {
    // OAuth2PasswordRequestForm de FastAPI requiere application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI asocia el username a nuestro email
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data; // Devuelve { access_token: string, token_type: string, user: {...} }
  },
};
