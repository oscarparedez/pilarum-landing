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
import { CrearRolModal } from 'src/sections/oficina/gestion-roles/crear-rol-modal';
import { DetalleRolModal } from 'src/sections/oficina/gestion-roles/detalles-rol-modal';
import { Rol as RolApiType, NuevoRol } from 'src/api/types';
import toast from 'react-hot-toast';
import { useRolesApi } from 'src/api/roles/useRolesApi';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { FullPageLoader } from 'src/components/loader/Loader';
import { ModalEliminar } from 'src/components/eliminar-modal';

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  usePageView();

  const { getRoles, crearRol, actualizarRol, eliminarRol } = useRolesApi();
  const canCreateRole = useHasPermission(PermissionId.CREAR_ROL);
  const canEditRole = useHasPermission(PermissionId.EDITAR_ROL);
  const canDeleteRole = useHasPermission(PermissionId.ELIMINAR_ROL);

  const [roles, setRoles] = useState<RolApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<RolApiType | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      toast.error('Error al obtener roles');
    } finally {
      setLoading(false);
    }
  }, [getRoles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCrear = useCallback(
    async (data: NuevoRol) => {
      setLoading(true);
      try {
        await crearRol(data);
        await fetchRoles();
        setModalOpen(false);
        toast.success('Rol creado exitosamente');
      } catch {
        toast.error('Error al crear el rol');
      } finally {
        setLoading(false);
      }
    },
    [crearRol, fetchRoles]
  );

  const handleActualizarRol = useCallback(
    async (updatedPermissions: number[]) => {
      if (!rolSeleccionado) return;
      setLoading(true);
      try {
        await actualizarRol(rolSeleccionado.id, { permissions: updatedPermissions });
        await fetchRoles();
        setModalDetalleOpen(false);
        toast.success('Rol actualizado exitosamente');
      } catch {
        toast.error('Error al actualizar el rol');
      } finally {
        setLoading(false);
      }
    },
    [actualizarRol, fetchRoles, rolSeleccionado]
  );

  const handleDeleteRol = useCallback(async () => {
    if (deleteId !== null) {
      try {
        setLoading(true);
        await eliminarRol(deleteId);
        toast.success('Rol eliminado correctamente');
        await fetchRoles();
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
        setDeleteId(null);
      }
    }
  }, [deleteId, eliminarRol, fetchRoles]);

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

                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{ mt: 'auto' }}
                    >
                      {canEditRole && (
                        <Button
                          onClick={() => {
                            setRolSeleccionado(rol);
                            setModalDetalleOpen(true);
                          }}
                          size="medium"
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Ver detalles
                        </Button>
                      )}

                      {canDeleteRole && (
                        <Button
                          color="error"
                          size="medium"
                          variant="outlined"
                          onClick={() => setDeleteId(rol.id)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
                        >
                          Eliminar rol
                        </Button>
                      )}
                    </Stack>
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

      {deleteId !== null && (
        <ModalEliminar
          type="rol"
          open={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteRol}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
