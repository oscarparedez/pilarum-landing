import { useCallback, useEffect, useMemo, useState } from 'react';
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
import BusinessIcon from '@mui/icons-material/Business';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { NextPage } from 'next';
import { ModalCrearProveedor } from 'src/sections/oficina/gestion-proveedores/crear-proveedor-modal';
import { ModalEditarProveedor } from 'src/sections/oficina/gestion-proveedores/editar-proveedor-modal';
import { Proveedor, NuevoProveedor } from 'src/api/types';
import { useProveedoresApi } from 'src/api/proveedores/useProveedoresApi';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import toast from 'react-hot-toast';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { ModalEliminar } from 'src/components/eliminar-modal';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filtros, setFiltros] = useState({ search: '' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const rowsPerPage = 5;

  const { getProveedores, crearProveedor, actualizarProveedor, eliminarProveedor } =
    useProveedoresApi();

  const canCreateProveedor = useHasPermission(PermissionId.CREAR_PROVEEDOR);
  const canEditProveedor = useHasPermission(PermissionId.EDITAR_PROVEEDOR);
  const canDeleteProveedor = useHasPermission(PermissionId.ELIMINAR_PROVEEDOR);

  const handleGetProveedores = useCallback(async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch {
      toast.error('Error al cargar proveedores');
    }
  }, [getProveedores]);

  const handleCrearProveedor = useCallback(
    async (nuevoProveedor: NuevoProveedor) => {
      try {
        await crearProveedor(nuevoProveedor);
        setModalCrearOpen(false);
        await handleGetProveedores();
        toast.success('Proveedor creado exitosamente');
      } catch {
        toast.error('Error al crear proveedor');
      }
    },
    [crearProveedor, handleGetProveedores]
  );

  const handleActualizarProveedor = useCallback(
    async (id: number, proveedor: NuevoProveedor) => {
      try {
        await actualizarProveedor(id, proveedor);
        setModalEditarOpen(false);
        await handleGetProveedores();
        toast.success('Proveedor actualizado exitosamente');
      } catch {
        toast.error('Error al actualizar proveedor');
      }
    },
    [actualizarProveedor, handleGetProveedores]
  );

  const handleDeleteProveedor = useCallback(async () => {
    if (deleteId === null) return;
    try {
      await eliminarProveedor(deleteId);
      toast.success('Proveedor eliminado correctamente');
      await handleGetProveedores();
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar proveedor');
    } finally {
      setDeleteId(null);
    }
  }, [deleteId, eliminarProveedor, handleGetProveedores]);

  useEffect(() => {
    handleGetProveedores();
  }, [handleGetProveedores]);

  const abrirModalEditar = (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModalEditarOpen(true);
  };

  const proveedoresFiltrados = useMemo(
    () => aplicarFiltros(proveedores, filtros, { camposTexto: ['nombre'] }),
    [proveedores, filtros]
  );
  const start = (paginaActual - 1) * rowsPerPage;
  const paginadas = proveedoresFiltrados.slice(start, start + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Proveedores</Typography>
          {canCreateProveedor && (
            <Button
              variant="contained"
              startIcon={<BusinessIcon />}
              onClick={() => setModalCrearOpen(true)}
            >
              Crear proveedor
            </Button>
          )}
        </Stack>
      </Card>

      <Card>
        <TablaPaginadaConFiltros
          totalItems={proveedoresFiltrados.length}
          onFiltrar={(f) => setFiltros((prev) => ({ ...prev, ...f }))}
          onPageChange={(page) => setPaginaActual(page)}
          filtrosSearch
          filtrosEstado={false}
          filtrosFecha={false}
        >
          {() => (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    {(canEditProveedor || canDeleteProveedor) && (
                      <TableCell align="center">Acciones</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginadas.map((proveedor) => (
                    <TableRow
                      key={proveedor.id}
                      hover
                    >
                      <TableCell>{proveedor.nombre}</TableCell>
                      {(canEditProveedor || canDeleteProveedor) && (
                        <TableCell align="center">
                          {canEditProveedor && (
                            <IconButton onClick={() => abrirModalEditar(proveedor)}>
                              <SvgIcon>
                                <EditIcon />
                              </SvgIcon>
                            </IconButton>
                          )}
                          {canDeleteProveedor && (
                            <IconButton
                              color="error"
                              onClick={() => setDeleteId(proveedor.id)}
                            >
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
          )}
        </TablaPaginadaConFiltros>
      </Card>

      <ModalCrearProveedor
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onCrearProveedor={handleCrearProveedor}
      />
      {proveedorSeleccionado && (
        <ModalEditarProveedor
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={proveedorSeleccionado}
          onActualizarProveedor={handleActualizarProveedor}
        />
      )}
      {deleteId !== null && (
        <ModalEliminar
          type="proveedor"
          open
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteProveedor}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
