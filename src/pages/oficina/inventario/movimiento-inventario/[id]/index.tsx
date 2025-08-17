import {
  Box,
  Card,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { OrdenMovimientoInventario, DetalleInventarioMaterial } from 'src/api/types';
import { formatearQuetzales } from 'src/utils/format-currency';
import { useMovimientosInventarioApi } from 'src/api/movimientos/useMovimientosInventarioApi';
import { formatearFecha } from 'src/utils/format-date';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getOrdenById } = useMovimientosInventarioApi();

  const [orden, setOrden] = useState<OrdenMovimientoInventario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrden = async () => {
      if (!id) return;
      try {
        const data = await getOrdenById(Number(id));
        setOrden(data);
      } catch {
        toast.error('Error al cargar la orden de movimiento');
        setOrden(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrden();
  }, [id, getOrdenById]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        {/* ENCABEZADO */}
        <Stack
          direction="column"
          spacing={1}
          mb={2}
        >
          <Typography variant="h5">Proyecto: {orden?.proyecto?.nombre ?? 'N/A'}</Typography>
          <Typography variant="body1">
            Tipo: {orden?.tipo_movimiento === 1 ? 'Entrada a bodega' : 'Salida hacia proyecto'}
          </Typography>
          <Typography variant="body1">
            Fecha movimiento: {orden && formatearFecha(orden.fecha_movimiento)}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* TABLA DE MATERIALES */}
        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          Materiales
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Cantidad solicitada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orden?.materiales?.length ? (
                orden.materiales.map((detalle: DetalleInventarioMaterial) => (
                  <TableRow key={detalle.id}>
                    <TableCell>{detalle.inventario.material.nombre}</TableCell>
                    <TableCell>{detalle.inventario.material.marca?.nombre}</TableCell>
                    <TableCell>{detalle.inventario.material.unidad?.nombre}</TableCell>
                    <TableCell>
                      {formatearQuetzales(Number(detalle.inventario.precio_unitario))}
                    </TableCell>
                    <TableCell>{detalle.cantidad}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    No se encontraron materiales en esta orden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
