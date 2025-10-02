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
  Grid,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { InventarioConMovimientos } from 'src/api/types';
import { useMovimientosInventarioApi } from 'src/api/movimientos/useMovimientosInventarioApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';
import { paths } from 'src/paths';
import { ErrorOverlay } from 'src/components/error-overlay';

const Page: NextPage = () => {
  const router = useRouter();
  const { id: proyectoId, materialId } = router.query;
  const { getMovimientosPorInventarioPorProyecto } = useMovimientosInventarioApi();

  const [inventario, setInventario] = useState<InventarioConMovimientos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const mapTipoMovimiento = (tipo: number) => {
    switch (tipo) {
      case 1:
        return 'Entrada a bodega';
      case 2:
        return 'Salida de bodega';
      default:
        return 'Desconocido';
    }
  };

  useEffect(() => {
    const fetchInventario = async () => {
      if (!materialId || !proyectoId) return;
      try {
        const data = await getMovimientosPorInventarioPorProyecto(
          Number(proyectoId),
          Number(materialId)
        );
        setInventario(data);
        setError(false);
      } catch {
        setInventario(null);
        setError(true);
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
    <Box sx={{ p: 3, position: 'relative' }}>
      {loading && <FullPageLoader />}

      {/* HEADER CARD */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: 3, py: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h5">Traslados de Material en Proyecto</Typography>
            <Chip
              label="Por Proyecto"
              color="info"
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

      {/* MOVIMIENTOS DEL PROYECTO CARD */}
      <Card>
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
          >
            Movimientos en este Proyecto
          </Typography>

          <TableContainer
            component={Paper}
            variant="outlined"
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>ID Traslado</TableCell>
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
                        <Typography variant="body2">#{mov?.orden_movimiento_id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mapTipoMovimiento(mov.tipo_movimiento)}
                          color={mov.tipo_movimiento === 1 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{mov.proyecto?.nombre ?? 'N/A'}</TableCell>
                      <TableCell>{formatearFecha(mov.fecha_movimiento)}</TableCell>
                      <TableCell align="right">{mov.cantidad}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => verMovimiento(mov.orden_movimiento_id)}>
                          <VisibilityIcon />
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
                        No se encontraron movimientos para este material en el proyecto
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      {/* ERROR OVERLAY */}
      {error && <ErrorOverlay tipoReporte="Material planificado" />}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
