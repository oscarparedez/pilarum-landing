import { useCallback } from 'react';
import { MovimientoInventario, NuevoMovimientoInventario } from 'src/api/types';
import { useAuthApi } from '../auth/useAuthApi';
import { API_BASE_URL } from 'src/config'; // tu constante con process.env.NEXT_PUBLIC_API_URL

export const useMovimientosInventarioApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getMovimientos = useCallback(async (): Promise<MovimientoInventario[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/inventario/movimientos-inventario/`);
    if (!res.ok) throw new Error('Error al obtener movimientos de inventario');
    return res.json();
  }, [fetchWithAuth]);

  const crearMovimientosOrden = useCallback(
    async (data: NuevoMovimientoInventario): Promise<MovimientoInventario[]> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/inventario/movimientos-inventario/orden/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al crear movimientos de inventario');
      return res.json();
    },
    [fetchWithAuth]
  );

  return {
    getMovimientos,
    crearMovimientosOrden,
  };
};
