import {
  Card,
  Typography,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  SvgIcon,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import SendIcon from '@mui/icons-material/SendRounded';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useInventarioApi } from 'src/api/inventario/useInventarioApi';
import toast from 'react-hot-toast';
import { Inventario as InventarioInterface } from 'src/api/types';
import { formatearQuetzales } from 'src/utils/format-currency';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';

export const Inventario = () => {
  const [filtros, setFiltros] = useState({ search: '' });
  const [inventario, setInventario] = useState<InventarioInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getInventario } = useInventarioApi();
  const canCreateOrdenCompra = useHasPermission(PermissionId.GENERAR_ORDEN_COMPRA);
  const canCreateRebajarInventario = useHasPermission(PermissionId.REBAJAR_INVENTARIO);
  const canTrasladarMateriales = useHasPermission(PermissionId.GENERAR_TRASLADO);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const inventarioFiltrado = useMemo(() => {
    return aplicarFiltros(inventario, filtros, {
      camposTexto: ['id', 'material.nombre', 'material.unidad.nombre'],
    });
  }, [inventario, filtros]);

  const fetchInventario = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInventario();
      const { inventarios } = data;
      setInventario(inventarios ?? []);
    } catch {
      toast.error('Error al obtener inventario');
    } finally {
      setLoading(false);
    }
  }, [getInventario]);

  useEffect(() => {
    fetchInventario();
  }, [fetchInventario]);

  const verMovimientos = (productoId: number) => {
    router.push(`/oficina/inventario/movimientos-material/${productoId}`);
  };

  return (
    <Card sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        gap={2}
        sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}
      >
        <Typography variant="h5">Inventario en bodega central</Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          useFlexGap
          flexWrap={{ sm: 'wrap' } as any}
        >
          {canCreateRebajarInventario && (
            <Button
              variant="outlined"
              size={isXs ? 'small' : 'medium'}
              fullWidth={isXs}
              onClick={() => router.push('/oficina/inventario/rebajar')}
            >
              Rebajar inventario
            </Button>
          )}
          {canCreateOrdenCompra && (
            <Button
              variant="contained"
              size={isXs ? 'small' : 'medium'}
              fullWidth={isXs}
              onClick={() => router.push('/oficina/inventario/crear')}
            >
              Crear orden de compra
            </Button>
          )}
          {canTrasladarMateriales && (
            <Button
              variant="contained"
              color="secondary"
              size={isXs ? 'small' : 'medium'}
              fullWidth={isXs}
              onClick={() => router.push('/oficina/inventario/trasladar')}
              endIcon={<SendIcon />}
            >
              Trasladar materiales
            </Button>
          )}
        </Stack>
      </Stack>

      <TablaPaginadaConFiltros
        totalItems={inventarioFiltrado.length}
        onFiltrar={(f) => setFiltros(f)}
        filtrosFecha={false}
        filtrosEstado={false}
      >
        {(currentPage) => {
          const items = inventarioFiltrado.slice((currentPage - 1) * 5, currentPage * 5);
          return (
            <TableContainer
              component={Paper}
              sx={{
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: { xs: 420, md: 560 },
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <Box sx={{ minWidth: 720 }}>
                <Table
                  size="small"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Material</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio Unitario</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow
                        key={item.id}
                        hover
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {item.material?.nombre || '-'}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {item.material?.unidad?.nombre || '-'}
                        </TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>{formatearQuetzales(Number(item.precio_unitario))}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size={isXs ? 'small' : 'medium'}
                            onClick={() => verMovimientos(item.id)}
                          >
                            <SvgIcon fontSize={isXs ? 'small' : 'medium'}>
                              <VisibilityIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          );
        }}
      </TablaPaginadaConFiltros>
    </Card>
  );
};
