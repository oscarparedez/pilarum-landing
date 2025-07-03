import type { NextPage } from 'next';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { CrearProyectoModal } from './crear/crear-proyecto-modal';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  const { getProyectos, crearProyecto } = useProyectosApi();

  const [proyectos, setProyectos] = useState<any[]>([]);
  const [modalCrearProyectoOpen, setModalCrearProyectoOpen] = useState(false);

  usePageView();

  const cargarProyectos = useCallback(async () => {
    try {
      const data = await getProyectos();
      setProyectos(data);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
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
      console.error('Error al crear proyecto:', error);
      toast.error('Error al crear proyecto');
    }
  };

  const handleVerDetalles = (id: string) => {
    router.push(paths.dashboard.proyectos.detalle(id));
  };

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
                spacing={4}
              >
                <Typography variant="h4">Proyectos</Typography>
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
              </Stack>
            </Grid>

            {proyectos.map((proyecto) => (
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
                    borderRadius: 4,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    height: '100%',
                  }}
                >
                  <Typography variant="h6">{proyecto.nombre}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Ubicación: {proyecto.ubicacion}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Estado: Activo
                  </Typography>
                  <Button
                    onClick={() => handleVerDetalles(proyecto.id)}
                    size="small"
                    variant="outlined"
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Grid>
            ))}
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
