import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  // URL local de tu servidor FastAPI (basada en tu IP actual 192.168.0.7)
  baseURL: 'http://192.168.0.7:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token automáticamente si existe
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('user_token');
    if (token) {
      // Inyectar el token en el formato Bearer esperado por el Backend
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error recuperando el token para la petición:', error);
    return config;
  }
});

export default api;
