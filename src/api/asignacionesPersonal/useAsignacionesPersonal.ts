import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { AsignacionPersonal, NuevaAsignacionPersonal } from '../types';

export const useAsignacionesPersonalApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getAsignaciones = useCallback(
    async (proyectoId: number): Promise<AsignacionPersonal[]> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/asignaciones/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener asignaciones de personal');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const crearAsignacion = useCallback(
    async (proyectoId: number, data: NuevaAsignacionPersonal): Promise<AsignacionPersonal> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/asignaciones/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear asignación de personal');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarAsignacion = useCallback(
    async (
      proyectoId: number,
      id: number,
      data: Partial<AsignacionPersonal>
    ): Promise<AsignacionPersonal> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones/${id}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al actualizar asignación de personal');
      return await res.json();
    },
    [fetchWithAuth]
  );

    const liberarAsignacion = useCallback(
    async (
      proyectoId: number,
      id: number
    ): Promise<AsignacionPersonal> => {
      const hoy = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones/${id}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fecha_fin: hoy }),
        }
      );
      if (!res.ok) throw new Error('Error al liberar asignación');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarAsignacion = useCallback(
    async (proyectoId: number, id: number): Promise<void> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones/${id}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Error al eliminar asignación de personal');
    },
    [fetchWithAuth]
  );

  return {
    getAsignaciones,
    crearAsignacion,
    actualizarAsignacion,
    liberarAsignacion,
    eliminarAsignacion,
  };
};
