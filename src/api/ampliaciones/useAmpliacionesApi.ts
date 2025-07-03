import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { mapAmpliacionToFrontend } from './utils';

export const useAmpliacionesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getAmpliaciones = useCallback(
    async (proyectoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ampliaciones/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener ampliaciones');
      const data = await res.json();
      return data.map(mapAmpliacionToFrontend);
    },
    [fetchWithAuth]
  );

  const crearAmpliacion = useCallback(
    async (proyectoId: number, data: { nueva_fecha_estimada_fin: string; motivo: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${proyectoId}/ampliaciones/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear ampliación');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const editarAmpliacion = useCallback(
    async (
      proyectoId: number,
      ampliacionId: number,
      data: { nueva_fecha_estimada_fin: string; motivo: string }
    ) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/ampliaciones/${ampliacionId}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al editar ampliación');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarAmpliacion = useCallback(
    async (proyectoId: number, ampliacionId: number) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/proyectos/${proyectoId}/ampliaciones/${ampliacionId}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Error al eliminar ampliación');
      return true;
    },
    [fetchWithAuth]
  );

  return { getAmpliaciones, crearAmpliacion, editarAmpliacion, eliminarAmpliacion };
};
