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
  Grid,
  Chip,
  IconButton,
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

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

      {/* HEADER CARD */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: 3, py: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h5">Movimientos de Material</Typography>
            <Chip
              label="Activo"
              color="success"
              size="small"
            />
          </Stack>
        </Box>
      </Card>

      {/* INFORMACIÓN DEL MATERIAL CARD */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
          >
            Información del Material
          </Typography>

          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Nombre del Material
                  </Typography>
                  <Typography variant="body1">{inventario?.material?.nombre || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Marca
                  </Typography>
                  <Typography variant="body1">
                    {inventario?.material?.marca?.nombre || 'No especificada'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Precio Unitario
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                  >
                    {formatearQuetzales(Number(inventario?.precio_unitario)) ?? 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Unidad de Medida
                  </Typography>
                  <Typography variant="body1">
                    {inventario?.material?.unidad?.nombre || 'No especificada'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* HISTORIAL DE MOVIMIENTOS CARD */}
      <Card>
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
          >
            Historial de Movimientos
          </Typography>

          <TableContainer
            component={Paper}
            variant="outlined"
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>ID Movimiento</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Proyecto</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="center">Ver detalles</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventario?.movimientos?.length ? (
                  inventario.movimientos.map((mov, index) => (
                    <TableRow
                      key={mov.id}
                      hover
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2">#{mov.orden_movimiento_id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mov.tipo_movimiento === 1 ? 'Entrada' : 'Salida'}
                          color={mov.tipo_movimiento === 1 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{mov.proyecto?.nombre ?? 'N/A'}</TableCell>
                      <TableCell>{formatearFecha(mov.fecha_movimiento)}</TableCell>
                      <TableCell align="right">{mov.cantidad}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => onClickMovimiento(mov.orden_movimiento_id)}>
                          <VisibilityOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 3 }}
                    >
                      <Typography color="text.secondary">
                        No se encontraron movimientos para este material
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
