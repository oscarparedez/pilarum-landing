import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { Pendiente, NuevoPendiente } from '../types';

export const usePendientesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const crearPendiente = useCallback(
    async (data: NuevoPendiente) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pendientes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear pendiente');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarPendiente = useCallback(
    async (id: number, data: Partial<NuevoPendiente>) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pendientes/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar pendiente');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const patchEstadoPendiente = useCallback(
    async (id: number, estado: 'no_iniciado' | 'pendiente' | 'completado') => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pendientes/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado del pendiente');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarPendiente = useCallback(
    async (id: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pendientes/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar pendiente');
      return;
    },
    [fetchWithAuth]
  );

  const getPendientesOficina = useCallback(
    async () => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pendientes/filtrar/?categoria=oficina`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener pendientes de oficina');
      return await res.json() as Pendiente[];
    },
    [fetchWithAuth]
  );

  const getPendientesProyecto = useCallback(
    async (referenciaId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/pendientes/filtrar/?categoria=proyecto&referencia_id=${referenciaId}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener pendientes de proyecto');
      return await res.json() as Pendiente[];
    },
    [fetchWithAuth]
  );

  return {
    crearPendiente,
    actualizarPendiente,
    patchEstadoPendiente,
    eliminarPendiente,
    getPendientesOficina,
    getPendientesProyecto,
  };
};
