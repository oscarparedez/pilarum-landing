import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { calcularTotalCombustibleUltimoMes, calcularTotalServicios } from './utils';
import {
  ConfigMaquinaria,
  GastoOperativo,
  Maquinaria,
  MaquinariaGeneralConfig,
  NuevaMaquinaria,
  NuevoGastoOperativo,
} from '../types';
import { useAsignacionesMaquinariaApi } from '../asignacionesMaquinaria/useAsignacionesMaquinaria';

export const useMaquinariasApi = () => {
  const { fetchWithAuth } = useAuthApi();
  const { getAsignacionesPorMaquinaria } = useAsignacionesMaquinariaApi();

  // --- 📦 MAQUINARIA ---

  const getMaquinarias = useCallback(async (): Promise<Maquinaria[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener maquinarias');
    return await res.json();
  }, [fetchWithAuth]);

  const getMaquinariasConAsignaciones = useCallback(async (): Promise<
    MaquinariaGeneralConfig[]
  > => {
    const maquinarias = await getMaquinarias();

    const enriched = await Promise.all(
      maquinarias.map(async (m) => {
        try {
          const asignaciones = await getAsignacionesPorMaquinaria(m.id);
          return { ...m, asignaciones } as MaquinariaGeneralConfig;
        } catch {
          // Si falla una maquinaria, devolvemos su objeto con asignaciones vacías
          return { ...m, asignaciones: [] } as MaquinariaGeneralConfig;
        }
      })
    );

    return enriched;
  }, [getMaquinarias, getAsignacionesPorMaquinaria]);

  const getMaquinariaById = useCallback(
    async (id: number): Promise<Maquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/${id}/`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Error al obtener datos de la maquinaria');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const crearMaquinaria = useCallback(
    async (maquinaria: NuevaMaquinaria): Promise<Maquinaria> => {
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
    async (id: number, maquinaria: NuevaMaquinaria): Promise<Maquinaria> => {
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

  const actualizarEstadoMaquinaria = useCallback(
    async (id: number, estado: 'activo' | 'inactivo'): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado de la maquinaria');
    },
    [fetchWithAuth]
  );

  const eliminarMaquinaria = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Error al eliminar maquinaria');
      }
    },
    [fetchWithAuth]
  );

  // --- 📊 GASTOS OPERATIVOS ---

  const getGastosOperativosByMaquinaria = useCallback(
    async (maquinariaId: number): Promise<GastoOperativo[]> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) throw new Error('Error al obtener gastos operativos');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const getGastoOperativoById = useCallback(
    async (maquinariaId: number, id: number): Promise<GastoOperativo> => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/${id}/`,
        { method: 'GET' }
      );
      if (!res.ok) throw new Error('Error al obtener gasto operativo');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const crearGastoOperativo = useCallback(
    async (maquinariaId: number, data: NuevoGastoOperativo): Promise<GastoOperativo> => {
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

  const actualizarGastoOperativo = useCallback(
    async (
      maquinariaId: number,
      id: number,
      data: NuevoGastoOperativo
    ): Promise<GastoOperativo> => {
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

  // --- 🧠 INFO COMPUESTA ---

  const getMaquinariaInfo = useCallback(
    async (id: number): Promise<ConfigMaquinaria> => {
      const [maquinaria, gastosOperativos, asignaciones] = await Promise.all([
        getMaquinariaById(id),
        getGastosOperativosByMaquinaria(id),
        getAsignacionesPorMaquinaria(id),
      ]);

      const servicios = gastosOperativos.filter((g) => g.tipo_gasto === 2);
      const consumos = gastosOperativos.filter((g) => g.tipo_gasto === 1);

      return {
        id: maquinaria.id,
        nombre: maquinaria.nombre,
        identificador: maquinaria.identificador,
        tipo: maquinaria.tipo,
        estado: maquinaria.estado || 'activo', // Fallback to 'activo' if undefined
        costo: maquinaria.costo,
        fecha_compra: maquinaria.fecha_compra,
        tipo_documento: maquinaria.tipo_documento,
        anotaciones: maquinaria.anotaciones,
        totalServicios: calcularTotalServicios(gastosOperativos),
        totalCombustibleUltimoMes: calcularTotalCombustibleUltimoMes(gastosOperativos),
        asignaciones,
        servicios,
        consumos,
      };
    },
    [getMaquinariaById, getGastosOperativosByMaquinaria, getAsignacionesPorMaquinaria]
  );

  return {
    // 📦 Maquinaria
    getMaquinarias,
    getMaquinariasConAsignaciones,
    getMaquinariaById,
    crearMaquinaria,
    actualizarMaquinaria,
    actualizarEstadoMaquinaria,
    eliminarMaquinaria,

    // 📊 Gastos operativos
    getGastosOperativosByMaquinaria,
    getGastoOperativoById,
    crearGastoOperativo,
    actualizarGastoOperativo,
    eliminarGastoOperativo,

    // 🧠 Info compuesta
    getMaquinariaInfo,
  };
};
