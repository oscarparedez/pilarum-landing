import {
  Box,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { HistorialOrdenesDeCompra } from './historial-ordenes-de-compra';
import { Inventario } from './inventario';
import { HistorialRebajasInventario } from './historial-rebajas-de-inventario';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from '../roles/permissions';
import { HistorialTrasladosInventario } from './historial-movimientos-de-inventario';

const Page: NextPage = () => {
  const canViewHistorialOrdenesCompra = useHasPermission(PermissionId.VER_HIST_OC);
  const canViewHistorialRebajasInventario = useHasPermission(PermissionId.VER_HIST_REBAJAS);
  const canViewHistorialTrasladosInventario = useHasPermission(PermissionId.VER_HIST_TRASLADOS);

  return (
    <Box sx={{ p: 3 }}>
      {/* INVENTARIO */}
      <Inventario />

      {/* HISTORIAL ORDENES DE COMPRA */}
      {canViewHistorialOrdenesCompra && <HistorialOrdenesDeCompra />}

      {/* HISTORIAL REBAJAS DE INVENTARIO */}
      {canViewHistorialRebajasInventario && <HistorialRebajasInventario />}

      {/* HISTORIAL TRASLADOS DE INVENTARIO */}
      {canViewHistorialTrasladosInventario && <HistorialTrasladosInventario />}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
