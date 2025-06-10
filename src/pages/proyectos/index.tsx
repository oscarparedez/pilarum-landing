import type { NextPage } from 'next';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CrearProyectoModal } from './crear/crear-proyecto-modal';

const mockProyectos = [
  {
    id: '1',
    nombre: 'Residencial La Cumbre',
    ubicacion: 'Guatemala',
    estado: 'Activo',
  },
  {
    id: '2',
    nombre: 'Torre Roble',
    ubicacion: 'Mixco',
    estado: 'En ejecución',
  },
];

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  const [modalCrearProyectoOpen, setModalCrearProyectoOpen] = useState(false);


  usePageView();

  const handleCrearProyecto = () => {
    setModalCrearProyectoOpen(true);
  };

  const handleVerDetalles = (id: string) => {
    router.push(paths.dashboard.proyectos.detalle(id));
  };

  return (
    <>
      <Seo title="Proyectos" />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            disableEqualOverflow
            spacing={{ xs: 3, lg: 4 }}
          >
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Typography variant="h4">Proyectos</Typography>
                <Button
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={handleCrearProyecto}
                >
                  Crear nuevo proyecto
                </Button>
              </Stack>
            </Grid>

            {mockProyectos.map((proyecto) => (
              <Grid key={proyecto.id} xs={12} md={6} lg={4}>
                <Box
                  sx={{
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6">
                    {proyecto.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ubicación: {proyecto.ubicacion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Estado: {proyecto.estado}
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
        onConfirm={() => console.log('Proyecto creado')}
      />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
