import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';

export type TipoPresupuesto = 'inicial' | 'ampliacion';

export interface Presupuesto {
  id: number;
  proyecto: number;
  tipo: TipoPresupuesto;
  monto: number;
  motivo?: string;
  fecha_creacion: string;
}

export const usePresupuestosApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getPresupuestos = useCallback(async (proyectoId: number): Promise<Presupuesto[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener presupuestos');
    return await res.json();
  }, [fetchWithAuth]);

  const getPresupuestoById = useCallback(
    async (proyectoId: number, id: number): Promise<Presupuesto> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/${id}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener presupuesto');
      return await res.json();
    },
    [fetchWithAuth]
  );

const crearPresupuestoInicial = useCallback(
  async (
    proyectoId: number,
    data: Omit<Presupuesto, 'id' | 'proyecto' | 'tipo' | 'fecha_creacion'>
  ): Promise<Presupuesto> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        tipo: 'inicial'
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
      data: Omit<Presupuesto, 'id' | 'proyecto' | 'tipo' | 'fecha_creacion'>
    ): Promise<Presupuesto> => {
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
      data: Omit<Presupuesto, 'id' | 'proyecto' | 'fecha_creacion'>
    ): Promise<Presupuesto> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar presupuesto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarPresupuesto = useCallback(
    async (proyectoId: number, id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/presupuestos/${id}/`, {
        method: 'DELETE',
      });
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
