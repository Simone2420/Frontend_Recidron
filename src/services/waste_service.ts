import api from './base_service';

export interface WasteCatalogItem {
  id: number;
  nombre_tipo?: string;
  nombre_material?: string;
  nombre_zona?: string;
  nombre_tamano?: string;
}

export interface WasteReport {
  id?: number;
  descripcion?: string;
  usuario_id: number;
  tipo_residuo_id: number;
  material_id: number;
  zona_id: number;
  tamano_id: number;
  fecha_reporte?: string;
  es_activo?: number;
  // Estos se mantienen para compatibilidad temporal o UI si es necesario
  photo_url?: string; 
}

export const wasteService = {
  // --- Métodos de Catálogos ---
  getTypes: async (): Promise<WasteCatalogItem[]> => {
    const response = await api.get('/tipos_residuo/');
    return response.data;
  },

  getMaterials: async (): Promise<WasteCatalogItem[]> => {
    const response = await api.get('/materiales/');
    return response.data;
  },

  getZones: async (): Promise<WasteCatalogItem[]> => {
    const response = await api.get('/zonas/');
    return response.data;
  },

  getSizes: async (): Promise<WasteCatalogItem[]> => {
    const response = await api.get('/tamanos/');
    return response.data;
  },

  // --- Métodos de Reportes ---
  createReport: async (reportData: WasteReport) => {
    // Validamos que el payload coincida con ReporteCreate del backend
    const payload = {
      descripcion: reportData.descripcion,
      usuario_id: reportData.usuario_id,
      tipo_residuo_id: reportData.tipo_residuo_id,
      material_id: reportData.material_id,
      zona_id: reportData.zona_id,
      tamano_id: reportData.tamano_id
    };
    
    const response = await api.post('/reportes/', payload);
    return response.data;
  },

  getAllReports: async () => {
    const response = await api.get('/reportes/');
    return response.data;
  },

  getMyReports: async () => {
    // El backend usa /reportes/stats/my para estadísticas, 
    // pero si queremos la lista de reportes propios, filtramos en el front o pedimos al back.
    // Asumimos que GET /reportes/ devuelve todo por ahora.
    const response = await api.get('/reportes/');
    return response.data;
  }
};
