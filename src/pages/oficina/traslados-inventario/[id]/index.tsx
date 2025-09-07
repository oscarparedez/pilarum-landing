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
import { ErrorOverlay } from 'src/components/error-overlay';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getOrdenById } = useMovimientosInventarioApi();

  const [orden, setOrden] = useState<OrdenMovimientoInventario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrden = async () => {
      if (!id) return;
      try {
        const data = await getOrdenById(Number(id));
        setOrden(data);
        setError(false);
      } catch {
        setOrden(null);
        setError(true);
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
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* HEADER CARD */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: 3, py: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h5">Traslado de Inventario #{orden?.id}</Typography>
            <Chip
              label={orden?.tipo_movimiento === 1 ? 'Entrada a bodega' : 'Salida de bodega'}
              color={orden?.tipo_movimiento === 1 ? 'success' : 'warning'}
              size="small"
            />
          </Stack>
        </Box>
      </Card>

      {/* INFORMACIÓN GENERAL CARD */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
          >
            Información General
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
                    Proyecto
                  </Typography>
                  <Typography variant="body1">
                    {orden?.proyecto?.nombre ?? 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Tipo de Traslado
                  </Typography>
                  <Typography variant="body1">
                    {orden?.tipo_movimiento === 1 ? 'Entrada a bodega' : 'Salida de bodega'}
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
                    Fecha de Traslado
                  </Typography>
                  <Typography variant="body1">
                    {orden && formatearFecha(orden.fecha_movimiento)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Usuario Creador
                  </Typography>
                  <Typography variant="body1">
                    {orden?.usuario_creador?.first_name} {orden?.usuario_creador?.last_name}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* MATERIALES CARD */}
      <Card>
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
          >
            Materiales
          </Typography>

          <TableContainer
            component={Paper}
            variant="outlined"
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Unidad</TableCell>
                  <TableCell align="right">Precio Unitario</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orden?.materiales?.length ? (
                  orden.materiales.map((detalle: DetalleInventarioMaterial, index) => (
                    <TableRow
                      key={detalle.id}
                      hover
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {detalle.inventario.material.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>{detalle.inventario.material.marca?.nombre || '-'}</TableCell>
                      <TableCell>{detalle.inventario.material.unidad?.nombre || '-'}</TableCell>
                      <TableCell align="right">
                        {formatearQuetzales(Number(detalle.inventario.precio_unitario))}
                      </TableCell>
                      <TableCell align="right">{detalle.cantidad}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 3 }}
                    >
                      <Typography color="text.secondary">
                        No se encontraron materiales en esta orden
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
      {error && <ErrorOverlay tipoReporte="Traslado de inventario" />}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
