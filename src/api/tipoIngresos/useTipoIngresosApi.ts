import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevoTipoIngreso, TipoIngreso } from '../types';

export const useTiposIngresoApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getTiposIngreso = useCallback(async (): Promise<TipoIngreso[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/tipoIngresos/`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Error al obtener tipos de ingreso');
    return await res.json();
  }, [fetchWithAuth]);

  const crearTipoIngreso = useCallback(
    async (data: NuevoTipoIngreso): Promise<TipoIngreso> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tipoIngresos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al crear tipo de ingreso');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarTipoIngreso = useCallback(
    async (id: number, data: NuevoTipoIngreso): Promise<TipoIngreso> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tipoIngresos/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al actualizar tipo de ingreso');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarTipoIngreso = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tipoIngresos/${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Error al eliminar tipo de ingreso');
      }
    },
    [fetchWithAuth]
  );

  return {
    getTiposIngreso,
    crearTipoIngreso,
    actualizarTipoIngreso,
    eliminarTipoIngreso,
  };
};
