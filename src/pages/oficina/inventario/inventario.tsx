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
import { PermissionId } from '../roles/permissions';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';

export const Inventario = () => {
  const [filtros, setFiltros] = useState({ search: '' });
  const [inventario, setInventario] = useState<InventarioInterface[]>([]);
  const router = useRouter();
  const { getInventario } = useInventarioApi();
  const canCreateOrdenCompra = useHasPermission(PermissionId.GENERAR_ORDEN_COMPRA);
  const canCreateRebajarInventario = useHasPermission(PermissionId.REBAJAR_INVENTARIO);
  const canTrasladarMateriales = useHasPermission(PermissionId.GENERAR_TRASLADO);

  // ✅ aplicar filtros con helper
  const inventarioFiltrado = useMemo(() => {
    return aplicarFiltros(inventario, filtros, {
      camposTexto: ['id', 'material.nombre', 'material.unidad.nombre'],
      // aquí no usamos fecha, estado ni empresa
    });
  }, [inventario, filtros]);

  const fetchInventario = useCallback(async () => {
    try {
      const data = await getInventario();
      setInventario(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener inventario');
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
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, py: 3 }}
      >
        <Typography variant="h5">Inventario en bodega central</Typography>
        <Stack
          direction="row"
          spacing={2}
        >
          {canCreateRebajarInventario && (
            <Button
              variant="outlined"
              onClick={() => router.push('/oficina/inventario/rebajar')}
            >
              Rebajar inventario
            </Button>
          )}
          {canCreateOrdenCompra && (
            <Button
              variant="contained"
              onClick={() => router.push('/oficina/inventario/crear')}
            >
              Crear orden de compra
            </Button>
          )}
          {canTrasladarMateriales && (
            <Button
              variant="contained"
              color="secondary"
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
            <TableContainer component={Paper}>
              <Table size="small">
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
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                    >
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.material?.nombre || '-'}</TableCell>
                      <TableCell>{item.material?.unidad?.nombre || '-'}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>{formatearQuetzales(Number(item.precio_unitario))}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => verMovimientos(item.id)}>
                          <SvgIcon>
                            <VisibilityIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }}
      </TablaPaginadaConFiltros>
    </Card>
  );
};
