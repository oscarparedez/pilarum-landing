import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { ModalRegistrarPersona } from 'src/sections/oficina/gestion-planilla/crear-personal-modal';
import { ModalEditarPersona } from 'src/sections/oficina/gestion-planilla/editar-personal-modal';
import { NextPage } from 'next';
import { usePlanillaApi } from 'src/api/planilla/usePlanillaApi';
import toast from 'react-hot-toast';
import { NuevoUsuario, NuevoUsuarioConPassword, Rol, Usuario } from 'src/api/types';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { useRolesApi } from 'src/api/roles/useRolesApi';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { FullPageLoader } from 'src/components/loader/Loader';

const Page: NextPage = () => {
  const { getUsuarios, crearUsuario, actualizarUsuario } = usePlanillaApi();
  const { getRoles } = useRolesApi();

  const canCreateUsuarios = useHasPermission(PermissionId.CREAR_USUARIO_PLANILLA);
  const canEditUsuarios = useHasPermission(PermissionId.EDITAR_USUARIO_PLANILLA);

  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [personal, setPersonal] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [filtros, setFiltros] = useState<{ search: string; rol?: string }>({ search: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usuarios, roles] = await Promise.all([getUsuarios(), getRoles()]);
      setPersonal(usuarios);
      setRoles(roles);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [getUsuarios, getRoles, setPersonal, setRoles]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCrearUsuario = useCallback(
    async (usuario: NuevoUsuarioConPassword) => {
      setLoading(true);
      try {
        if (!canCreateUsuarios) {
          toast.error('No tienes permiso para crear usuarios');
          return;
        }
        await crearUsuario(usuario);
        await fetchData();
        toast.success('Usuario creado');
        setModalCrearOpen(false);
      } catch {
        toast.error('No se pudo crear el usuario');
      } finally {
        setLoading(false);
      }
    },
    [crearUsuario, fetchData, canCreateUsuarios]
  );

  const handleGuardarEdicion = useCallback(
    async (usuario: NuevoUsuario) => {
      if (!personaSeleccionada) return;
      setLoading(true);
      try {
        await actualizarUsuario(personaSeleccionada.id, usuario);
        toast.success('Usuario actualizado');
        await fetchData();
        setModalEditarOpen(false);
      } catch {
        toast.error('No se pudo actualizar el usuario');
      } finally {
        setLoading(false);
      }
    },
    [actualizarUsuario, personaSeleccionada, fetchData]
  );

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const personalFiltrado = useMemo(() => {
    return aplicarFiltros(personal, filtros, {
      camposTexto: ['first_name', 'last_name', 'username'],
      campoRol: 'groups',
    });
  }, [personal, filtros]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {loading && <FullPageLoader />}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            gap={2}
            sx={{ px: 3, py: 3 }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
            >
              Planilla de personal
            </Typography>
            {canCreateUsuarios && (
              <Box sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
                <Button
                  fullWidth={true}
                  sx={{ minWidth: { sm: 180 } }}
                  variant="contained"
                  onClick={() => setModalCrearOpen(true)}
                >
                  Agregar persona
                </Button>
              </Box>
            )}
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={personalFiltrado.length}
            onFiltrar={handleFiltrar}
            filtrosFecha={false}
            filtrosRol
            roles={roles}
          >
            {(currentPage) => {
              const pagina = personalFiltrado.slice((currentPage - 1) * 5, currentPage * 5);

              return (
                <TableContainer
                  sx={{
                    maxHeight: 600,
                    borderRadius: 2,
                    overflowX: 'auto',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{
                      minWidth: 960,
                      borderCollapse: 'separate',
                      borderSpacing: '0 8px',
                      '& th, & td': { whiteSpace: 'nowrap' },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Usuario</TableCell>
                        <TableCell>Teléfono</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Usuario creador</TableCell>
                        {canEditUsuarios && <TableCell align="center">Acciones</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pagina.map((persona) => (
                        <TableRow
                          key={persona.id}
                          hover
                          sx={{
                            backgroundColor: 'background.paper',
                            boxShadow: 1,
                          }}
                        >
                          <TableCell>{`${persona.first_name} ${persona.last_name}`}</TableCell>
                          <TableCell>{persona.username}</TableCell>
                          <TableCell>{persona.telefono ?? '—'}</TableCell>
                          <TableCell>{persona.groups?.[0]?.name || '—'}</TableCell>
                          <TableCell>{persona.is_active ? 'Activo' : 'Inactivo'}</TableCell>
                          <TableCell>
                            {persona.usuario_creador?.first_name}{' '}
                            {persona.usuario_creador?.last_name}
                          </TableCell>
                          {canEditUsuarios && (
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setPersonaSeleccionada(persona);
                                  setModalEditarOpen(true);
                                }}
                              >
                                Ver detalles
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              );
            }}
          </TablaPaginadaConFiltros>

          <ModalRegistrarPersona
            open={modalCrearOpen}
            onClose={() => setModalCrearOpen(false)}
            onConfirm={handleCrearUsuario}
            roles={roles}
          />

          {personaSeleccionada && (
            <ModalEditarPersona
              open={modalEditarOpen}
              onClose={() => setModalEditarOpen(false)}
              initialData={personaSeleccionada}
              onConfirm={handleGuardarEdicion}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
