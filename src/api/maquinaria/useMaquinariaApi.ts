import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { calcularTotalCombustibleUltimoMes, calcularTotalServicios } from './utils';
import { ConfigMaquinaria, GastoMaquinaria } from 'src/pages/maquinaria/[id]/index.d';
import { Maquinaria } from '../types';

export const useMaquinariasApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getMaquinarias = useCallback(async (): Promise<Maquinaria[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener maquinarias');
    return await res.json();
  }, [fetchWithAuth]);

  const getMaquinariaById = useCallback(
    async (id: number): Promise<ConfigMaquinaria> => {
      const [maquinariaRes, gastosOperativosRes] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/maquinarias/${id}`),
        fetchWithAuth(`${API_BASE_URL}/maquinarias/${id}/gastos-operativos/`),
      ]);

      if (!maquinariaRes.ok || !gastosOperativosRes.ok) {
        throw new Error('Error al obtener datos de la maquinaria');
      }

      const maquinaria = await maquinariaRes.json();
      const gastosOperativos: GastoMaquinaria[] = await gastosOperativosRes.json();

      return {
        nombre: maquinaria.nombre,
        identificador: maquinaria.identificador,
        tipo: maquinaria.tipo,
        costo: maquinaria.costo,
        totalServicios: calcularTotalServicios(gastosOperativos),
        totalCombustibleUltimoMes: calcularTotalCombustibleUltimoMes(gastosOperativos),
        asignaciones: [],
        servicios: [],
        consumos: [],
      };
    },
    [fetchWithAuth]
  );

  const crearMaquinaria = useCallback(
    async (maquinaria: Omit<Maquinaria, 'id'>): Promise<Maquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maquinaria),
      });
      if (!res.ok) throw new Error('Error al crear maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarMaquinaria = useCallback(
    async (id: number, maquinaria: Omit<Maquinaria, 'id'>): Promise<Maquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maquinaria),
      });

      if (!res.ok) throw new Error('Error al actualizar la maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarMaquinaria = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar maquinaria');
    },
    [fetchWithAuth]
  );

  const crearGastoOperativo = useCallback(
    async (maquinariaId: number, data: Omit<GastoMaquinaria, 'id'>): Promise<GastoMaquinaria> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al crear gasto operativo');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const getGastoOperativoById = useCallback(
    async (maquinariaId: number, id: number): Promise<GastoMaquinaria> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/${id}/`,
        { method: 'GET' }
      );
      if (!res.ok) throw new Error('Error al obtener gasto operativo');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarGastoOperativo = useCallback(
    async (
      maquinariaId: number,
      id: number,
      data: Partial<GastoMaquinaria>
    ): Promise<GastoMaquinaria> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/${id}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error('Error al actualizar gasto operativo');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarGastoOperativo = useCallback(
    async (maquinariaId: number, id: number): Promise<void> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/${id}/`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Error al eliminar gasto operativo');
    },
    [fetchWithAuth]
  );

  return {
    getMaquinarias,
    getMaquinariaById,
    crearMaquinaria,
    actualizarMaquinaria,
    eliminarMaquinaria,
    crearGastoOperativo,
    getGastoOperativoById,
    actualizarGastoOperativo,
    eliminarGastoOperativo,
  };
};
