// src/pages/roles/index.tsx
import { useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import { Box, Button, Container, Grid, Stack, Typography, SvgIcon } from '@mui/material';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { CrearRolModal } from './crear-rol-modal';
import { DetalleRolModal } from './detalles-rol-modal';
import { Rol as RolApiType, NuevoRol } from 'src/api/types';
import toast from 'react-hot-toast';
import { useRolesApi } from 'src/api/roles/useRolesApi';
import { PermissionId } from './permissions';
import { useHasPermission } from 'src/hooks/use-has-permissions';

const Page: NextPage = () => {
  const { getRoles, crearRol, actualizarRol } = useRolesApi();
  const canCreateRole = useHasPermission(PermissionId.CREAR_ROL);
  const canEditRole = useHasPermission(PermissionId.EDITAR_ROL);

  const [roles, setRoles] = useState<RolApiType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<RolApiType | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
    }
  }, [getRoles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCrear = useCallback(
    async (data: NuevoRol) => {
      try {
        await crearRol(data);
        await fetchRoles();
        setModalOpen(false);
        toast.success('Rol creado exitosamente');
      } catch (error) {
        toast.error('Error al crear el rol');
      }
    },
    [crearRol, fetchRoles]
  );

  const handleActualizarRol = useCallback(
    async (updatedPermissions: number[]) => {
      if (!rolSeleccionado) return;
      try {
        await actualizarRol(rolSeleccionado.id, { permissions: updatedPermissions });
        await fetchRoles();
        setModalDetalleOpen(false);
        toast.success('Rol actualizado exitosamente');
      } catch (error) {
        toast.error('Error al actualizar el rol');
      }
    },
    [actualizarRol, fetchRoles, rolSeleccionado]
  );

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
          {canCreateRole && (
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
          )}
        </Stack>
        <Grid
          container
          spacing={3}
        >
          {roles.map((rol) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={rol.id}
            >
              <Box sx={{ border: '2px solid', borderColor: 'divider', borderRadius: 4, p: 3 }}>
                <Typography variant="h6">{rol.name}</Typography>
                {canEditRole && (
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
                )}
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
            onUpdate={handleActualizarRol}
          />
        )}
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
