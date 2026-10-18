import * as Location from 'expo-location';
import api from './base_service';

export interface GeoCoordinates {
  latitud: number;
  longitud: number;
  altitud?: number | null;
  precision?: number | null;
}

export interface LocationResult {
  coords: GeoCoordinates | null;
  status: 'ready' | 'denied' | 'error';
  errorMessage?: string;
}

export const locationService = {
  /**
   * Solicita permisos de ubicación en primer plano al usuario.
   */
  requestPermission: async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.warn('Error al solicitar permisos de ubicación:', error);
      return false;
    }
  },

  /**
   * Captura la posición GPS actual del dispositivo.
   * Si no hay permisos o falla el sensor, retorna { coords: null, status: 'denied' | 'error' }
   * sin generar fallas críticas.
   */
  getCurrentCoordinates: async (
    accuracy: Location.Accuracy = Location.Accuracy.Balanced
  ): Promise<LocationResult> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return { coords: null, status: 'denied', errorMessage: 'Permiso de ubicación denegado' };
      }

      const location = await Location.getCurrentPositionAsync({ accuracy });
      return {
        coords: {
          latitud: location.coords.latitude,
          longitud: location.coords.longitude,
          altitud: location.coords.altitude,
          precision: location.coords.accuracy,
        },
        status: 'ready',
      };
    } catch (error: any) {
      console.warn('Error al obtener coordenadas GPS:', error);
      return {
        coords: null,
        status: 'error',
        errorMessage: error?.message || 'Error al obtener ubicación',
      };
    }
  },

  /**
   * Formatea un par de coordenadas para visualización amigable.
   * Si no están disponibles, retorna "No especificada".
   */
  formatCoordinates: (lat?: number | null, lng?: number | null): string => {
    if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
      return `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
    }
    return 'No especificada';
  },

  /**
   * Formatea la precisión del GPS en metros.
   */
  formatPrecision: (precision?: number | null): string => {
    if (precision !== undefined && precision !== null) {
      return `±${Number(precision).toFixed(1)} m`;
    }
    return 'No especificada';
  },

  /**
   * Formatea la altitud en metros sobre el nivel del mar.
   */
  formatAltitude: (altitude?: number | null): string => {
    if (altitude !== undefined && altitude !== null) {
      return `${Number(altitude).toFixed(1)} msnm`;
    }
    return 'No especificada';
  },

  // --- Métodos de API Backend (/geos/) ---
  getAllGeos: async () => {
    const response = await api.get('/geos/');
    return response.data;
  },

  getGeoById: async (id: number) => {
    const response = await api.get(`/geos/${id}`);
    return response.data;
  },
};
