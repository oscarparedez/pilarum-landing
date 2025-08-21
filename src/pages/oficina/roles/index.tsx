// src/pages/roles/index.tsx
import { useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Box, Button, Container, Stack, SvgIcon, Typography, Divider, alpha } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { CrearRolModal } from './crear-rol-modal';
import { DetalleRolModal } from './detalles-rol-modal';
import { Rol as RolApiType, NuevoRol } from 'src/api/types';
import toast from 'react-hot-toast';
import { useRolesApi } from 'src/api/roles/useRolesApi';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from './permissions';
import { FullPageLoader } from 'src/components/loader/Loader';

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  usePageView();

  const { getRoles, crearRol, actualizarRol } = useRolesApi();
  const canCreateRole = useHasPermission(PermissionId.CREAR_ROL);
  const canEditRole = useHasPermission(PermissionId.EDITAR_ROL);

  const [roles, setRoles] = useState<RolApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<RolApiType | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
    <>
      {loading && <FullPageLoader />}
      <Seo title="Roles y Permisos" />
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
            {/* Header */}
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={4}
                sx={{ mb: 3 }}
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
            </Grid>

            {/* Lista de roles */}
            {roles.length === 0 ? (
              <Grid xs={12}>
                <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                  >
                    No hay roles creados
                  </Typography>
                </Box>
              </Grid>
            ) : (
              roles.map((rol) => (
                <Grid
                  key={rol.id}
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
                      {rol.name}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {canEditRole && (
                      <Button
                        onClick={() => {
                          setRolSeleccionado(rol);
                          setModalDetalleOpen(true);
                        }}
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
                    )}
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

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
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
