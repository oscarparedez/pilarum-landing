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
import LabelIcon from '@mui/icons-material/Label';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { NextPage } from 'next';
import { ModalCrearMarca } from 'src/sections/oficina/gestion-marcas/crear-marca-modal';
import { ModalEditarMarca } from 'src/sections/oficina/gestion-marcas/editar-marca-modal';
import { Marca, NuevaMarca } from 'src/api/types';
import { useMarcasApi } from 'src/api/marcas/useMarcasApi';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import toast from 'react-hot-toast';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { ModalEliminar } from 'src/components/eliminar-modal';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [filtros, setFiltros] = useState({ search: '' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const rowsPerPage = 5;

  const { getMarcas, crearMarca, actualizarMarca, eliminarMarca } = useMarcasApi();

  const canCreateMarca = useHasPermission(PermissionId.CREAR_MARCA);
  const canEditMarca = useHasPermission(PermissionId.EDITAR_MARCA);
  const canDeleteMarca = useHasPermission(PermissionId.ELIMINAR_MARCA);

  const handleGetMarcas = useCallback(async () => {
    try {
      const data = await getMarcas();
      setMarcas(data);
    } catch {
      toast.error('Error al cargar marcas');
    }
  }, [getMarcas]);

  const handleCrearMarca = useCallback(
    async (nuevaMarca: NuevaMarca) => {
      try {
        await crearMarca(nuevaMarca);
        setModalCrearOpen(false);
        await handleGetMarcas();
        toast.success('Marca creada exitosamente');
      } catch {
        toast.error('Error al crear marca');
      }
    },
    [crearMarca, handleGetMarcas]
  );

  const handleActualizarMarca = useCallback(
    async (id: number, marca: NuevaMarca) => {
      try {
        await actualizarMarca(id, marca);
        setModalEditarOpen(false);
        await handleGetMarcas();
        toast.success('Marca actualizada exitosamente');
      } catch {
        toast.error('Error al actualizar marca');
      }
    },
    [actualizarMarca, handleGetMarcas]
  );

  const handleDeleteMarca = useCallback(async () => {
    if (deleteId === null) return;
    try {
      await eliminarMarca(deleteId);
      toast.success('Marca eliminada correctamente');
      await handleGetMarcas();
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar marca');
    } finally {
      setDeleteId(null);
    }
  }, [deleteId, eliminarMarca, handleGetMarcas]);

  useEffect(() => {
    handleGetMarcas();
  }, [handleGetMarcas]);

  const abrirModalEditar = (marca: Marca) => {
    setMarcaSeleccionada(marca);
    setModalEditarOpen(true);
  };

  const marcasFiltradas = useMemo(
    () => aplicarFiltros(marcas, filtros, { camposTexto: ['nombre'] }),
    [marcas, filtros]
  );
  const start = (paginaActual - 1) * rowsPerPage;
  const paginadas = marcasFiltradas.slice(start, start + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Marcas</Typography>
          {canCreateMarca && (
            <Button
              variant="contained"
              startIcon={<LabelIcon />}
              onClick={() => setModalCrearOpen(true)}
            >
              Crear marca
            </Button>
          )}
        </Stack>
      </Card>

      <Card>
        <TablaPaginadaConFiltros
          totalItems={marcasFiltradas.length}
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
                    {(canEditMarca || canDeleteMarca) && (
                      <TableCell align="center">Acciones</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginadas.map((marca) => (
                    <TableRow
                      key={marca.id}
                      hover
                    >
                      <TableCell>{marca.nombre}</TableCell>
                      {(canEditMarca || canDeleteMarca) && (
                        <TableCell align="center">
                          {canEditMarca && (
                            <IconButton onClick={() => abrirModalEditar(marca)}>
                              <SvgIcon>
                                <EditIcon />
                              </SvgIcon>
                            </IconButton>
                          )}
                          {canDeleteMarca && (
                            <IconButton
                              onClick={() => setDeleteId(marca.id)}
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

      <ModalCrearMarca
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onCrearMarca={handleCrearMarca}
      />
      {marcaSeleccionada && (
        <ModalEditarMarca
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={marcaSeleccionada}
          onActualizarMarca={handleActualizarMarca}
        />
      )}
      {deleteId !== null && (
        <ModalEliminar
          type="marca"
          open
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteMarca}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
