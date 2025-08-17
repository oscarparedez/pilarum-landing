import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import FilterIcon from '@untitled-ui/icons-react/build/esm/FilterFunnel01'; // 👈 un icono tipo filtro
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
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { ModalAgregarRecurso } from './agregar-recurso-modal';
import { useMaquinariasApi } from 'src/api/maquinaria/useMaquinariaApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import toast from 'react-hot-toast';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from '../oficina/roles/permissions';
import { NuevaMaquinaria } from 'src/api/types';

type Recurso = {
  id: number;
  tipo: 'maquinaria' | 'herramienta';
  nombre: string;
  identificador?: string;
  costo: number;
  asignaciones?:
    | {
        dias: string;
        proyecto: string;
        fechaFin: string;
      }[]
    | null;
};

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  usePageView();

  const [tab, setTab] = useState<'todos' | 'maquinaria' | 'herramienta'>('todos');
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);

  const { crearMaquinaria, getMaquinarias } = useMaquinariasApi();
  const canCreateMaquinaria = useHasPermission(PermissionId.CREAR_MAQUINARIA);

  const cargarRecursos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMaquinarias();
      setRecursos(
        data.map((item) => ({
          ...item,
          asignaciones: [],
        }))
      );
    } catch (err) {
      console.error('Error al cargar recursos:', err);
    } finally {
      setLoading(false);
    }
  }, [getMaquinarias]);

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
    try {
      await crearMaquinaria(nuevoRecurso);
      await cargarRecursos();
      toast.success('Recurso creado exitosamente');
    } catch (err) {
      console.error('Error al crear recurso:', err);
      toast.error('Error al crear recurso');
    } finally {
      setAgregarModalOpen(false);
    }
  };

  const recursosFiltrados = recursos.filter((r) => (tab === 'todos' ? true : r.tipo === tab));

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-GT');
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

            {/* Filtro minimalista por tipo con icono */}
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
                  color="success" // verde como en tu screenshot
                  onClick={() => setTab('todos')}
                  sx={{
                    fontSize: '0.9rem', // 👈 más grande que el default (~0.75rem)
                    fontWeight: tab === 'todos' ? 600 : 500,
                    px: 1.5,
                  }}
                />
                <Chip
                  label="Maquinarias"
                  size="medium"
                  variant={tab === 'maquinaria' ? 'filled' : 'outlined'}
                  color="success"
                  onClick={() => setTab('maquinaria')}
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: tab === 'maquinaria' ? 600 : 500,
                    px: 1.5,
                  }}
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
              recursosFiltrados.map((recurso) => (
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

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Asignaciones:
                    </Typography>
                    {!recurso?.asignaciones || recurso.asignaciones.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Sin asignaciones
                      </Typography>
                    ) : (
                      recurso.asignaciones.map((a, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          color="text.secondary"
                        >
                          {a.dias}: {a.proyecto} (hasta {formatFecha(a.fechaFin)})
                        </Typography>
                      ))
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Button
                      onClick={() => handleVerDetalles(recurso.id)}
                      size="medium"
                      variant="outlined"
                      sx={{
                        mt: 'auto',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Ver detalles
                    </Button>
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
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
