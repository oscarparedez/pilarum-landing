import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { HistorialRebajasInventario } from 'src/sections/oficina/inventario/historial/historial-rebajas-de-inventario';
import { useRouter } from 'next/router';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

const Page: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const canCreateRebajarInventario = useHasPermission(PermissionId.REBAJAR_INVENTARIO);

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
          <Typography variant="h5">Rebajas de Inventario</Typography>
          
          {canCreateRebajarInventario && (
            <Button
              variant="contained"
              color="warning"
              size={isXs ? 'small' : 'medium'}
              startIcon={<RemoveIcon />}
              onClick={() => router.push('/oficina/inventario/rebajar')}
            >
              Nueva rebaja
            </Button>
          )}
        </Stack>
      </Card>
      
      {/* HISTORIAL REBAJAS DE INVENTARIO */}
      <HistorialRebajasInventario />
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
