import type { NextPage } from 'next';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
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
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { CrearProyectoModal } from './crear/crear-proyecto-modal';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from '../oficina/roles/permissions';
import { formatearFecha } from 'src/utils/format-date';

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  const { getProyectos, crearProyecto } = useProyectosApi();

  const canCreateProyecto = useHasPermission(PermissionId.CREAR_PROYECTO);

  const [proyectos, setProyectos] = useState<any[]>([]);
  const [modalCrearProyectoOpen, setModalCrearProyectoOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  usePageView();

  // Memorizar años disponibles basados en las fechas de inicio de los proyectos
  const availableYears = useMemo(() => {
    const years = proyectos.map((proyecto) => new Date(proyecto.fecha_inicio).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a); // Ordenar descendente
  }, [proyectos]);

  // Memorizar proyectos filtrados
  const filteredProyectos = useMemo(() => {
    if (!selectedYear) return proyectos;

    return proyectos.filter(
      (proyecto) => new Date(proyecto.fecha_inicio).getFullYear() === selectedYear
    );
  }, [proyectos, selectedYear]);

  // Callback para cambiar el año seleccionado
  const handleYearChange = useCallback((year: number | null) => {
    setSelectedYear(year);
  }, []);

  const cargarProyectos = useCallback(async () => {
    try {
      const data = await getProyectos();
      setProyectos(data);
    } catch (error) {
      toast.error('Error al cargar proyectos');
    }
  }, [getProyectos, setProyectos]);

  useEffect(() => {
    cargarProyectos();
  }, [cargarProyectos]);

  const handleCrearProyecto = async (data: any) => {
    try {
      await crearProyecto(data);
      toast.success('Proyecto creado exitosamente');
      setModalCrearProyectoOpen(false);
      cargarProyectos();
    } catch (error) {
      toast.error('Error al crear proyecto');
    }
  };

  const handleVerDetalles = useCallback(
    (id: number) => {
      router.push(paths.dashboard.proyectos.detalle(id));
    },
    [router]
  );

  return (
    <>
      <Seo title="Proyectos" />
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
                <Typography variant="h4">Proyectos</Typography>
                {canCreateProyecto && (
                  <Button
                    startIcon={
                      <SvgIcon>
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={() => setModalCrearProyectoOpen(true)}
                  >
                    Crear nuevo proyecto
                  </Button>
                )}
              </Stack>

              {/* Filtros por año */}
              {availableYears.length > 0 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  flexWrap="wrap"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    variant="subtitle1" // más grande que body2
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <SvgIcon fontSize="medium">
                      <CalendarIcon />
                    </SvgIcon>
                    Filtrar por año:
                  </Typography>

                  <Chip
                    label="Todos"
                    size="medium"
                    variant={selectedYear === null ? 'filled' : 'outlined'}
                    color="primary"
                    onClick={() => handleYearChange(null)}
                    sx={{ fontWeight: selectedYear === null ? 600 : 400 }}
                  />

                  {availableYears.map((year) => (
                    <Chip
                      key={year}
                      label={year}
                      size="medium"
                      variant={selectedYear === year ? 'filled' : 'outlined'}
                      color="primary"
                      onClick={() => handleYearChange(year)}
                      sx={{ fontWeight: selectedYear === year ? 600 : 400 }}
                    />
                  ))}
                </Stack>
              )}
            </Grid>

            {filteredProyectos.length === 0 ? (
              <Grid xs={12}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                  >
                    {selectedYear
                      ? `No hay proyectos iniciados en ${selectedYear}`
                      : 'No hay proyectos disponibles'}
                  </Typography>
                  {selectedYear && (
                    <Button
                      variant="outlined"
                      onClick={() => handleYearChange(null)}
                      sx={{ mt: 2 }}
                    >
                      Ver todos los proyectos
                    </Button>
                  )}
                </Box>
              </Grid>
            ) : (
              filteredProyectos.map((proyecto) => (
                <Grid
                  key={proyecto.id}
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
                      {proyecto.nombre}
                    </Typography>

                    <Stack spacing={1.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        📍 {proyecto.ubicacion}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="primary.main"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontWeight: 500,
                        }}
                      >
                        <SvgIcon fontSize="small">
                          <CalendarIcon />
                        </SvgIcon>
                        Inicio: {formatearFecha(proyecto.fecha_inicio)}
                      </Typography>

                      {proyecto.socio_asignado && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          👥 Socio asignado: {proyecto.socio_asignado.nombre}
                        </Typography>
                      )}
                      {proyecto.usuario_creador && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          🏷️ Usuario creador: {proyecto.usuario_creador.first_name} {proyecto.usuario_creador.last_name}
                        </Typography>
                      )}
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Button
                      onClick={() => handleVerDetalles(proyecto.id)}
                      size="small"
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

        <CrearProyectoModal
          open={modalCrearProyectoOpen}
          onClose={() => setModalCrearProyectoOpen(false)}
          onConfirm={handleCrearProyecto}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
