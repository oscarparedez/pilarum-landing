import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { Marca, Material, NuevoMaterial, Unidad } from '../types'; // Asegúrate de tener este tipo definido
import { useUnidadesApi } from '../unidades/useUnidadesApi';
import { useMarcasApi } from '../marcas/useMarcasApi';

export const useMaterialesApi = () => {
  const { fetchWithAuth } = useAuthApi();
  const { getUnidades } = useUnidadesApi();
  const { getMarcas } = useMarcasApi();

  const getMaterialesInfo = useCallback(async (): Promise<{
    materiales: Material[];
    unidades: Unidad[];
    marcas: Marca[];
  }> => {
    const [materiales, unidades, marcas] = await Promise.all([
      fetchWithAuth(`${API_BASE_URL}/material/`).then(async (res) => {
        if (!res.ok) throw new Error('Error al obtener materiales');
        return res.json();
      }),
      getUnidades(),
      getMarcas(),
    ]);

    return {
      materiales,
      unidades,
      marcas,
    };
  }, [fetchWithAuth, getUnidades, getMarcas]);

  const getMaterialById = useCallback(async (id: number): Promise<Material> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/material/${id}/`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error al obtener datos del material');
    return await res.json();
  }, [fetchWithAuth]);

  const crearMaterial = useCallback(async (material: NuevoMaterial): Promise<Material> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/material/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    if (!res.ok) throw new Error('Error al crear material');
    return await res.json();
  }, [fetchWithAuth]);

  const actualizarMaterial = useCallback(
    async (id: number, material: NuevoMaterial): Promise<Material> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/material/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material),
      });
      if (!res.ok) throw new Error('Error al actualizar material');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarMaterial = useCallback(async (id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/material/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar material');
  }, [fetchWithAuth]);

  return {
    getMaterialesInfo,
    getMaterialById,
    crearMaterial,
    actualizarMaterial,
    eliminarMaterial,
  };
};
