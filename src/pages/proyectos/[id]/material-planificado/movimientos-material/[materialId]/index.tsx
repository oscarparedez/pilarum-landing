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
  IconButton,
  SvgIcon,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { use, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { InventarioConMovimientos } from 'src/api/types';
import { useMovimientosInventarioApi } from 'src/api/movimientos/useMovimientosInventarioApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { paths } from 'src/paths';

const Page: NextPage = () => {
  const router = useRouter();
  const { id: proyectoId, materialId } = router.query;
  const { getMovimientosPorInventarioPorProyecto } = useMovimientosInventarioApi();

  const [inventario, setInventario] = useState<InventarioConMovimientos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventario = async () => {
      if (!materialId || !proyectoId) return;
      try {
        const data = await getMovimientosPorInventarioPorProyecto(
          Number(proyectoId),
          Number(materialId)
        );
        setInventario(data);
      } catch {
        toast.error('Error al cargar el inventario del material');
        setInventario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, [materialId, proyectoId, getMovimientosPorInventarioPorProyecto]);

  const verMovimiento = useCallback(
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
        <Typography
          variant="h4"
          mb={3}
        >
          Movimientos de Material en Proyecto
        </Typography>

        <Stack
          direction="column"
          spacing={1}
          mb={2}
        >
          <Typography variant="h5">{inventario?.material?.nombre || 'N/A'}</Typography>
          <Typography variant="h6">
            Precio unitario: {formatearQuetzales(Number(inventario?.precio_unitario)) ?? 'N/A'}
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
                <TableCell>Tipo movimiento</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell>Fecha Movimiento</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventario?.movimientos?.length ? (
                inventario.movimientos.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{mov.orden_movimiento_id}</TableCell>
                    <TableCell>
                      {mov.tipo_movimiento === 1 ? 'Entrada a bodega' : 'Salida de bodega'}
                    </TableCell>
                    <TableCell>{mov.cantidad}</TableCell>
                    <TableCell>{mov.proyecto?.nombre ?? 'N/A'}</TableCell>
                    <TableCell>{formatearFecha(mov.fecha_movimiento)}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => verMovimiento(mov.orden_movimiento_id)}>
                        <SvgIcon>
                          <VisibilityIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
