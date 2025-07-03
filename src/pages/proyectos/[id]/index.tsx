import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
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

export const tareasEjemplo: Tarea[] = [
  /* ... tus tareas aquí ... */
];

const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();
  const router = useRouter();
  const { getProyectoInfo } = useProyectosApi();
  const { crearAmpliacion, editarAmpliacion, eliminarAmpliacion } = useAmpliacionesApi();

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

  const handleAmpliarFecha = async (nuevaFecha: Date, motivo: string) => {
    const id = router.query.id;
    if (!id || Array.isArray(id)) return;

    try {
      setLoading(true);
      await crearAmpliacion(parseInt(id), {
        nueva_fecha_estimada_fin: nuevaFecha.toISOString().split('T')[0],
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
  };

  const handleEditarAmpliacion = async (
    ampliacionId: number,
    data: { nueva_fecha_estimada_fin: string; motivo: string }
  ) => {
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
  };

  const handleEliminarAmpliacion = async (ampliacionId: number) => {
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
  };

  if (!config) return null;

  const {
    datosBasicos,
    ampliacionesPresupuesto,
    ampliacionesFecha,
    ingresos,
    pagos: costos,
    revisiones,
    maquinaria,
    personal,
    materialPlanificado,
  } = config;

  const { nombre, ubicacion, fechaInicio, fechaFin, socio, presupuestoInicial } = datosBasicos;

  const presupuestoTotal =
    presupuestoInicial + ampliacionesPresupuesto.reduce((acc, curr) => acc + (curr.monto ?? 0), 0);

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
              <Typography color="text.secondary">Empresa - {socio.nombre}</Typography>
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
            onAmpliarPresupuesto={() => console.log('Ampliar presupuesto')}
          />

          <Pizarron tareas={tareasEjemplo} />

          <ResumenFinanciero
            ingresos={ingresos}
            pagos={costos}
            presupuestoInicial={presupuestoTotal}
          />

          <EditarDatosBasicosModal
            open={modalEditarAbierto}
            onClose={() => setModalEditarAbierto(false)}
            initialData={datosBasicos}
            onConfirm={(data) => {
              setConfig((prev) => (prev ? { ...prev, datosBasicos: data } : prev));
              setModalEditarAbierto(false);
            }}
          />

          <Maquinaria maquinaria={maquinaria} />
          <PersonalAsignado personal={personal} />
          <MaterialPlanificado materialPlanificado={materialPlanificado} />
          <Revisiones revisiones={revisiones} />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
