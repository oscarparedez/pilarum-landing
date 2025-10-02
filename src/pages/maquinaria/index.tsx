import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import FilterIcon from '@untitled-ui/icons-react/build/esm/FilterFunnel01';
import TrashIcon from '@untitled-ui/icons-react/build/esm/Trash01';
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';

import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Chip,
  Divider,
  alpha,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

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

  const [tab, setTab] = useState<'todos' | 'maquinaria' | 'herramienta'>('todos');
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [recursos, setRecursos] = useState<MaquinariaGeneralConfig[]>([]);
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

  const recursosFiltrados = recursos.filter((r: any) => (tab === 'todos' ? true : r.tipo === tab));

  return (
    <>
      {loading && <FullPageLoader />}
      <Seo title="Maquinaria y Herramientas" />
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            disableEqualOverflow
            spacing={{ xs: 3, lg: 4 }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={4}
                sx={{ mb: 3 }}
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
            </Grid>

            {/* Filtro por tipo */}
            <Grid xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                flexWrap="wrap"
                sx={{ mb: 3 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <SvgIcon fontSize="medium">
                    <FilterIcon />
                  </SvgIcon>
                  Filtrar por tipo
                </Typography>

                <Chip
                  label="Todos"
                  size="medium"
                  variant={tab === 'todos' ? 'filled' : 'outlined'}
                  color="success"
                  onClick={() => setTab('todos')}
                  sx={{ fontSize: '0.9rem', fontWeight: tab === 'todos' ? 600 : 500, px: 1.5 }}
                />
                <Chip
                  label="Maquinarias"
                  size="medium"
                  variant={tab === 'maquinaria' ? 'filled' : 'outlined'}
                  color="success"
                  onClick={() => setTab('maquinaria')}
                  sx={{ fontSize: '0.9rem', fontWeight: tab === 'maquinaria' ? 600 : 500, px: 1.5 }}
                />
                <Chip
                  label="Herramientas"
                  size="medium"
                  variant={tab === 'herramienta' ? 'filled' : 'outlined'}
                  color="success"
                  onClick={() => setTab('herramienta')}
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: tab === 'herramienta' ? 600 : 500,
                    px: 1.5,
                  }}
                />
              </Stack>
            </Grid>

            {recursosFiltrados.length === 0 ? (
              <Grid xs={12}>
                <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                  >
                    No hay recursos disponibles
                  </Typography>
                </Box>
              </Grid>
            ) : (
              recursosFiltrados.map((recurso: any) => (
                <Grid
                  key={recurso.id}
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <Box
                    sx={{
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      height: '100%',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) =>
                          `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600 }}
                    >
                      {recurso.nombre}
                    </Typography>

                    {recurso.identificador && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        🏷️ {recurso.identificador}
                      </Typography>
                    )}

                    {/* Asignaciones activas hoy */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Asignaciones activas:
                    </Typography>

                    {(() => {
                      const asignaciones = (recurso.asignaciones ?? []) as any[];
                      const activas = asignaciones.filter((a) =>
                        estaActivaHoy(a?.fecha_entrada, a?.fecha_fin)
                      );

                      if (activas.length === 0) {
                        return (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Sin asignaciones activas
                          </Typography>
                        );
                      }

                      return activas.map((a, index) => {
                        const proyectoId = a?.proyecto?.id;
                        const proyectoNombre = a?.proyecto?.nombre ?? 'Proyecto';
                        const rango = `${formatearFecha(a?.fecha_entrada)} - ${formatearFecha(
                          a?.fecha_fin
                        )}`;
                        const dias = a?.dias_asignados.join(', ');

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
                              color: 'text.secondary',
                              '&:hover': proyectoId ? { color: 'primary.main' } : undefined,
                            }}
                          >
                            <Typography variant="body2">
                              {dias}: {proyectoNombre} ({rango})
                            </Typography>
                          </Box>
                        );
                      });
                    })()}

                    <Divider sx={{ my: 1 }} />

                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
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
                    </Stack>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
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
