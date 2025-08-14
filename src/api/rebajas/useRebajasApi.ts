import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevaRebaja, Rebaja } from '../types';

export const useRebajasInventarioApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const listRebajas = useCallback(async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/inventario/rebaja-inventario/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al listar rebajas de inventario');
    return (await res.json()) as Rebaja[];
  }, [fetchWithAuth]);

  const getRebajaById = useCallback(
    async (id: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventario/rebaja-inventario/${id}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener rebaja');
      return (await res.json()) as Rebaja;
    },
    [fetchWithAuth]
  );

  const crearRebaja = useCallback(
    async (data: NuevaRebaja): Promise<Rebaja[]> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/inventario/rebaja-inventario/orden`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al crear rebaja de inventario');
      return res.json();
    },
    [fetchWithAuth]
  );

  return {
    listRebajas,
    getRebajaById,
    crearRebaja
  };
};
