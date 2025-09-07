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
import { Rebaja, DetalleInventarioMaterial } from 'src/api/types';
import { formatearFecha } from 'src/utils/format-date';
import { formatearQuetzales } from 'src/utils/format-currency';
import { useRebajasInventarioApi } from 'src/api/rebajas/useRebajasApi';
import { ErrorOverlay } from 'src/components/error-overlay';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getRebajaById } = useRebajasInventarioApi();

  const [rebaja, setRebaja] = useState<Rebaja | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRebaja = async () => {
      if (!id) return;
      try {
        const data = await getRebajaById(Number(id));
        setRebaja(data);
        setError(false);
      } catch {
        setRebaja(null);
        setError(true);
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
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* HEADER CARD */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: 3, py: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h5">Rebaja de Inventario #{rebaja?.id}</Typography>
            <Chip
              label="Procesada"
              color="warning"
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
                    Fecha de Rebaja
                  </Typography>
                  <Typography variant="body1">
                    {rebaja && formatearFecha(rebaja.fecha_rebaja)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Motivo
                  </Typography>
                  <Typography variant="body1">{rebaja?.motivo || 'No especificado'}</Typography>
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
                    Usuario Creador
                  </Typography>
                  <Typography variant="body1">
                    {rebaja?.usuario_creador?.first_name} {rebaja?.usuario_creador?.last_name}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* MATERIALES REBAJADOS CARD */}
      <Card>
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
          >
            Materiales Rebajados
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
                  <TableCell align="right">Cantidad Rebajada</TableCell>
                  <TableCell align="right">Precio Unitario</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rebaja?.materiales?.length ? (
                  rebaja.materiales.map((detalle: DetalleInventarioMaterial, index) => (
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
                      <TableCell align="right">{detalle.cantidad}</TableCell>
                      <TableCell align="right">
                        {formatearQuetzales(Number(detalle.inventario.precio_unitario))}
                      </TableCell>
                      <TableCell align="right">
                        {formatearQuetzales(
                          Number(detalle.inventario.precio_unitario) * Number(detalle.cantidad)
                        )}
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
                        No se encontraron materiales en esta rebaja
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
      {error && <ErrorOverlay tipoReporte="Rebaja de inventario" />}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
