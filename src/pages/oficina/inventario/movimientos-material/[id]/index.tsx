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
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { InventarioConMovimientos } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { useMovimientosInventarioApi } from 'src/api/movimientos/useMovimientosInventarioApi';
import { paths } from 'src/paths';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getMovimientosPorInventario } = useMovimientosInventarioApi();

  const [inventario, setInventario] = useState<InventarioConMovimientos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventario = async () => {
      if (!id) return;
      try {
        const data = await getMovimientosPorInventario(Number(id));
        setInventario(data);
      } catch {
        toast.error('Error al cargar el inventario del material');
        setInventario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, [id, getMovimientosPorInventario]);

  const onClickMovimiento = useCallback(
    (movimientoId: number) => {
      router.push(paths.dashboard.oficina.movimiento_inventario(movimientoId));
    },
    [router]
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {loading && <FullPageLoader />}
      <Card sx={{ p: 3 }}>
        <Stack
          direction="column"
          spacing={1}
          mb={2}
        >
          <Typography variant="h5">{inventario?.material?.nombre || 'N/A'}</Typography>
          <Typography variant="h6">
            Precio unitario: {formatearQuetzales(Number()) ?? 'N/A'}
          </Typography>
          <Typography variant="h6">
            Marca: {inventario?.material?.marca?.nombre || 'N/A'}
          </Typography>
          <Typography variant="h6">
            Unidad: {inventario?.material?.unidad?.nombre || 'N/A'}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>ID Movimiento</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell>Fecha movimiento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventario?.movimientos?.length ? (
                inventario.movimientos.map((mov, index) => (
                  <TableRow
                    key={mov.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onClickMovimiento(mov.id)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{mov.orden_movimiento_id}</TableCell>
                    <TableCell>
                      {mov.tipo_movimiento === 1 ? 'Entrada a bodega' : 'Salida de bodega'}
                    </TableCell>
                    <TableCell>{mov.cantidad}</TableCell>
                    <TableCell>{mov.proyecto?.nombre ?? 'N/A'}</TableCell>
                    <TableCell>{formatearFecha(mov.fecha_movimiento)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    No se encontraron movimientos para este material
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
