import api from './base_service';

export interface DashboardStats {
  total_reportes: number;
  usuarios_activos: number;
  distribucion_tipos: Array<{ label: string; value: number }>;
  distribucion_zonas: Array<{ label: string; value: number }>;
  distribucion_materiales: Array<{ label: string; value: number }>;
}

export const statsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Rutas directas de FastAPI
    const response = await api.get('/stats/dashboard'); 
    return response.data;
  },

  getRecentReports: async () => {
    // Ruta directa
    const response = await api.get('/reportes/');
    return response.data;
  },

  getTrendStats: async () => {
    const response = await api.get('/stats/tendencia');
    return response.data;
  }
};
