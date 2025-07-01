import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Tabs,
  Tab,
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

type Recurso = {
  id: number;
  tipo: 'maquinaria' | 'herramienta';
  nombre: string;
  identificador?: string;
  costo: number;
  asignaciones?: {
    dias: string;
    proyecto: string;
    fechaFin: string;
  }[] | null; // puede ser arreglo o null
};

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  usePageView();

  const [tab, setTab] = useState('maquinaria');
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);

  const { crearMaquinaria, getMaquinarias } = useMaquinariasApi();

  const cargarRecursos = async () => {
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
  };

  useEffect(() => {
    cargarRecursos();
  }, []);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleCrear = () => {
    setAgregarModalOpen(true);
  };

  const handleVerDetalles = (id: number) => {
    router.push(paths.dashboard.maquinaria.detalle(id));
  };

  const crearRecurso = async (nuevoRecurso: {
    tipo: 'maquinaria' | 'herramienta';
    nombre: string;
    identificador?: string;
    costo: number;
  }) => {
    try {
      await crearMaquinaria(nuevoRecurso);
      await cargarRecursos(); // refrescar la lista tras guardar
    } catch (err) {
      console.error('Error al crear recurso:', err);
    } finally {
      setAgregarModalOpen(false);
    }
  };

  const recursosFiltrados = recursos.filter((r) =>
    tab === 'todos' ? true : r.tipo === tab
  );

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-GT');
  };

  return (
    <>
      { loading && <FullPageLoader /> }
      <Seo title="Maquinaria y Herramientas" />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
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
                <Tab label="Maquinarias" value="maquinaria" />
                <Tab label="Herramientas" value="herramienta" />
                <Tab label="Todos" value="todos" />
              </Tabs>
            </Grid>

            {recursosFiltrados.map((recurso) => (
              <Grid key={recurso.id} xs={12} md={6} lg={4}>
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
                    <Typography variant="body2" color="text.secondary">
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
                  {recurso.asignaciones.length === 0 ? (
                    <Typography variant="body2">Sin asignaciones</Typography>
                  ) : (
                    recurso.asignaciones.map((a, index) => (
                      <Typography key={index} variant="body2">
                        {a.dias}: {a.proyecto} (hasta {formatFecha(a.fechaFin)})
                      </Typography>
                    ))
                  )}

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
        onConfirm={crearRecurso}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;


export default Page;
