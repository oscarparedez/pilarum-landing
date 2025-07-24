import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevaRevision } from '../types';

export const useRevisionesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getRevisiones = useCallback(
    async (proyectoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/reviews/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener revisiones');
      const data = await res.json();
      return data;
    },
    [fetchWithAuth]
  );

  const getRevisionById = useCallback(
    async (proyectoId: number, revisionId: number) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/reviews/${revisionId}/`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) throw new Error('Error al obtener revisión');
      const data = await res.json();
      return data;
    },
    [fetchWithAuth]
  );

  const crearRevision = useCallback(
    async (proyectoId: number, data: NuevaRevision) => {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('anotaciones', data.anotaciones);
      formData.append('fecha_review', data.fecha_review);

      data.fotos.forEach((file) => {
        formData.append('fotos', file); // el backend espera campo 'fotos'
      });

      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/reviews/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al crear revisión');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarRevision = useCallback(
    async (
      proyectoId: number,
      revisionId: number,
      data: NuevaRevision
    ) => {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('anotaciones', data.anotaciones);
      formData.append('fecha_review', data.fecha_review);

      data.fotos.forEach((file) => {
        formData.append('fotos', file);
      });

      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/reviews/${revisionId}/`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!res.ok) throw new Error('Error al actualizar revisión');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarRevision = useCallback(
    async (proyectoId: number, revisionId: number) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/reviews/${revisionId}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Error al eliminar revisión');
    },
    [fetchWithAuth]
  );

  return {
    getRevisiones,
    getRevisionById,
    crearRevision,
    actualizarRevision,
    eliminarRevision,
  };
};
