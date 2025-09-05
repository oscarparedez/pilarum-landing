import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { HistorialOrdenesDeCompra } from 'src/sections/oficina/inventario/historial/historial-ordenes-de-compra';
import { useRouter } from 'next/router';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

const Page: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const canCreateOrdenCompra = useHasPermission(PermissionId.GENERAR_ORDEN_COMPRA);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          gap={2}
          sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}
        >
          <Typography variant="h5">Órdenes de Compra</Typography>
          
          {canCreateOrdenCompra && (
            <Button
              variant="contained"
              color="primary"
              size={isXs ? 'small' : 'medium'}
              startIcon={<AddShoppingCartIcon />}
              onClick={() => router.push('/oficina/inventario/crear')}
            >
              Nueva orden de compra
            </Button>
          )}
        </Stack>
      </Card>
      
      {/* HISTORIAL ORDENES DE COMPRA */}
      <HistorialOrdenesDeCompra />
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
