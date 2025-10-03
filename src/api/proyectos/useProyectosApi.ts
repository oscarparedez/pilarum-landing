import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { usePresupuestosApi } from '../presupuestos/usePresupuestosApi';
import { useIngresosApi } from '../ingresos/useIngresosApi';
import { usePagosApi } from '../pagos/usePagosApi';
import { useAmpliacionesApi } from '../ampliaciones/useAmpliacionesApi';
import { mapProyectoDatosBasicosToFrontend, mapProyectoToConfig } from './utils';
import { useTiposIngresoApi } from '../tipoIngresos/useTipoIngresosApi';
import { useTiposPagoApi } from '../tipoPagos/useTipoPagosApi';
import { useMaquinariasApi } from '../maquinaria/useMaquinariaApi';
import { usePlanillaApi } from '../planilla/usePlanillaApi';
import { useAsignacionesPersonalApi } from '../asignacionesPersonal/useAsignacionesPersonal';
import { useAsignacionesMaquinariaApi } from '../asignacionesMaquinaria/useAsignacionesMaquinaria';
import { useRevisionesApi } from '../revisiones/useRevisionesApi';
import { useSociosApi } from '../socios/useSociosApi';
import { ConfigProyecto, NuevoProyecto, Proyecto } from 'src/api/types';
import { useInventarioApi } from '../inventario/useInventarioApi';

export type ProyectosQuery = { socio?: number | string };

const buildQuery = (q?: ProyectosQuery) => {
  if (!q?.socio) return '';
  const p = new URLSearchParams({ socio: String(q.socio) });
  return `?${p.toString()}`;
};

export const useProyectosApi = () => {
  const { fetchWithAuth } = useAuthApi();
  const { getSociosInternos } = useSociosApi();
  const { crearPresupuestoInicial, getPresupuestos } = usePresupuestosApi();
  const { getIngresos } = useIngresosApi();
  const { getPagos } = usePagosApi();
  const { getAmpliaciones } = useAmpliacionesApi();
  const { getTiposIngreso } = useTiposIngresoApi();
  const { getTiposPago } = useTiposPagoApi();
  const { getMaquinarias } = useMaquinariasApi();
  const { getAsignacionesPorProyecto: getAsignacionesMaquinaria } = useAsignacionesMaquinariaApi();
  const { getUsuariosActivos } = usePlanillaApi();
  const { getAsignaciones: getAsignacionesPersonal } = useAsignacionesPersonalApi();
  const { getInventarioPorProyecto: getInventario } = useInventarioApi();
  const { getRevisiones } = useRevisionesApi();

  const getProyectos = useCallback(
    async (query?: ProyectosQuery): Promise<Proyecto[]> => {
      const url = `${API_BASE_URL}/proyectos/${buildQuery(query)}`;
      const res = await fetchWithAuth(url, { method: 'GET' });
      if (!res.ok) throw new Error('Error al obtener proyectos');
      const rawData = await res.json();
      return rawData.map(mapProyectoDatosBasicosToFrontend);
    },
    [fetchWithAuth]
  );

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
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Error al eliminar proyecto'); // Mensaje genérico
      }
    },
    [fetchWithAuth]
  );

  const crearProyecto = useCallback(
    async (data: NuevoProyecto): Promise<Proyecto> => {
      // 1. Crear el proyecto
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          ubicacion: data.ubicacion,
          identificador: data.identificador,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          socio_asignado: data.socio_asignado,
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
    async (id: number, data: NuevoProyecto): Promise<Proyecto> => {
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

  const actualizarEstadoProyecto = useCallback(
    async (
      id: number,
      estado: 'pendiente' | 'en_progreso' | 'pausado' | 'completado' | 'archivado'
    ): Promise<void> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/proyectos/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado del proyecto');
    },
    [fetchWithAuth]
  );

  const getProyectoInfo = useCallback(
    async (id: number): Promise<ConfigProyecto> => {
      try {
        const [
          proyectoRaw,
          socios,
          ingresos,
          pagos,
          ampliaciones,
          presupuestos,
          tiposIngreso,
          tiposPago,
          maquinaria,
          asignacionesMaquinaria,
          usuarios,
          asignacionesPersonal,
          materialPlanificado,
          revisiones,
        ] = await Promise.all([
          getProyectoById(id),
          getSociosInternos(),
          getIngresos(id),
          getPagos(id),
          getAmpliaciones(id),
          getPresupuestos(id),
          getTiposIngreso(),
          getTiposPago(),
          getMaquinarias(),
          getAsignacionesMaquinaria(id),
          getUsuariosActivos(),
          getAsignacionesPersonal(id),
          getInventario(id),
          getRevisiones(id),
        ]);

        const proyecto = mapProyectoDatosBasicosToFrontend(proyectoRaw);

        return mapProyectoToConfig({
          id: proyecto.id,
          nombre: proyecto.nombre,
          ubicacion: proyecto.ubicacion,
          identificador: proyecto.identificador,
          fecha_inicio: proyecto.fechaInicio,
          fecha_fin: proyecto.fechaFin,
          estado: proyecto.estado,
          socio_asignado: proyecto.socio_asignado,
          socios: socios,
          ingresos,
          pagos,
          ampliaciones,
          presupuestos,
          tiposIngreso,
          tiposPago,
          maquinaria,
          asignacionesMaquinaria,
          usuarios,
          asignacionesPersonal,
          materialPlanificado,
          revisiones,
        });
      } catch (error) {
        console.error('Error al obtener los datos del proyecto completo:', error);
        throw new Error('No se pudo obtener la información completa del proyecto');
      }
    },
    [
      getProyectoById,
      getIngresos,
      getPagos,
      getAmpliaciones,
      getPresupuestos,
      getTiposIngreso,
      getTiposPago,
      getAsignacionesMaquinaria,
      getMaquinarias,
      getUsuariosActivos,
      getAsignacionesPersonal,
      getRevisiones,
      getSociosInternos,
      getInventario,
    ]
  );

  return {
    getProyectos,
    getProyectoById,
    crearProyecto,
    actualizarProyecto,
    actualizarEstadoProyecto,
    eliminarProyecto,
    getProyectoInfo,
  };
};
