import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  SvgIcon,
  Button,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import EditIcon from '@untitled-ui/icons-react/build/esm/Edit02';
import TrashIcon from '@untitled-ui/icons-react/build/esm/Trash01';
import AddIcon from '@mui/icons-material/Add';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { NextPage } from 'next';
import toast from 'react-hot-toast';

import { useSociosApi } from 'src/api/socios/useSociosApi';
import { ModalCrearSocio } from 'src/sections/oficina/gestion-socios/crear-socio-modal';
import { FullPageLoader } from 'src/components/loader/Loader';
import { ModalEditarSocio } from 'src/sections/oficina/gestion-socios/editar-socio-modal';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { NuevoSocio, Socio } from 'src/api/types';
import { ModalEliminar } from 'src/components/eliminar-modal';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const canCreateSocios = useHasPermission(PermissionId.CREAR_SOCIOS);
  const canEditSocios = useHasPermission(PermissionId.EDITAR_SOCIOS);
  const canDeleteSocios = useHasPermission(PermissionId.ELIMINAR_SOCIOS);

  const { getSocios, crearSocio, actualizarSocio, eliminarSocio } = useSociosApi();

  const fetchSocios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSocios();
      setSocios(data);
    } catch {
      toast.error('Error al obtener socios');
    } finally {
      setLoading(false);
    }
  }, [getSocios, setSocios]);

  useEffect(() => {
    fetchSocios();
  }, [fetchSocios]);

  const abrirModalEditar = (socio: Socio) => {
    setSocioSeleccionado(socio);
    setModalEditarOpen(true);
  };

  const handleCrear = async (nuevo: NuevoSocio) => {
    setLoading(true);
    try {
      await crearSocio(nuevo);
      toast.success('Socio creado correctamente');
      setModalCrearOpen(false);
      fetchSocios();
    } catch {
      toast.error('Error al crear socio');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = async (id: number, editado: NuevoSocio) => {
    try {
      setLoading(true);
      await actualizarSocio(id, editado);
      toast.success('Socio actualizado correctamente');
      fetchSocios();
      setModalEditarOpen(false);
    } catch {
      toast.error('Error al actualizar socio');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => setDeleteId(id);

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      try {
        setLoading(true);
        await eliminarSocio(deleteId);
        toast.success('Socio eliminado correctamente');
        fetchSocios();
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && <FullPageLoader />}
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Socios</Typography>
          {canCreateSocios && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalCrearOpen(true)}
            >
              Crear socio
            </Button>
          )}
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={socios.length}
          onFiltrar={({ search }) => setSearch(search)}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = socios
              .filter((s) => s.nombre.toLowerCase().includes(search.toLowerCase()))
              .slice((currentPage - 1) * 5, currentPage * 5);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Usuario creador</TableCell>
                      {(canEditSocios || canDeleteSocios) && (
                        <TableCell align="center">Acciones</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((socio) => (
                      <TableRow
                        key={socio.id}
                        hover
                      >
                        <TableCell>{socio.nombre}</TableCell>
                        <TableCell>
                          {socio.usuario_creador.first_name} {socio.usuario_creador.last_name}
                        </TableCell>
                        {(canEditSocios || canDeleteSocios) && (
                          <TableCell align="center">
                            {canEditSocios && (
                              <IconButton onClick={() => abrirModalEditar(socio)}>
                                <SvgIcon>
                                  <EditIcon />
                                </SvgIcon>
                              </IconButton>
                            )}
                            {canDeleteSocios && (
                              <IconButton onClick={() => handleDelete(socio.id)}>
                                <SvgIcon>
                                  <TrashIcon />
                                </SvgIcon>
                              </IconButton>
                            )}
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
      </Card>

      <ModalCrearSocio
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onConfirm={handleCrear}
      />

      {socioSeleccionado && (
        <ModalEditarSocio
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={socioSeleccionado}
          onConfirm={handleEditar}
        />
      )}

      {deleteId !== null && (
        <ModalEliminar
          type="socio"
          open={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
