import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/SendRounded';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { HistorialTrasladosInventario } from 'src/sections/oficina/inventario/historial/historial-movimientos-de-inventario';
import { useRouter } from 'next/router';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

const Page: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const canTrasladarMateriales = useHasPermission(PermissionId.GENERAR_TRASLADO);

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
          <Typography variant="h5">Traslados de Materiales</Typography>
          
          {canTrasladarMateriales && (
            <Button
              variant="contained"
              color="secondary"
              size={isXs ? 'small' : 'medium'}
              startIcon={<SendIcon />}
              onClick={() => router.push('/oficina/inventario/trasladar')}
            >
              Nuevo traslado
            </Button>
          )}
        </Stack>
      </Card>
      
      {/* HISTORIAL TRASLADOS DE INVENTARIO */}
      <HistorialTrasladosInventario />
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
