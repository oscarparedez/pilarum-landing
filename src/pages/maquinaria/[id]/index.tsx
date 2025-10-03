import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, Stack, Typography, Chip } from '@mui/material';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { EstadisticasRapidas } from 'src/sections/maquinaria/estadisticas-rapidas/estadisticas-rapidas';
import { Asignaciones } from 'src/sections/maquinaria/asignaciones/asignaciones';
import { HistorialServicios } from 'src/sections/maquinaria/historial-servicios/historial-servicios';
import { HistorialConsumos } from 'src/sections/maquinaria/historial-consumos/historial-consumos';
import { EditarDatosBasicosModal } from 'src/sections/maquinaria/datos-basicos/editar-datos-modal';
import toast from 'react-hot-toast';
import { useMaquinariasApi } from 'src/api/maquinaria/useMaquinariaApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import { ErrorOverlay } from 'src/components/error-overlay';
import { useGastosOperativosApi } from 'src/api/gastosOperativosMaquinaria/useGastosOperativosMaquinariaApi';
import {
  ActualizarGastoOperativo,
  ConfigMaquinaria,
  NuevaMaquinaria,
  NuevoGastoOperativo,
} from 'src/api/types';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  const { id: maquinariaId } = router.query;
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [data, setData] = useState<ConfigMaquinaria | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { getMaquinariaInfo, actualizarMaquinaria, actualizarEstadoMaquinaria } =
    useMaquinariasApi();
  const { crearGastoOperativo, actualizarGastoOperativo, eliminarGastoOperativo } =
    useGastosOperativosApi();
  usePageView();

  const canEditDatosBasicosMaquinaria = useHasPermission(PermissionId.EDITAR_MAQUINARIA_BASICO);
  const canModifyMachineryState = useHasPermission(PermissionId.EDITAR_MAQUINARIA_BASICO);
  const canViewAsignacionesMaquinaria = useHasPermission(PermissionId.VER_ASIGNACIONES_MAQUINARIA);
  const canViewHistorialServicios = useHasPermission(PermissionId.VER_HIST_SERVICIOS);
  const canViewHistorialConsumos = useHasPermission(PermissionId.VER_HIST_CONSUMOS);

  const fetchData = useCallback(async () => {
    try {
      if (!maquinariaId) return;
      setLoading(true);
      setError(false);
      const res = await getMaquinariaInfo(Number(maquinariaId));
      setData(res);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [maquinariaId, setLoading, getMaquinariaInfo, setData]);

  const handleActualizarDatosBasicosMaquinaria = async (updated: NuevaMaquinaria) => {
    try {
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
        if (!maquinariaId) return;
        setLoading(true);
        await crearGastoOperativo(Number(maquinariaId), data);
        toast.success('Gasto operativo creado');
        fetchData();
      } catch (e) {
        toast.error('Error al crear el gasto operativo');
      } finally {
        setLoading(false);
      }
    },
    [maquinariaId, crearGastoOperativo, fetchData]
  );

  const handleActualizarGastoOperativo = useCallback(
    async (gastoId: number, data: ActualizarGastoOperativo) => {
      if (!maquinariaId || Array.isArray(maquinariaId)) return;
      try {
        setLoading(true);
        await actualizarGastoOperativo(Number(maquinariaId), gastoId, data);
        toast.success('Gasto operativo actualizado');
        fetchData();
      } catch (e) {
        toast.error('Error al actualizar el gasto operativo');
      } finally {
        setLoading(false);
      }
    },
    [maquinariaId, actualizarGastoOperativo, fetchData]
  );

  const handleEliminarGastoOperativo = useCallback(
    async (gastoId: number) => {
      if (!maquinariaId || Array.isArray(maquinariaId)) return;
      try {
        setLoading(true);
        await eliminarGastoOperativo(Number(maquinariaId), gastoId);
        toast.success('Gasto operativo eliminado');
        fetchData();
      } catch (e) {
        toast.error('Error al eliminar el gasto operativo');
      } finally {
        setLoading(false);
      }
    },
    [maquinariaId, eliminarGastoOperativo, fetchData]
  );

  const handleActualizarEstado = useCallback(
    async (nuevoEstado: 'activo' | 'inactivo') => {
      if (!maquinariaId || Array.isArray(maquinariaId)) return;
      try {
        setLoading(true);
        await actualizarEstadoMaquinaria(Number(maquinariaId), nuevoEstado);
        toast.success('Estado actualizado correctamente');
        fetchData();
      } catch (error) {
        toast.error('Error al actualizar el estado');
      } finally {
        setLoading(false);
      }
    },
    [maquinariaId, actualizarEstadoMaquinaria, fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data && !loading && error) {
    return (
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          position: 'relative',
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Box sx={{ position: 'relative', minHeight: '60vh' }}>
            <ErrorOverlay tipoReporte="Maquinaria" />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!data) return null;

  const {
    id,
    nombre,
    identificador,
    tipo,
    costo,
    fecha_compra,
    tipo_documento,
    anotaciones,
    estado,
    totalServicios,
    totalCombustibleUltimoMes,
    asignaciones,
    servicios,
    consumos,
  } = data;

  const dataMaquinaria = {
    id,
    nombre,
    identificador,
    tipo,
    costo: costo,
    fecha_compra: fecha_compra,
    tipo_documento,
    anotaciones,
  };

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

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Estado de la maquinaria:
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                >
                  {(canModifyMachineryState
                    ? (['activo', 'inactivo'] as const)
                    : ([estado] as ('activo' | 'inactivo')[])
                  ).map((estadoOption) => (
                    <Chip
                      key={estadoOption}
                      label={estadoOption === 'activo' ? 'Activo' : 'Inactivo'}
                      variant={estado === estadoOption ? 'filled' : 'outlined'}
                      sx={{
                        cursor: canModifyMachineryState ? 'pointer' : 'default',
                        backgroundColor:
                          estado === estadoOption
                            ? estadoOption === 'activo'
                              ? '#e8f5e8'
                              : '#fce4ec'
                            : 'transparent',
                        border: `1px solid ${estadoOption === 'activo' ? '#66bb6a' : '#ef5350'}`,
                        color:
                          estado === estadoOption
                            ? estadoOption === 'activo'
                              ? '#2e7d32'
                              : '#c62828'
                            : estadoOption === 'activo'
                            ? '#66bb6a'
                            : '#ef5350',
                        ...(canModifyMachineryState && {
                          '&:hover': {
                            backgroundColor: estadoOption === 'activo' ? '#c8e6c9' : '#f8bbd9',
                            border: `1px solid ${
                              estadoOption === 'activo' ? '#4caf50' : '#e91e63'
                            }`,
                          },
                        }),
                      }}
                      {...(canModifyMachineryState && {
                        onClick: () => handleActualizarEstado(estadoOption),
                        clickable: true,
                      })}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
            {canEditDatosBasicosMaquinaria && (
              <Button
                variant="outlined"
                onClick={() => setModalEditarOpen(true)}
              >
                Editar datos
              </Button>
            )}
          </Stack>

          <EditarDatosBasicosModal
            open={modalEditarOpen}
            onClose={() => setModalEditarOpen(false)}
            initialData={dataMaquinaria}
            onConfirm={handleActualizarDatosBasicosMaquinaria}
          />

          <EstadisticasRapidas
            costo={costo}
            totalServicios={totalServicios}
            totalCombustibleUltimoMes={totalCombustibleUltimoMes}
          />

          {canViewAsignacionesMaquinaria && <Asignaciones asignaciones={asignaciones} />}
          {canViewHistorialServicios && (
            <HistorialServicios
              servicios={servicios}
              onCrearServicio={handleCrearGastoOperativo}
              onActualizarServicio={handleActualizarGastoOperativo}
              onEliminarServicio={handleEliminarGastoOperativo}
            />
          )}
          {canViewHistorialConsumos && (
            <HistorialConsumos
              consumos={consumos}
              onCrearConsumo={handleCrearGastoOperativo}
              onActualizarConsumo={handleActualizarGastoOperativo}
              onEliminarConsumo={handleEliminarGastoOperativo}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
