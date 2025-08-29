import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { ActualizarGastoOperativo, NuevoGastoOperativo } from '../types';

export const useGastosOperativosApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getGastosOperativos = useCallback(
    async (maquinariaId: number | string) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) throw new Error('Error al obtener gastos operativos');
      const data = await res.json();
      return data;
    },
    [fetchWithAuth]
  );

  const getGastoOperativoById = useCallback(
    async (maquinariaId: number | string, gastoId: number) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/${gastoId}/`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) throw new Error('Error al obtener gasto operativo');
      const data = await res.json();
      return data;
    },
    [fetchWithAuth]
  );

  const crearGastoOperativo = useCallback(
    async (maquinariaId: number | string, data: NuevoGastoOperativo) => {
      const formData = new FormData();

      formData.append('descripcion', data.descripcion);
      formData.append('fecha_gasto', data.fecha);
      formData.append('costo', String(data.costo));
      formData.append('tipo_gasto', String(data.tipo_gasto));

      data.fotos?.forEach((file) => {
        formData.append('fotos', file);
      });

      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) throw new Error('Error al crear gasto operativo');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarGastoOperativo = useCallback(
  async (maquinariaId: number | string, gastoId: number, data: ActualizarGastoOperativo) => {
    const formData = new FormData();
    formData.append('descripcion', data.descripcion);
    formData.append('fecha_gasto', data.fecha);                 // backend espera fecha_gasto
    formData.append('costo', String(data.costo));
    formData.append('tipo_gasto', String(data.tipo_gasto));     // "2"
    formData.append('tipo_documento', data.tipo_documento);     // cheque/efectivo/transferencia

    const key = 'mantener_ids';
      data.mantener_ids.forEach((id) => {
        formData.append(key, String(id)); // DRF acepta string numérica
    });

    // nuevas fotos
    data.fotos?.forEach((file) => {
      formData.append('fotos', file); // o 'fotos[]' si el backend lo requiere
    });

    const res = await fetchWithAuth(
      `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/${gastoId}/`,
      { method: 'PUT', body: formData } // no seteés Content-Type manualmente
    );

    if (!res.ok) throw new Error('Error al actualizar gasto operativo');
    return await res.json();
  },
  [fetchWithAuth]
);


  const eliminarGastoOperativo = useCallback(
    async (maquinariaId: number | string, gastoId: number) => {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/maquinarias/${maquinariaId}/gastos-operativos/${gastoId}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Error al eliminar gasto operativo');
    },
    [fetchWithAuth]
  );

  return {
    getGastosOperativos,
    getGastoOperativoById,
    crearGastoOperativo,
    actualizarGastoOperativo,
    eliminarGastoOperativo,
  };
};
