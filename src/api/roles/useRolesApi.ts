import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevoRol, Rol } from '../types';

export const useRolesApi = () => {
  const { fetchWithAuth } = useAuthApi();

  // GET /api/roles/
  const getRoles = useCallback(async (): Promise<Rol[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/roles/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener roles');
    return await res.json();
  }, [fetchWithAuth]);

  // GET /api/roles/{id}/
  const getRolById = useCallback(async (id: number): Promise<Rol> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/roles/${id}/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener rol');
    return await res.json();
  }, [fetchWithAuth]);

  // POST /api/roles/
  const crearRol = useCallback(async (data: NuevoRol): Promise<Rol> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/roles/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear rol');
    return await res.json();
  }, [fetchWithAuth]);

  // PATCH /api/roles/{id}/
  const actualizarRol = useCallback(
    async (id: number, data: Partial<NuevoRol>): Promise<Rol> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/roles/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar rol');
      return await res.json();
    },
    [fetchWithAuth]
  );

  // DELETE /api/roles/{id}/
  const eliminarRol = useCallback(async (id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/roles/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar rol');
  }, [fetchWithAuth]);

  return {
    getRoles,
    getRolById,
    crearRol,
    actualizarRol,
    eliminarRol,
  };
};
