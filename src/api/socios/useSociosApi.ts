import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevoSocio, Socio } from '../types';

export const useSociosApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getSocios = useCallback(async (): Promise<Socio[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/socios/`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Error al obtener socios');
    return await res.json();
  }, [fetchWithAuth]);

  const getSocioById = useCallback(
    async (id: number): Promise<Socio> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/socios/${id}/`, {
        method: 'GET',
      });

      if (!res.ok) throw new Error('Error al obtener socio');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const getSociosInternos = useCallback(async (): Promise<Socio[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/socios/?tipo=interno`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Error fetching socios internos');
    return await res.json();
  }, [fetchWithAuth]);

  const crearSocio = useCallback(
    async (socio: NuevoSocio): Promise<Socio> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/socios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socio),
      });

      if (!res.ok) throw new Error('Error al crear socio');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarSocio = useCallback(
    async (id: number, socio: NuevoSocio): Promise<Socio> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/socios/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socio),
      });

      if (!res.ok) throw new Error('Error al actualizar socio');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarSocio = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/socios/${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || 'Error al eliminar socio');
      }
    },
    [fetchWithAuth]
  );

  return {
    getSocios,
    getSocioById,
    getSociosInternos,
    crearSocio,
    actualizarSocio,
    eliminarSocio,
  };
};
