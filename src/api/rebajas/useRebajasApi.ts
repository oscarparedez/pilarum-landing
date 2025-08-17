import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevaRebaja, Rebaja } from '../types';

export const useRebajasInventarioApi = () => {
  const { fetchWithAuth } = useAuthApi();

  // Listar todas las órdenes de rebaja
  const listRebajas = useCallback(async (): Promise<Rebaja[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-rebaja/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al listar órdenes de rebaja');
    return (await res.json()) as Rebaja[];
  }, [fetchWithAuth]);

  // Obtener una orden de rebaja por ID
  const getRebajaById = useCallback(
    async (id: number): Promise<Rebaja> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-rebaja/${id}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener orden de rebaja');
      return (await res.json()) as Rebaja;
    },
    [fetchWithAuth]
  );

  // Crear una nueva orden de rebaja
  const crearRebaja = useCallback(
    async (data: NuevaRebaja): Promise<Rebaja> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-rebaja/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear orden de rebaja');
      return (await res.json()) as Rebaja;
    },
    [fetchWithAuth]
  );

  // Actualizar (PUT/PATCH)
  const updateRebaja = useCallback(
    async (id: number, data: Partial<NuevaRebaja>): Promise<Rebaja> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-rebaja/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar orden de rebaja');
      return (await res.json()) as Rebaja;
    },
    [fetchWithAuth]
  );

  // Eliminar
  const deleteRebaja = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-rebaja/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar orden de rebaja');
    },
    [fetchWithAuth]
  );

  return {
    listRebajas,
    getRebajaById,
    crearRebaja,
    updateRebaja,
    deleteRebaja,
  };
};
