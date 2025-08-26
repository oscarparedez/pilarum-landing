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
import { OrdenCompra } from 'src/api/types';
import { useOrdenesCompraApi } from 'src/api/ordenesCompra/useOrdenesCompraApi';
import toast from 'react-hot-toast';
import { formatearQuetzales } from 'src/utils/format-currency';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getOrdenCompraById } = useOrdenesCompraApi();

  const [orden, setOrden] = useState<OrdenCompra | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrden = async () => {
      if (!id) return;
      try {
        const data = await getOrdenCompraById(Number(id));
        setOrden(data);
      } catch {
        toast.error('Error al cargar la orden de compra');
        setOrden(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrden();
  }, [id, getOrdenCompraById]);
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!orden) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No se encontró la orden de compra</Typography>
      </Box>
    );
  }

  const total = orden.compras.reduce(
    (sum, c) => sum + Number(c.cantidad) * Number(c.precio_unitario),
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Orden de compra #{orden.id}</Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          gutterBottom
        >
          Número de factura: <strong>{orden.numero_factura}</strong>
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
        >
          Proveedor: <strong>{orden.proveedor?.nombre ?? 'No especificado'}</strong>
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
        >
          Usuario creador: <strong>{orden.usuario_creador?.first_name} {orden.usuario_creador?.last_name}</strong>
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ mt: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario (Q)</TableCell>
                <TableCell>Subtotal (Q)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orden.compras.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.material.nombre}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>Q{Number(item.precio_unitario).toFixed(2)}</TableCell>
                  <TableCell>
                    {formatearQuetzales((Number(item.cantidad) * Number(item.precio_unitario)))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ mt: 4 }}
        >
          <Typography variant="h6">Total: Q{total.toFixed(2)}</Typography>
        </Stack>
      </Card>
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
