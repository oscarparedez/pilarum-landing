// src/api/inventario/useRebajasInventarioApi.ts
import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevaRebaja, Rebaja } from '../types';

export const useRebajasInventarioApi = () => {
  const { fetchWithAuth } = useAuthApi();
  const base = `${API_BASE_URL}/inventario/rebaja-inventario/`;

  const listRebajas = useCallback(async () => {
    const res = await fetchWithAuth(base, { method: 'GET' });
    if (!res.ok) throw new Error('Error al listar rebajas de inventario');
    return (await res.json()) as Rebaja[];
  }, [fetchWithAuth]);

  const getRebajaById = useCallback(
    async (id: number) => {
      const res = await fetchWithAuth(`${base}${id}/`, { method: 'GET' });
      if (!res.ok) throw new Error('Error al obtener rebaja');
      return (await res.json()) as Rebaja;
    },
    [fetchWithAuth]
  );

  const crearRebaja = useCallback(
    async (data: NuevaRebaja): Promise<Rebaja[]> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventario/rebaja-inventario/orden/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear rebaja de inventario');
      return res.json();
    },
    [fetchWithAuth]
  );

  const actualizarRebaja = useCallback(
    async (id: number, data: Partial<NuevaRebaja>) => {
      const res = await fetchWithAuth(`${base}${id}/`, {
        method: 'PUT', // o PATCH si prefieres
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar rebaja de inventario');
      return (await res.json()) as Rebaja;
    },
    [fetchWithAuth]
  );

  const eliminarRebaja = useCallback(
    async (id: number) => {
      const res = await fetchWithAuth(`${base}${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar rebaja de inventario');
    },
    [fetchWithAuth]
  );

  return { listRebajas, getRebajaById, crearRebaja, actualizarRebaja, eliminarRebaja };
};
