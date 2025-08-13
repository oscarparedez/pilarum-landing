import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { OrdenCompra, NuevaOrdenCompra } from '../types';

export const useOrdenesCompraApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getOrdenesCompra = useCallback(async (): Promise<OrdenCompra[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-compra/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener las órdenes de compra');
    return (await res.json()) as OrdenCompra[];
  }, [fetchWithAuth]);

  const crearOrdenCompra = useCallback(
    async (data: NuevaOrdenCompra) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-compra/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear la orden de compra');
      return (await res.json()) as OrdenCompra;
    },
    [fetchWithAuth]
  );

  const actualizarOrdenCompra = useCallback(
    async (id: number, data: NuevaOrdenCompra) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-compra/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar la orden de compra');
      return (await res.json()) as OrdenCompra;
    },
    [fetchWithAuth]
  );

  const patchOrdenCompra = useCallback(
    async (id: number, data: NuevaOrdenCompra) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-compra/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al editar parcialmente la orden de compra');
      return (await res.json()) as OrdenCompra;
    },
    [fetchWithAuth]
  );

  const getOrdenCompraById = useCallback(
    async (id: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-compra/${id}/`);
      if (!res.ok) throw new Error('Error al obtener la orden de compra');
      return (await res.json()) as OrdenCompra;
    },
    [fetchWithAuth]
  );

  return {
    getOrdenesCompra,
    crearOrdenCompra,
    actualizarOrdenCompra,
    patchOrdenCompra,
    getOrdenCompraById,
  };
};
