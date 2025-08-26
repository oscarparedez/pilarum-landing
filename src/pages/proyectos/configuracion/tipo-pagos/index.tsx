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
import { ModalCrearTipoPago } from 'src/sections/proyectos/configuracion/tipos-pagos/crear-tipo-pago-modal';
import { ModalEditarTipoPago } from 'src/sections/proyectos/configuracion/tipos-pagos/editar-tipo-pago-modal';
import { useTiposPagoApi } from 'src/api/tipoPagos/useTipoPagosApi';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { formatearFecha } from 'src/utils/format-date';
import { NuevoTipoCosto, TipoCosto } from 'src/api/types';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoCosto | null>(null);
  const [tiposPago, setTiposPago] = useState<TipoCosto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const canCreateTipoPago = useHasPermission(PermissionId.CREAR_TIPO_COSTO);
  const canEditTipoPago = useHasPermission(PermissionId.EDITAR_TIPO_COSTO);

  const { getTiposPago, crearTipoPago, actualizarTipoPago } = useTiposPagoApi();

  const fetchTiposPago = useCallback(async () => {
    try {
      const data = await getTiposPago();
      setTiposPago(data);
    } catch {
      toast.error('Error al obtener tipos de pago');
    }
  }, [getTiposPago]);

  useEffect(() => {
    fetchTiposPago();
  }, [fetchTiposPago]);

  const abrirModalEditar = (tipo: TipoCosto) => {
    setTipoSeleccionado(tipo);
    setModalEditarOpen(true);
  };

  const handleCrear = async (nuevo: NuevoTipoCosto) => {
    try {
      setLoading(true);
      await crearTipoPago(nuevo);
      toast.success('Tipo de pago creado correctamente');
      setModalCrearOpen(false);
      fetchTiposPago();
    } catch {
      toast.error('Error al crear tipo de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = async (id: number, editado: NuevoTipoCosto) => {
    try {
      setLoading(true);
      await actualizarTipoPago(id, editado);
      toast.success('Tipo de pago actualizado correctamente');
      fetchTiposPago();
      setModalEditarOpen(false);
    } catch {
      toast.error('Error al actualizar tipo de pago');
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
          <Typography variant="h5">Tipos de pago</Typography>
          {canCreateTipoPago && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalCrearOpen(true)}
            >
              Crear tipo de pago
            </Button>
          )}
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={tiposPago.length}
          onFiltrar={({ search }) => setSearch(search)}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = tiposPago
              .filter((tipo) => tipo.nombre.toLowerCase().includes(search.toLowerCase()))
              .slice((currentPage - 1) * 5, currentPage * 5);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha creación</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Usuario creador</TableCell>
                      {canEditTipoPago && <TableCell align="center">Acciones</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((tipo) => (
                      <TableRow
                        key={tipo.id}
                        hover
                      >
                        <TableCell>{formatearFecha(tipo.fecha_creacion)}</TableCell>
                        <TableCell>{tipo.nombre}</TableCell>
                        <TableCell>{tipo.usuario_creador.first_name} {tipo.usuario_creador.last_name}</TableCell>
                        {canEditTipoPago && (
                          <TableCell align="center">
                            <IconButton onClick={() => abrirModalEditar(tipo)}>
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
            );
          }}
        </TablaPaginadaConFiltros>
      </Card>

      <ModalCrearTipoPago
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onConfirm={handleCrear}
      />

      {tipoSeleccionado && (
        <ModalEditarTipoPago
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
