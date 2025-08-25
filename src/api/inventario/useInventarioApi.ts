import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { Inventario, InventarioConfig } from '../types';

export const useInventarioApi = () => {
  const { fetchWithAuth } = useAuthApi();

  /** Obtener todo el inventario */
  const getInventario = useCallback(async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/inventario/`, { method: 'GET' });
    if (!res.ok) throw new Error('Error al obtener inventario');
    return (await res.json()) as InventarioConfig;
  }, [fetchWithAuth]);

  /** Obtener inventario filtrado por material */
  const getInventarioPorMaterial = useCallback(
    async (materialId: number) => {
      let url = `${API_BASE_URL}/movimientos-inventario/filtrar/${materialId}/`;

      const res = await fetchWithAuth(url, {
        method: 'GET',
      });

      if (!res.ok) throw new Error('Error al obtener inventario por material');

      return (await res.json()) as Inventario;
    },
    [fetchWithAuth]
  );

  const getInventarioPorProyecto = useCallback(
    async (proyectoId: number) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/inventario/proyecto/${proyectoId}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener inventario por proyecto');
      return (await res.json()) as InventarioConfig;
    },
    [fetchWithAuth]
  );

  const getInventarioPorProyectoYMaterial = useCallback(
    async (proyectoId: number, materialId: number) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/inventario/proyecto/${proyectoId}/material/${materialId}/`,
        { method: 'GET' }
      );
      if (!res.ok) throw new Error('Error al obtener inventario por proyecto y material');
      return (await res.json()) as Inventario;
    },
    [fetchWithAuth]
  );

  return {
    getInventario,
    getInventarioPorMaterial,
    getInventarioPorProyecto,
    getInventarioPorProyectoYMaterial
  };
};
