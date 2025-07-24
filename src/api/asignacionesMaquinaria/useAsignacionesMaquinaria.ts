import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { AsignacionMaquinaria, NuevaAsignacionMaquinaria } from '../types';

export const useAsignacionesMaquinariaApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getAsignaciones = useCallback(async (): Promise<AsignacionMaquinaria[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/asignaciones-maquinaria/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener asignaciones de maquinaria');
    return await res.json();
  }, [fetchWithAuth]);

  const getAsignacionById = useCallback(
    async (id: number): Promise<AsignacionMaquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/asignaciones-maquinaria/${id}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener asignación de maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const crearAsignacion = useCallback(
    async (data: NuevaAsignacionMaquinaria): Promise<AsignacionMaquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/asignaciones-maquinaria/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear asignación de maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarAsignacion = useCallback(
    async (id: number, data: Partial<AsignacionMaquinaria>): Promise<AsignacionMaquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/asignaciones-maquinaria/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar asignación de maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarAsignacion = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/asignaciones-maquinaria/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar asignación de maquinaria');
    },
    [fetchWithAuth]
  );

  return {
    getAsignaciones,
    getAsignacionById,
    crearAsignacion,
    actualizarAsignacion,
    eliminarAsignacion,
  };
};
