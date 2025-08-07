import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { Unidad, NuevaUnidad } from '../types';

export const useUnidadesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getUnidades = useCallback(async (): Promise<Unidad[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/unidades/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener unidades');
    return await res.json();
  }, [fetchWithAuth]);

  const getUnidadById = useCallback(async (id: number): Promise<Unidad> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/unidades/${id}/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener unidad');
    return await res.json();
  }, [fetchWithAuth]);

  const crearUnidad = useCallback(async (unidad: NuevaUnidad): Promise<Unidad> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/unidades/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unidad),
    });
    if (!res.ok) throw new Error('Error al crear unidad');
    return await res.json();
  }, [fetchWithAuth]);

  const actualizarUnidad = useCallback(
    async (id: number, unidad: NuevaUnidad): Promise<Unidad> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/unidades/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unidad),
      });
      if (!res.ok) throw new Error('Error al actualizar unidad');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarUnidad = useCallback(async (id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/unidades/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar unidad');
  }, [fetchWithAuth]);

  return {
    getUnidades,
    getUnidadById,
    crearUnidad,
    actualizarUnidad,
    eliminarUnidad,
  };
};
