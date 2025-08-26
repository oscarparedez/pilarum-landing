import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { IngresoGeneral } from '../types';

export type IngresosQuery = {
  empresa?: number | string;      // id de socio/empresa
  proyecto?: number | string;     // id de proyecto
  tipo_ingreso?: number | string; // id de tipo de ingreso
  fecha_inicio?: string;          // "DD-MM-YYYY"
  fecha_fin?: string;             // "DD-MM-YYYY"
};

const buildQuery = (q?: IngresosQuery) => {
  if (!q) return '';
  const params = new URLSearchParams();
  if (q.empresa) params.set('empresa', String(q.empresa));
  if (q.proyecto) params.set('proyecto', String(q.proyecto));
  if (q.tipo_ingreso) params.set('tipo_ingreso', String(q.tipo_ingreso));
  if (q.fecha_inicio) params.set('fecha_inicio', q.fecha_inicio);
  if (q.fecha_fin) params.set('fecha_fin', q.fecha_fin);
  const s = params.toString();
  return s ? `?${s}` : '';
};

export const useIngresosGeneralesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getIngresosGenerales = useCallback(
    async (query?: IngresosQuery): Promise<IngresoGeneral[]> => {
      const url = `${API_BASE_URL}/ingresos/${buildQuery(query)}`;
      const res = await fetchWithAuth(url, { method: 'GET' });
      if (!res.ok) throw new Error('Error al obtener ingresos generales');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const getIngresoById = useCallback(
    async (ingresoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/${ingresoId}/`, { method: 'GET' });
      if (!res.ok) throw new Error('Error al obtener ingreso general');
      return await res.json();
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
      const res = await fetchWithAuth(`${API_BASE_URL}/ingresos/${ingresoId}/`, { method: 'DELETE' });
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