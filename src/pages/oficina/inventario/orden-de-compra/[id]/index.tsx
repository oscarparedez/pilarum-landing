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
} from '@mui/material';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';

const DETALLE_ORDEN_MOCK = {
  factura: 'FAC-00123',
  total: 1450,
  materiales: [
    { nombre: 'Saco de cemento 20 kg', unidad: 'sacos', cantidad: 30, costoUnitario: 25 },
    { nombre: 'Arena fina', unidad: 'm³', cantidad: 5, costoUnitario: 50 },
  ],
};

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const orden = DETALLE_ORDEN_MOCK;

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Orden de compra #{id}</Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="subtitle1"
          gutterBottom
        >
          Número de factura: <strong>{orden.factura}</strong>
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ mt: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Costo Unitario (Q)</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orden.materiales.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.unidad}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>Q{item.costoUnitario.toFixed(2)}</TableCell>
                  <TableCell>Q{(item.cantidad * item.costoUnitario).toFixed(2)}</TableCell>
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
          <Typography variant="h6">Total: Q{orden.total.toFixed(2)}</Typography>
        </Stack>
      </Card>
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
