import { useCallback } from 'react';
import {
  OrdenMovimientoInventario,
  NuevaOrdenMovimientoInventario,
  Inventario,
  InventarioConMovimientos,
} from 'src/api/types';
import { useAuthApi } from '../auth/useAuthApi';
import { API_BASE_URL } from 'src/config';

export const useMovimientosInventarioApi = () => {
  const { fetchWithAuth } = useAuthApi();

  // Listar todas las órdenes
  const getOrdenesMovimientoInventario = useCallback(async (): Promise<OrdenMovimientoInventario[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-movimiento-inventario/`);
    if (!res.ok) throw new Error('Error al obtener órdenes de traslado de inventario');
    return res.json();
  }, [fetchWithAuth]);

  // Crear una orden
  const crearOrdenMovimientoInventario = useCallback(
    async (data: NuevaOrdenMovimientoInventario): Promise<OrdenMovimientoInventario> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-movimiento-inventario/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear orden de traslado de inventario');
      return res.json();
    },
    [fetchWithAuth]
  );

  // Obtener una orden por ID
  const getOrdenById = useCallback(
    async (id: number): Promise<OrdenMovimientoInventario> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-movimiento-inventario/${id}/`);
      if (!res.ok) throw new Error('Error al obtener orden de movimiento');
      return res.json();
    },
    [fetchWithAuth]
  );

  // Actualizar (PUT/PATCH)
  const updateOrden = useCallback(
    async (id: number, data: Partial<NuevaOrdenMovimientoInventario>): Promise<OrdenMovimientoInventario> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-movimiento-inventario/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar orden de traslado de inventario');
      return res.json();
    },
    [fetchWithAuth]
  );

  // Eliminar
  const deleteOrden = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/ordenes-movimiento-inventario/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar orden de traslado de inventario');
    },
    [fetchWithAuth]
  );

  const getMovimientosPorInventario = useCallback(
    async (inventarioId: number): Promise<InventarioConMovimientos> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventario/${inventarioId}/movimientos/`);
      if (!res.ok) throw new Error('Error al obtener movimientos del inventario');
      return res.json();
    },
    [fetchWithAuth]
  );

  const getMovimientosPorInventarioPorProyecto = useCallback(
    async (proyectoId: number, inventarioId: number): Promise<InventarioConMovimientos> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyecto/${proyectoId}/inventario/${inventarioId}/movimientos/`);
      if (!res.ok) throw new Error('Error al obtener movimientos del inventario por proyecto');
      return res.json();
    },
    [fetchWithAuth]
  );

  return {
    getOrdenesMovimientoInventario,
    crearOrdenMovimientoInventario,
    getOrdenById,
    updateOrden,
    deleteOrden,
    getMovimientosPorInventario,
    getMovimientosPorInventarioPorProyecto
  };
};
