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

const DETALLE_REBAJA_MOCK = {
  fecha: '2025-07-01',
  motivo: 'Material dañado por lluvia',
  materiales: [
    { nombre: 'Saco de cemento 20 kg', unidad: 'sacos', marca: 'CEMEX', cantidad: 10 },
    { nombre: 'Arena fina', unidad: 'm³', marca: 'ARENA S.A.', cantidad: 2 },
  ],
};

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const rebaja = DETALLE_REBAJA_MOCK;

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Rebaja de inventario #{id}</Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1">
          Fecha: <strong>{rebaja.fecha}</strong>
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2 }}
        >
          Motivo: <strong>{rebaja.motivo}</strong>
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Cantidad rebajada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rebaja.materiales.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.unidad}</TableCell>
                  <TableCell>{item.marca}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
