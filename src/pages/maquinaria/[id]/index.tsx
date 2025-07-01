import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
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

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  const { id } = router.query;
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [data, setData] = useState<ConfigMaquinaria | null>(null);
  const [loading, setLoading] = useState(false);

  const { getMaquinariaById, actualizarMaquinaria } = useMaquinariasApi();
  usePageView();

  const fetchData = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const res = await getMaquinariaById(Number(id));
      setData(res);
    } catch (e) {
      toast.error('Error al obtener la maquinaria');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEdit = async (updated: {
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

  useEffect(() => {
    fetchData();
  }, [id]);

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
            onConfirm={handleConfirmEdit}
          />

          <EstadisticasRapidas
            costo={costo}
            totalServicios={totalServicios}
            totalCombustibleUltimoMes={totalCombustibleUltimoMes}
          />

          <Asignaciones asignaciones={asignaciones} />
          <HistorialServicios servicios={servicios} />
          <HistorialConsumos consumos={consumos} />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
