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
  // Campos de imagen devueltos por el backend
  foto_url?: string; 
  foto?: {
    id: number;
    url: string;
    fecha_subida: string;
  };
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

  getAllReports: async (skip: number = 0, limit: number = 10) => {
    const response = await api.get(`/reportes/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getMyReports: async () => {
    // El backend usa /reportes/stats/my para estadísticas, 
    // pero si queremos la lista de reportes propios, filtramos en el front o pedimos al back.
    // Asumimos que GET /reportes/ devuelve todo por ahora.
    const response = await api.get('/reportes/');
    return response.data;
  },
  getReportById: async (id: number) => {
    const response = await api.get(`/reportes/${id}`);
    return response.data;
  },
  getMaterialById: async (id: number) => {
    const response = await api.get(`/materiales/${id}`);
    return response.data;
  },
  getTypeById: async (id: number) => {
    const response = await api.get(`/tipos_residuo/${id}`);
    return response.data;
  },
  getZoneById: async (id: number) => {
    const response = await api.get(`/zonas/${id}`);
    return response.data;
  },
  getSizeById: async (id: number) => {
    const response = await api.get(`/tamanos/${id}`);
    return response.data;
  },
  
  uploadReportPhoto: async (reportId: number, imageUri: string) => {
    const formData = new FormData();
    
    // Extraer extensión del archivo de la URI
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    // En React Native, el objeto FormData para archivos requiere esta estructura
    formData.append('file', {
      uri: imageUri,
      name: `report_photo_${reportId}.${fileType}`,
      type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
    } as any);

    const response = await api.post(`/reportes/${reportId}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
