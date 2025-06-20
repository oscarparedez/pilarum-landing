import { useState } from 'react';
import type { NextPage } from 'next';
import { Box, Button, Container, Grid, Stack, Typography, SvgIcon } from '@mui/material';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { CrearRolModal } from './crear-rol-modal';
import { DetalleRolModal } from './detalles-rol-modal';
import { Rol } from './index.d';

const mockRoles: Rol[] = [
  {
    id: 'admin',
    nombre: 'Administrador',
    permisos: {
      '👥 Planilla de personal': ['Ver planilla de personal', 'Crear usuario de planilla'],
    },
  },
  {
    id: 'ingeniero',
    nombre: 'Ingeniero de Proyecto',
    permisos: {
      '📁 Gestión de proyectos': ['Ver proyectos', 'Crear proyecto'],
    },
  },
];

const Page: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
  
  const handleCrear = (nombre: string, permisos: { [key: string]: string[] }) => {
    console.log('Nuevo rol:', nombre, permisos);
    setModalOpen(false);
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 8 }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="space-between"
          mb={4}
        >
          <Typography variant="h4">Roles y Permisos</Typography>
          <Button
            startIcon={
              <SvgIcon>
                <PlusIcon />
              </SvgIcon>
            }
            variant="contained"
            onClick={() => setModalOpen(true)}
          >
            Crear rol
          </Button>
        </Stack>
        <Grid
          container
          spacing={3}
        >
          {mockRoles.map((rol) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={rol.id}
            >
              <Box sx={{ border: '2px solid', borderColor: 'divider', borderRadius: 4, p: 3 }}>
                <Typography variant="h6">{rol.nombre}</Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setRolSeleccionado(rol);
                    setModalDetalleOpen(true);
                  }}
                >
                  Ver detalles
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>

        <CrearRolModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleCrear}
        />

        {rolSeleccionado && (
          <DetalleRolModal
            open={modalDetalleOpen}
            onClose={() => setModalDetalleOpen(false)}
            rol={rolSeleccionado}
            onUpdate={(updatedPerms) => {
              console.log('Permisos actualizados para:', rolSeleccionado.nombre, updatedPerms);
            }}
          />
        )}
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
