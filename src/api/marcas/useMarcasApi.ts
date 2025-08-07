import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { Marca, NuevaMarca } from '../types';

export const useMarcasApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getMarcas = useCallback(async (): Promise<Marca[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/marcas/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener marcas');
    return await res.json();
  }, [fetchWithAuth]);

  const getMarcaById = useCallback(async (id: number): Promise<Marca> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/marcas/${id}/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener marca');
    return await res.json();
  }, [fetchWithAuth]);

  const crearMarca = useCallback(async (marca: NuevaMarca): Promise<Marca> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/marcas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(marca),
    });
    if (!res.ok) throw new Error('Error al crear marca');
    return await res.json();
  }, [fetchWithAuth]);

  const actualizarMarca = useCallback(
    async (id: number, marca: NuevaMarca): Promise<Marca> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/marcas/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marca),
      });
      if (!res.ok) throw new Error('Error al actualizar marca');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarMarca = useCallback(async (id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/marcas/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar marca');
  }, [fetchWithAuth]);

  return {
    getMarcas,
    getMarcaById,
    crearMarca,
    actualizarMarca,
    eliminarMarca,
  };
};
