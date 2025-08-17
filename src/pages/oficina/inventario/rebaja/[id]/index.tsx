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
import { Rebaja, DetalleInventarioMaterial } from 'src/api/types';
import { formatearFecha } from 'src/utils/format-date';
import { useRebajasInventarioApi } from 'src/api/rebajas/useRebajasApi';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getRebajaById } = useRebajasInventarioApi();

  const [rebaja, setRebaja] = useState<Rebaja | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRebaja = async () => {
      if (!id) return;
      try {
        const data = await getRebajaById(Number(id));
        setRebaja(data);
      } catch {
        toast.error('Error al cargar la rebaja');
        setRebaja(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRebaja();
  }, [id, getRebajaById]);

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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Rebaja de inventario #{rebaja?.id}</Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1">
          Fecha: <strong>{rebaja && formatearFecha(rebaja.fecha_rebaja)}</strong>
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2 }}
        >
          Motivo: <strong>{rebaja?.motivo ?? '-'}</strong>
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Precio unitario</TableCell>
                <TableCell>Cantidad rebajada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rebaja?.materiales?.length ? (
                rebaja.materiales.map((detalle: DetalleInventarioMaterial) => (
                  <TableRow key={detalle.id}>
                    <TableCell>{detalle.inventario.material.nombre}</TableCell>
                    <TableCell>{detalle.inventario.material.marca?.nombre}</TableCell>
                    <TableCell>{detalle.inventario.material.unidad?.nombre}</TableCell>
                    <TableCell>{detalle.inventario.precio_unitario}</TableCell>
                    <TableCell>{detalle.cantidad}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    No se encontraron materiales en esta rebaja
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
