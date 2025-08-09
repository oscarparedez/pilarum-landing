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
import { ModalCrearUnidad } from './crear-unidad-modal';
import { ModalEditarUnidad } from './editar-unidad-modal';
import { NuevaUnidad, Unidad } from 'src/api/types';
import { useUnidadesApi } from 'src/api/unidades/useUnidadesApi';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import toast from 'react-hot-toast';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<Unidad | null>(null);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [filtros, setFiltros] = useState({ search: '' });
  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;

  const { getUnidades, crearUnidad, actualizarUnidad } = useUnidadesApi();

  const handleGetUnidades = useCallback(async () => {
    try {
      const data = await getUnidades();
      setUnidades(data);
    } catch (error) {
      toast.error('Error al cargar unidades');
    }
  }, [getUnidades]);

  const handleCrearUnidad = useCallback(
    async (nuevaUnidad: Unidad) => {
      try {
        await crearUnidad(nuevaUnidad);
        setModalCrearOpen(false);
        await handleGetUnidades();
        toast.success('Unidad creada exitosamente');
      } catch (error) {
        toast.error('Error al crear unidad');
      }
    },
    [crearUnidad, handleGetUnidades]
  );

  const handleActualizarUnidad = useCallback(
    async (id: number, unidad: NuevaUnidad) => {
      try {
        await actualizarUnidad(id, unidad);
        setModalEditarOpen(false);
        await handleGetUnidades();
        toast.success('Unidad actualizada exitosamente');
      } catch (error) {
        toast.error('Error al actualizar unidad');
      }
    },
    [actualizarUnidad, handleGetUnidades]
  );

  useEffect(() => {
    handleGetUnidades();
  }, [handleGetUnidades]);

  const abrirModalEditar = (unidad: Unidad) => {
    setUnidadSeleccionada(unidad);
    setModalEditarOpen(true);
  };

  const unidadesFiltradas = useMemo(() => {
    return aplicarFiltros(unidades, filtros, {
      camposTexto: ['nombre'],
    });
  }, [unidades, filtros]);

  const start = (paginaActual - 1) * rowsPerPage;
  const paginadas = unidadesFiltradas.slice(start, start + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Unidades</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalCrearOpen(true)}
          >
            Crear unidad
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={unidadesFiltradas.length}
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
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginadas.map((unidad) => (
                    <TableRow key={unidad.id} hover>
                      <TableCell>{unidad.nombre}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => abrirModalEditar(unidad)}>
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
          )}
        </TablaPaginadaConFiltros>
      </Card>

      <ModalCrearUnidad
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onCrearUnidad={handleCrearUnidad}
      />

      {unidadSeleccionada && (
        <ModalEditarUnidad
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={unidadSeleccionada}
          onActualizarUnidad={handleActualizarUnidad}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
