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
import { Inventario, MovimientoInventario } from 'src/api/types';
import { format } from 'date-fns';
import { useInventarioApi } from 'src/api/inventario/useInventarioApi';
import { FullPageLoader } from 'src/components/loader/Loader';
import { formatearQuetzales } from 'src/utils/format-currency';

const Page: NextPage = () => {
  const router = useRouter();
  const { id: proyectoId, materialId } = router.query;
  const { getInventarioPorProyectoYMaterial } = useInventarioApi();

  const [inventario, setInventario] = useState<Inventario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventario = async () => {
      if (!materialId) return;
      try {
        const data = await getInventarioPorProyectoYMaterial(Number(proyectoId), Number(materialId));
        setInventario(data);
      } catch {
        toast.error('Error al cargar el inventario del material');
        setInventario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, [materialId, getInventarioPorProyectoYMaterial]);

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
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventario?.movimientos?.length ? (
                inventario.movimientos.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{mov.tipo_movimiento === 1 ? 'Entrada' : 'Salida'}</TableCell>
                    <TableCell>{mov.cantidad}</TableCell>
                    <TableCell>{mov.proyecto ?? 'N/A'}</TableCell>
                    <TableCell>
                      {mov.usuario_creador?.first_name} {mov.usuario_creador?.last_name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(mov.fecha_creacion), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
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
