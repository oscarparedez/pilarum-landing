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
import { ModalCrearMarca } from './crear-marca-modal';
import { ModalEditarMarca } from './editar-marca-modal';
import { Marca, NuevaMarca } from 'src/api/types';
import { useMarcasApi } from 'src/api/marcas/useMarcasApi';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import toast from 'react-hot-toast';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from '../roles/permissions';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [filtros, setFiltros] = useState({ search: '' });
  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;

  const { getMarcas, crearMarca, actualizarMarca } = useMarcasApi();
  const canCreateMarca = useHasPermission(PermissionId.CREAR_MARCA);
  const canEditMarca = useHasPermission(PermissionId.EDITAR_MARCA);

  const handleGetMarcas = useCallback(async () => {
    try {
      const data = await getMarcas();
      setMarcas(data);
    } catch (error) {
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
      } catch (error) {
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
      } catch (error) {}
    },
    [actualizarMarca, handleGetMarcas]
  );

  useEffect(() => {
    handleGetMarcas();
  }, [handleGetMarcas]);

  const abrirModalEditar = (marca: Marca) => {
    setMarcaSeleccionada(marca);
    setModalEditarOpen(true);
  };

  const marcasFiltradas = useMemo(() => {
    return aplicarFiltros(marcas, filtros, {
      camposTexto: ['nombre'],
    });
  }, [marcas, filtros]);

  const start = (paginaActual - 1) * rowsPerPage;
  const paginadas = marcasFiltradas.slice(start, start + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
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
              startIcon={<AddIcon />}
              onClick={() => setModalCrearOpen(true)}
            >
              Crear marca
            </Button>
          )}
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={marcasFiltradas.length}
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
                    {canEditMarca && <TableCell align="center">Acciones</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginadas.map((marca) => (
                    <TableRow
                      key={marca.id}
                      hover
                    >
                      <TableCell>{marca.nombre}</TableCell>
                      {canEditMarca && (
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(marca)}>
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
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
