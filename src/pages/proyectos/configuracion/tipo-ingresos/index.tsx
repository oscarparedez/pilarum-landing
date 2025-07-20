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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { NextPage } from 'next';
import toast from 'react-hot-toast';

import { FullPageLoader } from 'src/components/loader/Loader';
import { ModalCrearTipoIngreso } from './crear-tipo-ingreso-modal';
import { ModalEditarTipoIngreso } from './editar-tipo-ingreso-modal';
import { TipoIngreso } from './index.d';
import { useTiposIngresoApi } from 'src/api/tipoIngresos/useTipoIngresosApi';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoIngreso | null>(null);
  const [tiposIngreso, setTiposIngreso] = useState<TipoIngreso[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const { getTiposIngreso, crearTipoIngreso, actualizarTipoIngreso } = useTiposIngresoApi();

  const fetchTiposIngreso = useCallback(async () => {
    try {
      const data = await getTiposIngreso();
      setTiposIngreso(data);
    } catch {
      toast.error('Error al obtener tipos de ingreso');
    }
  }, [getTiposIngreso]);

  useEffect(() => {
    fetchTiposIngreso();
  }, [fetchTiposIngreso]);

  const abrirModalEditar = (tipo: TipoIngreso) => {
    setTipoSeleccionado(tipo);
    setModalEditarOpen(true);
  };

  const handleCrear = async (nuevo: Omit<TipoIngreso, 'id'>) => {
    try {
      setLoading(true);
      await crearTipoIngreso(nuevo);
      toast.success('Tipo de ingreso creado correctamente');
      setModalCrearOpen(false);
      fetchTiposIngreso();
    } catch {
      toast.error('Error al crear tipo de ingreso');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = async (editado: TipoIngreso) => {
    try {
      setLoading(true);
      await actualizarTipoIngreso(editado.id, { nombre: editado.nombre });
      toast.success('Tipo de ingreso actualizado correctamente');
      fetchTiposIngreso();
      setModalEditarOpen(false);
    } catch {
      toast.error('Error al actualizar tipo de ingreso');
    } finally {
      setLoading(false);
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
          <Typography variant="h5">Tipos de ingreso</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalCrearOpen(true)}
          >
            Crear tipo
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={tiposIngreso.length}
          onFiltrar={({ search }) => setSearch(search)}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = tiposIngreso
              .filter((tipo) => tipo.nombre.toLowerCase().includes(search.toLowerCase()))
              .sort((a, b) =>
                orden === 'asc'
                  ? a.nombre.localeCompare(b.nombre)
                  : b.nombre.localeCompare(a.nombre)
              )
              .slice((currentPage - 1) * 5, currentPage * 5);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((tipo) => (
                      <TableRow
                        key={tipo.id}
                        hover
                      >
                        <TableCell>{tipo.nombre}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(tipo)}>
                            <SvgIcon>
                              <EditIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </TablaPaginadaConFiltros>
      </Card>

      <ModalCrearTipoIngreso
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onConfirm={handleCrear}
      />

      {tipoSeleccionado && (
        <ModalEditarTipoIngreso
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={tipoSeleccionado}
          onConfirm={handleEditar}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
