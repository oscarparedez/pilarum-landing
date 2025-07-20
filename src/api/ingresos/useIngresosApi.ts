import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { mapIngresoToFrontend } from './utils';

export const useIngresosApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getIngresos = useCallback(
    async (proyectoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener ingresos');
      const data = await res.json();
      return data.map(mapIngresoToFrontend);
    },
    [fetchWithAuth]
  );

  const getIngresoById = useCallback(
    async (proyectoId: number, ingresoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/${ingresoId}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener ingreso');
      const data = await res.json();
      return mapIngresoToFrontend(data);
    },
    [fetchWithAuth]
  );

  const crearIngreso = useCallback(
    async (proyectoId: number, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear ingreso');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarIngreso = useCallback(
    async (proyectoId: number, ingresoId: number, data: any) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/${ingresoId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar ingreso');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarIngresoParcial = useCallback(
    async (proyectoId: number, ingresoId: number, data: Partial<any>) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/${ingresoId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar ingreso parcialmente');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarIngreso = useCallback(
    async (proyectoId: number, ingresoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ingresos/${ingresoId}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar ingreso');
    },
    [fetchWithAuth]
  );

  return {
    getIngresos,
    getIngresoById,
    crearIngreso,
    actualizarIngreso,
    actualizarIngresoParcial,
    eliminarIngreso,
  };
};
