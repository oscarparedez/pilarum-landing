import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { mapIngresoToFrontend } from './utils';

export const useIngresosApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getIngresos = useCallback(
    async (proyectoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener ingresos');
      const data = await res.json();
      return data.map(mapIngresoToFrontend);
    },
    [fetchWithAuth]
  );

  const crearIngreso = useCallback(
    async (proyectoId: number, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear ingreso');
      return await res.json();
    },
    [fetchWithAuth]
  );

  return { getIngresos, crearIngreso };
};
