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
  Chip,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { OrdenCompra } from 'src/api/types';
import { useOrdenesCompraApi } from 'src/api/ordenesCompra/useOrdenesCompraApi';
import toast from 'react-hot-toast';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { ErrorOverlay } from 'src/components/error-overlay';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getOrdenCompraById } = useOrdenesCompraApi();

  const [orden, setOrden] = useState<OrdenCompra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrden = async () => {
      if (!id) return;
      try {
        const data = await getOrdenCompraById(Number(id));
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
  }, [id, getOrdenCompraById]);
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const total = orden?.compras.reduce(
    (sum, c) => sum + Number(c.cantidad) * Number(c.precio_unitario),
    0
  );

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
            <Typography variant="h5">Orden de Compra #{orden?.id}</Typography>
            <Chip
              label="Completada"
              color="success"
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
                    Nombre de Factura
                  </Typography>
                  <Typography variant="body1">{orden?.numero_factura}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Proveedor
                  </Typography>
                  <Typography variant="body1">
                    {orden?.proveedor?.nombre ?? 'No especificado'}
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
                    Fecha de Factura
                  </Typography>
                  <Typography variant="body1">
                    {orden && formatearFecha(orden.fecha_factura)}
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Materiales Comprados</Typography>
            <Typography
              variant="h6"
              color="primary"
            >
              Total: {formatearQuetzales(Number(total))}
            </Typography>
          </Stack>

          <TableContainer
            component={Paper}
            variant="outlined"
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Precio Unitario</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orden?.compras.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.material.nombre}</Typography>
                    </TableCell>
                    <TableCell align="right">{item.cantidad}</TableCell>
                    <TableCell align="right">
                      {formatearQuetzales(Number(item.precio_unitario))}
                    </TableCell>
                    <TableCell align="right">
                      {formatearQuetzales(Number(item.cantidad) * Number(item.precio_unitario))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      {/* ERROR OVERLAY */}
      {error && <ErrorOverlay tipoReporte="Orden de compra" />}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
