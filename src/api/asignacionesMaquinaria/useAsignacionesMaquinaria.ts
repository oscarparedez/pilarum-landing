import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { AsignacionMaquinaria, NuevaAsignacionMaquinaria } from '../types';

export const useAsignacionesMaquinariaApi = () => {
  const { fetchWithAuth } = useAuthApi();

  // Asignaciones generales
  const getAsignacionesPorMaquinaria = useCallback(
    async (equipoId: number): Promise<AsignacionMaquinaria[]> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/${equipoId}/asignaciones/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener asignaciones de maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const getAsignacionById = useCallback(
    async (id: number): Promise<AsignacionMaquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/asignaciones-maquinaria/${id}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener asignación de maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  // Asignaciones por proyecto
  const getAsignacionesPorProyecto = useCallback(
    async (proyectoId: number): Promise<AsignacionMaquinaria[]> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones-maquinaria/`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) throw new Error('Error al obtener asignaciones del proyecto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const crearAsignacionEnProyecto = useCallback(
    async (proyectoId: number, data: NuevaAsignacionMaquinaria): Promise<AsignacionMaquinaria> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones-maquinaria/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al crear asignación en el proyecto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const getAsignacionByIdEnProyecto = useCallback(
    async (proyectoId: number, id: number): Promise<AsignacionMaquinaria> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones-maquinaria/${id}/`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) throw new Error('Error al obtener asignación del proyecto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarAsignacionEnProyecto = useCallback(
    async (
      proyectoId: number,
      id: number,
      data: Partial<AsignacionMaquinaria>
    ): Promise<AsignacionMaquinaria> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones-maquinaria/${id}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al actualizar asignación del proyecto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarAsignacionEnProyecto = useCallback(
    async (proyectoId: number, id: number): Promise<void> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/asignaciones-maquinaria/${id}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Error al eliminar asignación del proyecto');
    },
    [fetchWithAuth]
  );

  return {
    // generales
    getAsignacionesPorMaquinaria,
    getAsignacionById,

    // por proyecto
    getAsignacionesPorProyecto,
    crearAsignacionEnProyecto,
    getAsignacionByIdEnProyecto,
    actualizarAsignacionEnProyecto,
    eliminarAsignacionEnProyecto,
  };
};
