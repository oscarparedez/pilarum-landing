import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { mapPagoToFrontend } from './utils';

export const usePagosApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getPagos = useCallback(
    async (proyectoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/pagos/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener pagos');
      const data = await res.json();
      return data.map(mapPagoToFrontend);
    },
    [fetchWithAuth]
  );

  const getPagoById = useCallback(
    async (proyectoId: number, pagoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/pagos/${pagoId}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener pago');
      const data = await res.json();
      return mapPagoToFrontend(data);
    },
    [fetchWithAuth]
  );

  const crearPago = useCallback(
    async (proyectoId: number, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/pagos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear pago');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarPago = useCallback(
    async (proyectoId: number, pagoId: number, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/pagos/${pagoId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar pago');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarPagoParcial = useCallback(
    async (proyectoId: number, pagoId: number, data: Partial<any>) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/pagos/${pagoId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar pago parcialmente');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarPago = useCallback(
    async (proyectoId: number, pagoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/pagos/${pagoId}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar pago');
    },
    [fetchWithAuth]
  );

  return {
    getPagos,
    getPagoById,
    crearPago,
    actualizarPago,
    actualizarPagoParcial,
    eliminarPago,
  };
};
