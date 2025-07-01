import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { calcularTotalCombustibleUltimoMes, calcularTotalServicios } from './utils';
import { ConfigMaquinaria, Consumo, Servicio, Asignacion } from 'src/pages/maquinaria/[id]/index.d';

export interface Maquinaria {
  id: number;
  tipo: 'maquinaria' | 'herramienta';
  nombre: string;
  identificador?: string;
  costo: number;
  [key: string]: any; // para permitir campos extra como asignaciones, servicios, etc.
}

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
        // fetchWithAuth(`${API_BASE_URL}/asignaciones/?maquinaria_id=${id}`),
      ]);

      if (!maquinariaRes.ok || !gastosOperativosRes.ok) {
        throw new Error('Error al obtener datos de la maquinaria');
      }

      const maquinaria = await maquinariaRes.json();
      const gastosOperativos: Consumo[] = await gastosOperativosRes.json();
      // const asignaciones: Asignacion[] = await asignacionesRes.json();

      return {
        nombre: maquinaria.nombre,
        identificador: maquinaria.identificador,
        tipo: maquinaria.tipo,
        costo: maquinaria.costo,
        totalServicios: calcularTotalServicios(gastosOperativos),
        totalCombustibleUltimoMes: calcularTotalCombustibleUltimoMes(gastosOperativos),
        asignaciones: [],
        servicios: [],
        consumos: []
        // asignaciones,
        // servicios,
        // consumos,
      };
    },
    [fetchWithAuth]
  );

  const crearMaquinaria = useCallback(
    async (maquinaria: Omit<Maquinaria, 'id'>): Promise<Maquinaria> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/maquinarias/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maquinaria),
    });

    console.log("RES RESPONSE JSON STRINGIFY:", JSON.stringify(maquinaria), JSON.stringify(res));

    if (!res.ok) throw new Error('Error al actualizar la maquinaria');
    return await res.json();
  },
  [fetchWithAuth]
);

  return {
    getMaquinarias,
    getMaquinariaById,
    crearMaquinaria,
    actualizarMaquinaria
  };
};
