import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  // URL local de tu servidor FastAPI (basada en tu IP actual 10.245.176.241)
  baseURL: 'https://recidron-backend-proyecto.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token automáticamente si existe
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('user_token');
    console.log(`[API] Petición a: ${config.baseURL}${config.url} | Token: ${token ? 'SÍ' : 'NO'}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error recuperando el token para la petición:', error);
    return config;
  }
});

export default api;
