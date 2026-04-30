import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  // URL para prueba local  ( basada en IP usar http://########:3000 )
  // orignal del render https://recidron-backend-proyecto.onrender.com/
  baseURL: 'http://192.168.0.6:3000',
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
