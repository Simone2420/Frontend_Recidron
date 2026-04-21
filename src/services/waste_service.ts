import api from './base_service';

export interface WasteReport {
  id?: string;
  type?: string; 
  location: string;
  material: string;
  dateStr?: string;
  photo_url?: string;
}

export const wasteService = {
  createReport: async (reportData: WasteReport) => {
    // Apuntamos al endpoint POST /reportes/ como nos indicó el backend
    const response = await api.post('/reportes/', reportData);
    return response.data;
  },

  getAllReports: async () => {
    // Si tienes un endpoint para listar, asumo que es GET /reportes/
    const response = await api.get('/reportes/');
    return response.data;
  },

  getMyReports: async () => {
    // Por si en algún momento filtras por usuario autenticado
    const response = await api.get('/reportes/my-reports');
    return response.data;
  }
};
