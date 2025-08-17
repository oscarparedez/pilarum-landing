import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  SvgIcon,
  CircularProgress,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { paths } from 'src/paths';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from '../roles/permissions';
import { useEffect, useMemo, useState } from 'react';
import { formatearFecha } from 'src/utils/format-date';
import { useRebajasInventarioApi } from 'src/api/rebajas/useRebajasApi';
import { Rebaja } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';

export const HistorialRebajasInventario = () => {
  const router = useRouter();
  const canViewDetalleHistorialRebaja = useHasPermission(PermissionId.VER_DETALLE_REBAJA);
  const { listRebajas } = useRebajasInventarioApi();

  const [rebajas, setRebajas] = useState<Rebaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ search: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listRebajas();
        setRebajas(data);
      } catch (err) {
        console.error('Error al obtener rebajas', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listRebajas]);

  // ✅ aplicar helper
  const rebajasFiltradas = useMemo(() => {
    return aplicarFiltros(rebajas, filtros, {
      camposTexto: ['id', 'motivo'],
      campoFecha: 'fecha_rebaja',
    });
  }, [rebajas, filtros]);

  return (
    <Card sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ px: 3, pt: 3 }}>
        Historial de rebajas de inventario
      </Typography>

      {loading && <FullPageLoader />}

      <TablaPaginadaConFiltros
        totalItems={rebajasFiltradas.length}
        onFiltrar={(f) => setFiltros(f)}
        filtrosFecha // 👈 ahora activamos filtro por fecha
        filtrosEstado={false}
      >
        {(currentPage) => {
          const items = rebajasFiltradas.slice((currentPage - 1) * 5, currentPage * 5);

          return (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Fecha de rebaja</TableCell>
                    <TableCell>Motivo</TableCell>
                    {canViewDetalleHistorialRebaja && (
                      <TableCell align="center">Ver detalles</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((rebaja) => (
                      <TableRow key={rebaja.id}>
                        <TableCell>{rebaja.id}</TableCell>
                        <TableCell>{formatearFecha(rebaja.fecha_rebaja)}</TableCell>
                        <TableCell>{rebaja.motivo ?? '-'}</TableCell>
                        {canViewDetalleHistorialRebaja && (
                          <TableCell align="center">
                            <IconButton
                              onClick={() =>
                                router.push(`${paths.dashboard.oficina.rebaja(rebaja.id)}`)
                              }
                            >
                              <SvgIcon>
                                <VisibilityIcon />
                              </SvgIcon>
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={canViewDetalleHistorialRebaja ? 4 : 3}
                        align="center"
                      >
                        No se encontraron rebajas de inventario
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }}
      </TablaPaginadaConFiltros>
    </Card>
  );
};