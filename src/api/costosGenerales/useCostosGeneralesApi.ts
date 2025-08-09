import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
// Puedes definir la interfaz `CostoGeneral` si conoces la estructura
// import { CostoGeneral } from './types';

export const useCostosGeneralesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getCostosGenerales = useCallback(async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/costos/`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Error al obtener costos generales');
    }

    const data = await res.json();
    return data; // Puedes mapear con `mapCostoToFrontend` si necesitas
  }, [fetchWithAuth]);

  return {
    getCostosGenerales,
  };
};
