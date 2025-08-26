import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { CostoGeneral } from '../types';

export type CostosQuery = {
  empresa?: number;
  proyecto?: number;
  equipo?: number;        // <-- agregar
  orden_compra?: number;  // <-- agregar
  fecha_inicio?: string;  // 'DD-MM-YYYY'
  fecha_fin?: string;     // 'DD-MM-YYYY'
  tipo_origen?: string;   // 'proyecto' | 'orden_compra' | 'gasto_maquinaria' | 'compra_maquinaria'
};

export const useCostosGeneralesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getCostosGenerales = useCallback(
    async (query?: CostosQuery): Promise<CostoGeneral[]> => {
      const params = new URLSearchParams();
      if (query?.empresa) params.append('empresa', String(query.empresa));
      if (query?.proyecto) params.append('proyecto', String(query.proyecto));
      if (query?.equipo) params.append('equipo', String(query.equipo));              // <-- nuevo
      if (query?.orden_compra) params.append('orden_compra', String(query.orden_compra)); // <-- nuevo
      if (query?.fecha_inicio) params.append('fecha_inicio', query.fecha_inicio);
      if (query?.fecha_fin) params.append('fecha_fin', query.fecha_fin);
      if (query?.tipo_origen) params.append('tipo_origen', query.tipo_origen);

      const url = `${API_BASE_URL}/costos/${params.toString() ? `?${params.toString()}` : ''}`;

      const res = await fetchWithAuth(url, { method: 'GET' });
      if (!res.ok) throw new Error('Error al obtener costos generales');

      return await res.json();
    },
    [fetchWithAuth]
  );

  return {
    getCostosGenerales,
  };
};