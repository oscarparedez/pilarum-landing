import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { Proveedor, NuevoProveedor } from '../types';

export const useProveedoresApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getProveedores = useCallback(async (): Promise<Proveedor[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/proveedores/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener proveedores');
    return await res.json();
  }, [fetchWithAuth]);

  const getProveedorById = useCallback(
    async (id: number): Promise<Proveedor> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proveedores/${id}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener proveedor');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const crearProveedor = useCallback(
    async (proveedor: NuevoProveedor): Promise<Proveedor> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proveedores/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor),
      });
      if (!res.ok) throw new Error('Error al crear proveedor');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarProveedor = useCallback(
    async (id: number, proveedor: NuevoProveedor): Promise<Proveedor> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proveedores/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor),
      });
      if (!res.ok) throw new Error('Error al actualizar proveedor');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarProveedor = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proveedores/${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Error al eliminar proveedor');
      }
    },
    [fetchWithAuth]
  );

  return {
    getProveedores,
    getProveedorById,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
  };
};
