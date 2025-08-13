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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { NextPage } from 'next';
import { ModalCrearProveedor } from './crear-proveedor-modal';
import { ModalEditarProveedor } from './editar-proveedor-modal';
import { Proveedor, NuevoProveedor } from 'src/api/types';
import { useProveedoresApi } from 'src/api/proveedores/useProveedoresApi';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import toast from 'react-hot-toast';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from '../roles/permissions';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [proveedorSeleccionada, setProveedorSeleccionada] = useState<Proveedor | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filtros, setFiltros] = useState({ search: '' });
  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;

  const { getProveedores, crearProveedor, actualizarProveedor } = useProveedoresApi();
  const canCreateProveedor = useHasPermission(PermissionId.CREAR_PROVEEDOR);
  const canEditProveedor = useHasPermission(PermissionId.EDITAR_PROVEEDOR);

  const handleGetProveedores = useCallback(async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      toast.error('Error al cargar proveedores');
    }
  }, [getProveedores]);

  const handleCrearProveedor = useCallback(
    async (NuevoProveedor: NuevoProveedor) => {
      try {
        await crearProveedor(NuevoProveedor);
        setModalCrearOpen(false);
        await handleGetProveedores();
        toast.success('Proveedor creado exitosamente');
      } catch (error) {
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
      } catch (error) {}
    },
    [actualizarProveedor, handleGetProveedores]
  );

  useEffect(() => {
    handleGetProveedores();
  }, [handleGetProveedores]);

  const abrirModalEditar = (proveedor: Proveedor) => {
    setProveedorSeleccionada(proveedor);
    setModalEditarOpen(true);
  };

  const proveedoresFiltrados = useMemo(() => {
    return aplicarFiltros(proveedores, filtros, {
      camposTexto: ['nombre'],
    });
  }, [proveedores, filtros]);

  const start = (paginaActual - 1) * rowsPerPage;
  const paginadas = proveedoresFiltrados.slice(start, start + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">proveedores</Typography>
          {canCreateProveedor && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalCrearOpen(true)}
            >
              Crear proveedor
            </Button>
          )}
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={proveedoresFiltrados.length}
          onFiltrar={(f) => setFiltros((prev) => ({ ...prev, ...f }))}
          onPageChange={(page) => setPaginaActual(page)}
          filtrosSearch
          filtrosEstado={false}
          filtrosFecha={false}
        >
          {(currentPage) => (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    {canEditProveedor && <TableCell align="center">Acciones</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginadas.map((proveedor) => (
                    <TableRow
                      key={proveedor.id}
                      hover
                    >
                      <TableCell>{proveedor.nombre}</TableCell>
                      {canEditProveedor && (
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(proveedor)}>
                            <SvgIcon>
                              <EditIcon />
                            </SvgIcon>
                          </IconButton>
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

      {proveedorSeleccionada && (
        <ModalEditarProveedor
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={proveedorSeleccionada}
          onActualizarProveedor={handleActualizarProveedor}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
