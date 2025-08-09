import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { IngresoGeneral } from '../types';

export const useIngresosGeneralesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getIngresosGenerales = useCallback(async (): Promise<IngresoGeneral[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener ingresos generales');
    const data = await res.json();
    return data;
  }, [fetchWithAuth]);

  const getIngresoById = useCallback(
    async (ingresoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/${ingresoId}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener ingreso general');
      const data = await res.json();
      return data;
    },
    [fetchWithAuth]
  );

  const crearIngreso = useCallback(
    async (data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear ingreso general');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarIngreso = useCallback(
    async (ingresoId: number, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/${ingresoId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar ingreso general');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarIngresoParcial = useCallback(
    async (ingresoId: number, data: Partial<any>) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/${ingresoId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar ingreso general parcialmente');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarIngreso = useCallback(
    async (ingresoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/${ingresoId}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar ingreso general');
    },
    [fetchWithAuth]
  );

  return {
    getIngresosGenerales,
    getIngresoById,
    crearIngreso,
    actualizarIngreso,
    actualizarIngresoParcial,
    eliminarIngreso,
  };
};
