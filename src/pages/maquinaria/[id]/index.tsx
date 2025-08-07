import type { NextPage } from 'next';
import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { EstadisticasRapidas } from './estadisticas-rapidas/estadisticas-rapidas';
import { Asignaciones } from './asignaciones/asignaciones';
import { HistorialServicios } from './historial-servicios/historial-servicios';
import { HistorialConsumos } from './historial-consumos/historial-consumos';
import { EditarDatosBasicosModal } from './editar-datos-modal';
import { ConfigMaquinaria, TipoMaquinaria } from './index.d';
import toast from 'react-hot-toast';
import { useMaquinariasApi } from 'src/api/maquinaria/useMaquinariaApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import { useGastosOperativosApi } from 'src/api/gastosOperativosMaquinaria/useGastosOperativosMaquinariaApi';
import { NuevoGastoOperativo } from 'src/api/types';

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  const { id } = router.query;
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [data, setData] = useState<ConfigMaquinaria | null>(null);
  const [loading, setLoading] = useState(false);

  const { getMaquinariaInfo, actualizarMaquinaria } = useMaquinariasApi();
  const { crearGastoOperativo, actualizarGastoOperativo, eliminarGastoOperativo } =
    useGastosOperativosApi();
  usePageView();

  const fetchData = useCallback(async () => {
    try {
      if (!id) return;
      setLoading(true);
      const res = await getMaquinariaInfo(Number(id));
      setData(res);
    } catch (e) {
      toast.error('Error al obtener la maquinaria');
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, getMaquinariaInfo, setData]);

  const handleActualizarDatosBasicosMaquinaria = async (updated: {
    tipo: TipoMaquinaria;
    nombre: string;
    identificador?: string;
    costo: number;
  }) => {
    try {
      if (!id) return;
      setLoading(true);
      await actualizarMaquinaria(Number(id), updated);
      toast.success('Recurso actualizado');
      setModalEditarOpen(false);
      fetchData();
    } catch {
      toast.error('Error al actualizar el recurso');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearGastoOperativo = useCallback(
    async (data: NuevoGastoOperativo) => {
      try {
        if (!id) return;
        setLoading(true);
        await crearGastoOperativo(Number(id), data);
        toast.success('Gasto operativo creado');
        fetchData();
      } catch (e) {
        toast.error('Error al crear el gasto operativo');
      } finally {
        setLoading(false);
      }
    },
    [id, crearGastoOperativo, fetchData]
  );

  const handleActualizarGastoOperativo = useCallback(
    async (gastoId: number, data: NuevoGastoOperativo) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;
      try {
        setLoading(true);
        await actualizarGastoOperativo(Number(id), gastoId, data);
        toast.success('Gasto operativo actualizado');
        fetchData();
      } catch (e) {
        toast.error('Error al actualizar el gasto operativo');
      } finally {
        setLoading(false);
      }
    },
    [id, actualizarGastoOperativo, fetchData]
  );

  const handleEliminarGastoOperativo = useCallback(
    async (gastoId: number) => {
      const id = router.query.id;
      if (!id || Array.isArray(id)) return;
      try {
        setLoading(true);
        await eliminarGastoOperativo(Number(id), gastoId);
        toast.success('Gasto operativo eliminado');
        fetchData();
      } catch (e) {
        toast.error('Error al eliminar el gasto operativo');
      } finally {
        setLoading(false);
      }
    },
    [id, eliminarGastoOperativo, fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) return null;

  const {
    nombre,
    identificador,
    tipo,
    costo,
    totalServicios,
    totalCombustibleUltimoMes,
    asignaciones,
    servicios,
    consumos,
  } = data;

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 8 }}
    >
      {loading && <FullPageLoader />}
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            px={3}
          >
            <Box>
              <Typography variant="h4">{nombre}</Typography>
              <Typography color="text.secondary">
                {`${tipo.charAt(0).toUpperCase()}${tipo.slice(1)} #${identificador}`}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setModalEditarOpen(true)}
            >
              Editar datos
            </Button>
          </Stack>

          <EditarDatosBasicosModal
            open={modalEditarOpen}
            onClose={() => setModalEditarOpen(false)}
            initialData={{
              nombre,
              identificador,
              costo,
              tipo,
            }}
            onConfirm={handleActualizarDatosBasicosMaquinaria}
          />

          <EstadisticasRapidas
            costo={costo}
            totalServicios={totalServicios}
            totalCombustibleUltimoMes={totalCombustibleUltimoMes}
          />

          <Asignaciones asignaciones={asignaciones} />
          <HistorialServicios
            servicios={servicios}
            onCrearServicio={handleCrearGastoOperativo}
            onActualizarServicio={handleActualizarGastoOperativo}
            onEliminarServicio={handleEliminarGastoOperativo}
          />
          <HistorialConsumos
            consumos={consumos}
            onCrearConsumo={handleCrearGastoOperativo}
            onActualizarConsumo={handleActualizarGastoOperativo}
            onEliminarConsumo={handleEliminarGastoOperativo}
          />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
