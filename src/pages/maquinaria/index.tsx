import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';

import { Box, Button, Container, Stack, SvgIcon, Typography, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { ModalAgregarRecurso } from './agregar-recurso-modal';

type Recurso = {
  id: string;
  tipo: 'maquinaria' | 'herramienta';
  nombre: string;
  identificador?: string;
  asignaciones: {
    dias: string;
    proyecto: string;
    fechaFin: string;
  }[];
};

const mockRecursos: Recurso[] = [
  {
    id: '1',
    tipo: 'maquinaria',
    nombre: 'Excavadora CAT 320',
    identificador: 'MAQ-5678',
    asignaciones: [
      {
        dias: 'Lun-Mie-Vie',
        proyecto: 'Residencial La Cumbre',
        fechaFin: '2025-07-30',
      },
      {
        dias: 'Mar-Jue',
        proyecto: 'Torre Roble',
        fechaFin: '2025-08-10',
      },
    ],
  },
  {
    id: '2',
    tipo: 'herramienta',
    nombre: 'Taladro Bosch GBH2',
    identificador: '',
    asignaciones: [
      {
        dias: 'Lun-Mar',
        proyecto: 'Residencial La Cumbre',
        fechaFin: '2025-07-25',
      },
    ],
  },
  {
    id: '3',
    tipo: 'maquinaria',
    nombre: 'Retroexcavadora JCB 3CX',
    identificador: 'MAQ-1234',
    asignaciones: [
      {
        dias: 'Lun-Vie',
        proyecto: 'Torre Roble',
        fechaFin: '2025-08-01',
      },
    ],
  },
];

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  usePageView();

  const [tab, setTab] = useState('maquinaria');
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleCrear = () => {
    setAgregarModalOpen(true);
  };

  const handleVerDetalles = (id: string) => {
    router.push(paths.dashboard.maquinaria.detalle(id));
  };

  const recursosFiltrados = mockRecursos.filter((r) => (tab === 'todos' ? true : r.tipo === tab));

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-GT');
  };

  return (
    <>
      <Seo title="Maquinaria y Herramientas" />
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            spacing={3}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Typography variant="h4">Maquinaria y Herramientas</Typography>
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
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  label="Maquinarias"
                  value="maquinaria"
                />
                <Tab
                  label="Herramientas"
                  value="herramienta"
                />
                <Tab
                  label="Todos"
                  value="todos"
                />
              </Tabs>
            </Grid>

            {recursosFiltrados.map((recurso) => (
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
                    borderRadius: 4,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6">{recurso.nombre}</Typography>

                  {recurso.identificador && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Identificador: {recurso.identificador}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Asignaciones:
                  </Typography>
                  {recurso.asignaciones.map((a, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                    >
                      {a.dias}: {a.proyecto} (hasta {formatFecha(a.fechaFin)})
                    </Typography>
                  ))}

                  <Button
                    onClick={() => handleVerDetalles(recurso.id)}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <ModalAgregarRecurso
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={(nuevoRecurso) => {
          console.log('Recurso agregado:', nuevoRecurso);
          setAgregarModalOpen(false);
          // Aquí podrías agregar lógica para actualizar lista
        }}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
