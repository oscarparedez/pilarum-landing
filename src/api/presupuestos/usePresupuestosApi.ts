import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { mapPresupuestoToFrontend } from './utils';
import { AmpliacionPresupuesto } from 'src/pages/proyectos/[id]/index.d';

export type TipoPresupuesto = 'inicial' | 'ampliacion';

export const usePresupuestosApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getPresupuestos = useCallback(
    async (proyectoId: number): Promise<AmpliacionPresupuesto[]> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener presupuestos');
      const rawData = await res.json();
      return rawData.map(mapPresupuestoToFrontend);
    },
    [fetchWithAuth]
  );

  const getPresupuestoById = useCallback(
    async (proyectoId: number, id: number): Promise<AmpliacionPresupuesto> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/${id}/`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) throw new Error('Error al obtener presupuesto');
      const rawData = await res.json();
      return mapPresupuestoToFrontend(rawData);
    },
    [fetchWithAuth]
  );

  const crearPresupuestoInicial = useCallback(
    async (
      proyectoId: number,
      data: { monto: number, motivo?: string }
    ): Promise<AmpliacionPresupuesto> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tipo: 'inicial',
        }),
      });

      if (!res.ok) throw new Error('Error al crear presupuesto inicial');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const crearPresupuestoAmpliacion = useCallback(
    async (
      proyectoId: number,
      data: { monto: number, motivo?: string }
    ): Promise<AmpliacionPresupuesto> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, tipo: 'ampliacion' }),
      });
      if (!res.ok) throw new Error('Error al crear presupuesto por ampliación');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarPresupuesto = useCallback(
    async (
      proyectoId: number,
      id: number,
      data: { monto: number }
    ): Promise<AmpliacionPresupuesto> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/${id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al actualizar presupuesto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarPresupuesto = useCallback(
    async (proyectoId: number, id: number): Promise<void> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/${id}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Error al eliminar presupuesto');
    },
    [fetchWithAuth]
  );

  return {
    getPresupuestos,
    getPresupuestoById,
    crearPresupuestoInicial,
    crearPresupuestoAmpliacion,
    actualizarPresupuesto,
    eliminarPresupuesto,
  };
};
