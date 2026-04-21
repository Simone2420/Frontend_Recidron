import api from './base_service';

export interface DashboardStats {
  total_reports: number;
  active_users: number;
  most_active_zone: string;
  dangerous_waste_count: number;
}

export const statsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Aquí usamos el endpoint del backend (asegurarse de que coincide en FastAPI)
    const response = await api.get('/api/v1/stats/dashboard'); 
    return response.data;
  },

  getRecentReports: async () => {
    const response = await api.get('/api/v1/waste/recent');
    return response.data;
  }
};
