import type { NextPage } from 'next';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';

import { Timeline } from './timeline/timeline';
import { ResumenFinanciero } from './resumen-financiero/resumen-financiero';
import { MaterialPlanificado } from './material-planificado/material-planificado';
import { Revisiones } from './revisiones/revisiones';
import { Maquinaria } from './maquinaria/maquinaria';
import { PersonalAsignado } from './personal/personal';
import { EditarDatosBasicosModal } from './editar-datos-modal';
import { ConfigProyecto, Tarea } from './index.d';
import { Pizarron } from './pizarron/pizarron';
import { useAmpliacionesApi } from 'src/api/ampliaciones/useAmpliacionesApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import toast from 'react-hot-toast';
import { usePresupuestosApi } from 'src/api/presupuestos/usePresupuestosApi';
import { useIngresosApi } from 'src/api/ingresos/useIngresosApi';
import { usePagosApi } from 'src/api/pagos/usePagosApi';
import { useAsignacionesMaquinariaApi } from 'src/api/asignacionesMaquinaria/useAsignacionesMaquinaria';
import { useAsignacionesPersonalApi } from 'src/api/asignacionesPersonal/useAsignacionesPersonal';
import { useRevisionesApi } from 'src/api/revisiones/useRevisionesApi';
import { NuevaAsignacionMaquinaria, NuevaRevision, NuevoProyecto, Proyecto } from 'src/api/types';
import { format } from 'date-fns';

export const tareasEjemplo: Tarea[] = [];

const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();
  const router = useRouter();
  const { getProyectoInfo, actualizarProyecto } = useProyectosApi();
  const { crearAmpliacion, editarAmpliacion, eliminarAmpliacion } = useAmpliacionesApi();
  const { crearPresupuestoAmpliacion, actualizarPresupuesto, eliminarPresupuesto } =
    usePresupuestosApi();
  const { crearIngreso, actualizarIngreso, eliminarIngreso } = useIngresosApi();
  const { crearPago, actualizarPago, eliminarPago } = usePagosApi();
  const {
    crearAsignacionEnProyecto: crearAsignacionMaquinaria,
    actualizarAsignacionEnProyecto: actualizarAsignacionMaquinaria,
    eliminarAsignacionEnProyecto: eliminarAsignacionMaquinaria,
  } = useAsignacionesMaquinariaApi();
  const {
    crearAsignacion: crearAsignacionPersonal,
    actualizarAsignacion: actualizarAsignacionPersonal,
    liberarAsignacion,
    eliminarAsignacion: eliminarAsignacionPersonal,
  } = useAsignacionesPersonalApi();

  const { crearRevision, actualizarRevision, eliminarRevision } = useRevisionesApi();

  const [config, setConfig] = useState<ConfigProyecto | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        const proyecto = await getProyectoInfo(parseInt(id, 10));
        setConfig(proyecto);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.query.id, getProyectoInfo]);

  const handleActualizarProyecto = useCallback(
    async (data: NuevoProyecto) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await actualizarProyecto(parseInt(id), data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Datos del proyecto actualizados correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al actualizar los datos del proyecto');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, actualizarProyecto, getProyectoInfo]
  );

  const handleAmpliarFecha = useCallback(
    async (nuevaFecha: Date, motivo: string) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await crearAmpliacion(parseInt(id), {
          nueva_fecha_estimada_fin: format(nuevaFecha, 'yyyy-MM-dd'),
          motivo,
        });
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Fecha ampliada exitosamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al ampliar la fecha');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, crearAmpliacion, getProyectoInfo]
  );

  const handleEditarAmpliacion = useCallback(
    async (ampliacionId: number, data: { nueva_fecha_estimada_fin: string; motivo: string }) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await editarAmpliacion(parseInt(id), ampliacionId, data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Ampliación editada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al editar la ampliación');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, editarAmpliacion, getProyectoInfo]
  );

  const handleEliminarAmpliacion = useCallback(
    async (ampliacionId: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await eliminarAmpliacion(parseInt(id), ampliacionId);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Ampliación eliminada');
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar la ampliación');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, eliminarAmpliacion, getProyectoInfo]
  );

  const handleAmpliarPresupuesto = useCallback(
    async (data: { monto: number; motivo?: string }) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await crearPresupuestoAmpliacion(parseInt(id), data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Presupuesto ampliado exitosamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al ampliar presupuesto');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, crearPresupuestoAmpliacion, getProyectoInfo]
  );

  const handleEditarAmpliacionPresupuesto = useCallback(
    async (presupuestoId: number, data: { monto: number; motivo?: string }) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await actualizarPresupuesto(parseInt(id), presupuestoId, { ...data });
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Ampliación de presupuesto editada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al editar ampliación de presupuesto');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, actualizarPresupuesto, getProyectoInfo]
  );

  const handleEliminarAmpliacionPresupuesto = useCallback(
    async (presupuestoId: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await eliminarPresupuesto(parseInt(id), presupuestoId);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Ampliación de presupuesto eliminada');
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar ampliación de presupuesto');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, eliminarPresupuesto, getProyectoInfo]
  );

  const handleCrearIngreso = useCallback(
    async (data: {
      monto_total: number;
      tipo_ingreso: number;
      tipo_documento: string;
      fecha_ingreso: string;
      anotaciones?: string;
      correlativo?: string;
    }) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;
      try {
        await crearIngreso(parseInt(id), data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Ingreso registrado correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al registrar ingreso');
      }
    },
    [router.query.id, crearIngreso, getProyectoInfo]
  );

  const handleActualizarIngreso = useCallback(
    async (
      ingreso_id: number,
      data: {
        fecha_ingreso: string;
        monto_total: number;
        tipo_ingreso: number;
        tipo_documento: string;
        anotaciones?: string;
        correlativo?: string;
      }
    ) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;
      try {
        await actualizarIngreso(parseInt(id), ingreso_id, data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Ingreso actualizado correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al actualizar ingreso');
      }
    },
    [router.query.id, actualizarIngreso, getProyectoInfo]
  );

  const handleEliminarIngreso = useCallback(
    async (ingresoId: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await eliminarIngreso(parseInt(id), ingresoId);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Ingreso eliminado correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar ingreso');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, eliminarIngreso, getProyectoInfo]
  );

  const handleCrearPago = useCallback(
    async (data: {
      monto_total: number;
      tipo_pago: number;
      tipo_documento: string;
      fecha_pago: string;
      anotaciones?: string;
      correlativo?: string;
    }) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;
      try {
        await crearPago(parseInt(id), data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Pago registrado correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al registrar pago');
      }
    },
    [router.query.id, crearPago, getProyectoInfo]
  );

  const handleActualizarPago = useCallback(
    async (
      pago_id: number,
      data: {
        fecha_pago: string;
        monto_total: number;
        tipo_pago: number;
        tipo_documento: string;
        anotaciones?: string;
        correlativo?: string;
      }
    ) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;
      try {
        await actualizarPago(parseInt(id), pago_id, data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Pago actualizado correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al actualizar pago');
      }
    },
    [router.query.id, actualizarPago, getProyectoInfo]
  );

  const handleEliminarPago = useCallback(
    async (pagoId: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await eliminarPago(parseInt(id), pagoId);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Pago eliminado correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar pago');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, eliminarPago, getProyectoInfo]
  );

  const handleCrearAsignacionMaquinaria = useCallback(
    async (data: {
      equipo: number;
      dias_asignados: string[];
      fecha_fin: string;
      usuario_recibe: number;
    }) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);

        await crearAsignacionMaquinaria(parseInt(id), data);

        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Maquinaria asignada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al asignar maquinaria');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, crearAsignacionMaquinaria, getProyectoInfo]
  );

  const handleActualizarAsignacionMaquinaria = useCallback(
    async (asignacion_id: number, data: NuevaAsignacionMaquinaria) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await actualizarAsignacionMaquinaria(parseInt(id), asignacion_id, data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Asignación de maquinaria actualizada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al actualizar asignación de maquinaria');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, actualizarAsignacionMaquinaria, getProyectoInfo]
  );

  const handleLiberarAsignacionMaquinaria = useCallback(
    async (asignacion_id: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);

        const hoy = format(new Date(), 'yyyy-MM-dd');

        await actualizarAsignacionMaquinaria(parseInt(id), asignacion_id, {
          fecha_fin: hoy,
        });

        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Asignación de maquinaria liberada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al liberar asignación de maquinaria');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, actualizarAsignacionMaquinaria, getProyectoInfo]
  );

  const handleEliminarAsignacionMaquinaria = useCallback(
    async (asignacion_id: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await eliminarAsignacionMaquinaria(parseInt(id), asignacion_id);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Asignación de maquinaria eliminada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar asignación de maquinaria');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, eliminarAsignacionMaquinaria, getProyectoInfo]
  );

  const handleCrearAsignacionPersonal = useCallback(
    async (data: {
      usuario_id: number;
      dias_asignados: string[];
      fecha_entrada: string;
      fecha_fin: string;
    }) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);

        await crearAsignacionPersonal(parseInt(id), data);

        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Personal asignado correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al asignar personal');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, crearAsignacionPersonal, getProyectoInfo]
  );

  const handleActualizarAsignacionPersonal = useCallback(
    async (
      asignacion_id: number,
      data: {
        usuario_id: number;
        dias_asignados: string[];
        fecha_entrada: string;
        fecha_fin: string;
      }
    ) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);

        await actualizarAsignacionPersonal(parseInt(id), asignacion_id, data);

        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Asignación de personal actualizada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al actualizar asignación de personal');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, actualizarAsignacionPersonal, getProyectoInfo]
  );

  const handleLiberarAsignacionPersonal = useCallback(
    async (asignacion_id: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await liberarAsignacion(parseInt(id), asignacion_id);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Asignación de personal liberada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al liberar asignación de personal');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, liberarAsignacion, getProyectoInfo]
  );

  const handleEliminarAsignacionPersonal = useCallback(
    async (asignacion_id: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        await eliminarAsignacionPersonal(parseInt(id), asignacion_id);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Asignación de personal eliminada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar asignación de personal');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, eliminarAsignacionPersonal, getProyectoInfo]
  );

  const handleCrearRevision = useCallback(
    async (data: NuevaRevision) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        const revision = await crearRevision(parseInt(id), data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Revisión creada correctamente');
        return revision;
      } catch (error) {
        console.error(error);
        toast.error('Error al crear revisión');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, crearRevision, getProyectoInfo]
  );

  const handleActualizarRevision = useCallback(
    async (revisionId: number, data: NuevaRevision) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;

      try {
        setLoading(true);
        const revision = await actualizarRevision(parseInt(id), revisionId, data);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Revisión actualizada correctamente');
        return revision;
      } catch (error) {
        console.error(error);
        toast.error('Error al actualizar revisión');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, actualizarRevision, getProyectoInfo]
  );

  const handleEliminarRevision = useCallback(
    async (revisionId: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;
      try {
        setLoading(true);
        await eliminarRevision(parseInt(id), revisionId);
        const updated = await getProyectoInfo(parseInt(id));
        setConfig(updated);
        toast.success('Revisión eliminada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar revisión');
      } finally {
        setLoading(false);
      }
    },
    [router.query.id, eliminarRevision, getProyectoInfo]
  );

  if (!config) return null;

  const {
    datosBasicos,
    socios,
    presupuestoTotal,
    ampliacionesPresupuesto,
    ampliacionesFecha,
    ingresos,
    pagos: costos,
    maquinaria,
    asignacionesMaquinaria,
    materialPlanificado,
    tiposIngreso,
    tiposPago,
    usuarios,
    asignacionesPersonal,
    revisiones,
    totalIngresos,
    totalPagos,
  } = config;

  const { id, nombre, ubicacion, fechaInicio, fechaFin, socioAsignado, presupuestoInicial } =
    datosBasicos;

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 8 }}
    >
      {loading && <FullPageLoader />}
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            px={3}
          >
            <Box>
              <Typography variant="h4">{nombre}</Typography>
              <Typography color="text.secondary">{ubicacion}</Typography>
              <Typography color="text.secondary">Empresa - {socioAsignado.nombre}</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setModalEditarAbierto(true)}
            >
              Editar datos básicos
            </Button>
          </Stack>

          <Timeline
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            presupuestoInicial={presupuestoTotal}
            ampliacionesFecha={ampliacionesFecha}
            ampliacionesPresupuesto={ampliacionesPresupuesto}
            onAmpliarFecha={handleAmpliarFecha}
            onEditarAmpliacion={handleEditarAmpliacion}
            onEliminarAmpliacion={handleEliminarAmpliacion}
            onAmpliarPresupuesto={handleAmpliarPresupuesto}
            onEditarAmpliacionPresupuesto={handleEditarAmpliacionPresupuesto}
            onEliminarAmpliacionPresupuesto={handleEliminarAmpliacionPresupuesto}
          />

          <Pizarron tareas={tareasEjemplo} />

          <ResumenFinanciero
            totalIngresos={totalIngresos}
            totalPagos={totalPagos}
            ingresos={ingresos}
            pagos={costos}
            tiposIngreso={tiposIngreso}
            tiposPago={tiposPago}
            presupuestoInicial={presupuestoInicial}
            onCrearIngreso={handleCrearIngreso}
            onActualizarIngreso={handleActualizarIngreso}
            onEliminarIngreso={handleEliminarIngreso}
            onCrearPago={handleCrearPago}
            onActualizarPago={handleActualizarPago}
            onEliminarPago={handleEliminarPago}
          />

          <EditarDatosBasicosModal
            open={modalEditarAbierto}
            onClose={() => setModalEditarAbierto(false)}
            initialData={datosBasicos}
            socios={socios}
            onEditarDatosBasicos={handleActualizarProyecto}
          />

          <Maquinaria
            maquinaria={maquinaria}
            usuarios={usuarios}
            asignacionesMaquinaria={asignacionesMaquinaria}
            handleCrearAsignacion={handleCrearAsignacionMaquinaria}
            handleActualizarAsignacion={handleActualizarAsignacionMaquinaria}
            handleLiberarAsignacion={handleLiberarAsignacionMaquinaria}
            handleEliminarAsignacion={handleEliminarAsignacionMaquinaria}
          />
          <PersonalAsignado
            usuarios={usuarios}
            asignacionesPersonal={asignacionesPersonal}
            handleCrearAsignacionPersonal={handleCrearAsignacionPersonal}
            handleActualizarAsignacionPersonal={handleActualizarAsignacionPersonal}
            handleLiberarAsignacionPersonal={handleLiberarAsignacionPersonal}
            handleEliminarAsignacionPersonal={handleEliminarAsignacionPersonal}
          />
          <MaterialPlanificado materialPlanificado={materialPlanificado} />
          <Revisiones
            revisiones={revisiones}
            handleCrearRevision={handleCrearRevision}
            handleActualizarRevision={handleActualizarRevision}
            handleEliminarRevision={handleEliminarRevision}
          />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
