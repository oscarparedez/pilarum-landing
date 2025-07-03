import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { usePresupuestosApi } from '../presupuestos/usePresupuestosApi';
import { useIngresosApi } from '../ingresos/useIngresosApi';
import { usePagosApi } from '../pagos/usePagosApi';
import { useAmpliacionesApi } from '../ampliaciones/useAmpliacionesApi';
import { mapProyectoDatosBasicosToFrontend, mapProyectoToConfig } from './utils';
import { ConfigProyecto } from 'src/pages/proyectos/[id]/index.d';

export interface Proyecto {
  id: number;
  nombre: string;
  ubicacion: string;
  presupuestoInicial: number;
  socioAsignado: string;
  fechaInicio: string;
  fechaFin: string;
}

export const useProyectosApi = () => {
  const { fetchWithAuth } = useAuthApi();
  const { crearPresupuestoInicial, getPresupuestos } = usePresupuestosApi();
  const { getIngresos } = useIngresosApi();
  const { getPagos } = usePagosApi();
  const { getAmpliaciones } = useAmpliacionesApi();

  const getProyectos = useCallback(async (): Promise<Proyecto[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/`, { method: 'GET' });
    if (!res.ok) throw new Error('Error al obtener proyectos');
    return await res.json();
  }, [fetchWithAuth]);

  const getProyectoById = useCallback(
    async (id: number): Promise<Proyecto> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${id}/`, { method: 'GET' });
      if (!res.ok) throw new Error('Error al obtener proyecto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const eliminarProyecto = useCallback(
    async (id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar proyecto');
    },
    [fetchWithAuth]
  );

  const crearProyecto = useCallback(
    async (data: Omit<Proyecto, 'id'>): Promise<Proyecto> => {
      // 1. Crear el proyecto
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          ubicacion: data.ubicacion,
          fecha_inicio: data.fechaInicio,
          fecha_fin: data.fechaFin,
          socio_asignado: data.socioAsignado,
        }),
      });

      if (!res.ok) throw new Error('Error al crear proyecto');
      const proyectoCreado = await res.json();

      try {
        // 2. Intentar crear el presupuesto inicial
        await crearPresupuestoInicial(proyectoCreado.id, {
          monto: data.presupuestoInicial,
          motivo: 'Presupuesto inicial',
        });

        return {
          ...proyectoCreado,
          presupuestoInicial: data.presupuestoInicial,
        };
      } catch (error) {
        // ⚠️ Si falla el presupuesto, eliminar el proyecto usando la función ya definida
        try {
          await eliminarProyecto(proyectoCreado.id);
        } catch (rollbackError) {
          console.error('Error al hacer rollback del proyecto fallido:', rollbackError);
        }

        throw new Error('Error al crear presupuesto inicial, se deshizo el proyecto');
      }
    },
    [fetchWithAuth, crearPresupuestoInicial, eliminarProyecto]
  );

  const actualizarProyecto = useCallback(
    async (id: number, data: Omit<Proyecto, 'id'>): Promise<Proyecto> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar proyecto');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const getProyectoInfo = useCallback(
    async (id: number): Promise<ConfigProyecto> => {
      try {
        const [proyectoRaw, ingresos, pagos, ampliaciones, presupuestos] = await Promise.all([
          getProyectoById(id),
          getIngresos(id),
          getPagos(id),
          getAmpliaciones(id),
          getPresupuestos(id),
        ]);

        const proyecto = mapProyectoDatosBasicosToFrontend(proyectoRaw);

        return mapProyectoToConfig({
          nombre: proyecto.nombre,
          ubicacion: proyecto.ubicacion,
          fecha_inicio: proyecto.fechaInicio,
          fecha_fin: proyecto.fechaFin,
          socioAsignado: proyecto.socioAsignado,
          ingresos,
          pagos,
          ampliaciones,
          presupuestos,
        });
      } catch (error) {
        console.error('Error al obtener los datos del proyecto completo:', error);
        throw new Error('No se pudo obtener la información completa del proyecto');
      }
    },
    [getProyectoById, getIngresos, getPagos, getAmpliaciones, getPresupuestos]
  );

  return {
    getProyectos,
    getProyectoById,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto,
    getProyectoInfo,
  };
};
