import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import TrashIcon from '@untitled-ui/icons-react/build/esm/Trash01';
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';

import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Card,
  CardContent,
  CardActions,
  alpha,
  IconButton,
  Chip,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { ModalAgregarRecurso } from 'src/sections/maquinaria/asignaciones/agregar-recurso-modal';
import { useMaquinariasApi } from 'src/api/maquinaria/useMaquinariaApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import toast from 'react-hot-toast';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { MaquinariaGeneralConfig, NuevaMaquinaria } from 'src/api/types';
import { formatearFecha } from 'src/utils/format-date';
import { ModalEliminar } from 'src/components/eliminar-modal';

// Helpers simples para fecha
const toMidnight = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const parseDateSafe = (s?: string) => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : toMidnight(d);
};

const estaActivaHoy = (inicio?: string, fin?: string) => {
  const hoy = toMidnight(new Date());
  const dIni = parseDateSafe(inicio);
  const dFin = parseDateSafe(fin);
  if (!dIni || !dFin) return false;
  return dIni.getTime() <= hoy.getTime() && hoy.getTime() <= dFin.getTime();
};

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  usePageView();

  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [recursos, setRecursos] = useState<MaquinariaGeneralConfig[]>([]);
  const [filteredRecursos, setFilteredRecursos] = useState<MaquinariaGeneralConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { crearMaquinaria, getMaquinariasConAsignaciones, eliminarMaquinaria } =
    useMaquinariasApi();
  const canCreateMaquinaria = useHasPermission(PermissionId.CREAR_MAQUINARIA);
  const canDeleteMaquinaria = useHasPermission(PermissionId.ELIMINAR_MAQUINARIA);

  const cargarRecursos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMaquinariasConAsignaciones();
      setRecursos(data as any);
      setFilteredRecursos(data as any);
    } catch (err) {
      console.error('Error al cargar recursos:', err);
      toast.error('Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  }, [getMaquinariasConAsignaciones]);

  useEffect(() => {
    cargarRecursos();
  }, [cargarRecursos]);

  const handleCrear = () => {
    setAgregarModalOpen(true);
  };

  const handleVerDetalles = (id: number) => {
    router.push(paths.dashboard.maquinaria.detalle(id));
  };

  const crearRecurso = async (nuevoRecurso: NuevaMaquinaria) => {
    setLoading(true);
    try {
      await crearMaquinaria(nuevoRecurso);
      await cargarRecursos();
      toast.success('Recurso creado exitosamente');
    } catch (err) {
      console.error('Error al crear recurso:', err);
      toast.error('Error al crear recurso');
    } finally {
      setAgregarModalOpen(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      setLoading(true);
      try {
        await eliminarMaquinaria(deleteId);
        toast.success('Maquinaria eliminada correctamente');
        await cargarRecursos();
      } catch (err: any) {
        toast.error(err.message || 'Error al eliminar maquinaria');
      } finally {
        setLoading(false);
        setDeleteId(null);
      }
    }
  };

  const handleFiltrar = useCallback(
    (filtros: { search: string; estado?: string }) => {
      let filtered = [...recursos];

      // Filtro por búsqueda de texto
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        filtered = filtered.filter(
          (recurso: any) =>
            recurso.nombre?.toLowerCase().includes(searchLower) ||
            recurso.identificador?.toLowerCase().includes(searchLower) ||
            recurso.tipo?.toLowerCase().includes(searchLower)
        );
      }

      // Filtro por estado
      if (filtros.estado) {
        filtered = filtered.filter((recurso: any) => recurso.estado === filtros.estado);
      }

      setFilteredRecursos(filtered);
    },
    [recursos]
  );

  const renderRecursoCard = (recurso: any) => {
    const asignaciones = (recurso.asignaciones ?? []) as any[];
    const activas = asignaciones.filter((a) => estaActivaHoy(a?.fecha_entrada, a?.fecha_fin));

    return (
      <Card
        key={recurso.id}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600 }}
            >
              {recurso.nombre}
            </Typography>
            <Chip
              label={recurso.estado === 'activo' ? 'Activo' : 'Inactivo'}
              size="small"
              sx={{
                backgroundColor: recurso.estado === 'activo' ? '#e8f5e8' : '#fce4ec',
                color: recurso.estado === 'activo' ? '#2e7d32' : '#c62828',
                border: `1px solid ${recurso.estado === 'activo' ? '#66bb6a' : '#ef5350'}`,
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: 500, textTransform: 'capitalize' }}
            >
              📋 Tipo: {recurso.tipo}
            </Typography>

            {recurso.identificador && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                🏷️ Identificador: {recurso.identificador}
              </Typography>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, mt: 2 }}
            >
              📅 Asignaciones activas hoy:
            </Typography>

            {activas.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic', pl: 2 }}
              >
                Sin asignaciones activas
              </Typography>
            ) : (
              activas.map((a, index) => {
                const proyectoId = a?.proyecto?.id;
                const proyectoNombre = a?.proyecto?.nombre ?? 'Proyecto sin nombre';
                const rango = `${formatearFecha(a?.fecha_entrada)} - ${formatearFecha(
                  a?.fecha_fin
                )}`;
                const dias = a?.dias_asignados?.join(', ') || 'Todos los días';

                return (
                  <Box
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (proyectoId) {
                        router.push(paths.dashboard.proyectos.detalle(proyectoId));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (proyectoId) {
                          router.push(paths.dashboard.proyectos.detalle(proyectoId));
                        }
                      }
                    }}
                    sx={{
                      cursor: proyectoId ? 'pointer' : 'default',
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: 'action.hover',
                      transition: 'all 0.2s',
                      '&:hover': proyectoId
                        ? {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          }
                        : undefined,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500 }}
                    >
                      🏗️ {proyectoNombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                    >
                      📅 Período: {rango}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                    >
                      📋 Días: {dias}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          <IconButton
            color="success"
            onClick={() => handleVerDetalles(recurso.id)}
          >
            <SvgIcon>
              <VisibilityIcon />
            </SvgIcon>
          </IconButton>
          {canDeleteMaquinaria && (
            <IconButton
              color="error"
              onClick={() => setDeleteId(recurso.id)}
            >
              <SvgIcon>
                <TrashIcon />
              </SvgIcon>
            </IconButton>
          )}
        </CardActions>
      </Card>
    );
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <Seo title="Maquinaria y Herramientas" />
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={4}
            sx={{ mb: 4 }}
          >
            <Typography variant="h4">Maquinaria y Herramientas</Typography>
            {canCreateMaquinaria && (
              <Button
                startIcon={
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                }
                variant="contained"
                onClick={handleCrear}
              >
                Agregar recurso
              </Button>
            )}
          </Stack>

          <TablaPaginadaConFiltros
            onFiltrar={handleFiltrar}
            totalItems={filteredRecursos.length}
            itemsPerPage={6}
            filtrosSearch={true}
            filtrosFecha={false}
            filtrosEstado={false}
            filtrosRol={false}
            filtrosEmpresa={false}
            filtrosTipoIngreso={false}
            filtrosTipoOrigen={false}
            filtrosEstadoOpciones={['activo', 'inactivo']}
            estadoLabel="Estado maquinaria"
          >
            {(currentPage) => {
              const startIndex = (currentPage - 1) * 6;
              const endIndex = startIndex + 6;
              const paginatedRecursos = filteredRecursos.slice(startIndex, endIndex);

              if (paginatedRecursos.length === 0) {
                return (
                  <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No hay recursos disponibles
                    </Typography>
                  </Box>
                );
              }

              return (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {paginatedRecursos.map((recurso) => renderRecursoCard(recurso))}
                </Box>
              );
            }}
          </TablaPaginadaConFiltros>
        </Container>
      </Box>

      <ModalAgregarRecurso
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={crearRecurso}
      />

      {deleteId !== null && (
        <ModalEliminar
          type="maquinaria"
          open={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
