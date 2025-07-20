import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';

export interface TipoPago {
  id: number;
  nombre: string;
}

export const useTiposPagoApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getTiposPago = useCallback(async (): Promise<TipoPago[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/tipoPagos/`, { method: 'GET' });
    if (!res.ok) throw new Error('Error al obtener tipos de pago');
    return await res.json();
  }, [fetchWithAuth]);

  const crearTipoPago = useCallback(
    async (data: Omit<TipoPago, 'id'>): Promise<TipoPago> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tipoPagos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear tipo de pago');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarTipoPago = useCallback(
    async (id: number, data: Omit<TipoPago, 'id'>): Promise<TipoPago> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/tipoPagos/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar tipo de pago');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarTipoPago = useCallback(async (id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/tipoPagos/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar tipo de pago');
  }, [fetchWithAuth]);

  return {
    getTiposPago,
    crearTipoPago,
    actualizarTipoPago,
    eliminarTipoPago,
  };
};
