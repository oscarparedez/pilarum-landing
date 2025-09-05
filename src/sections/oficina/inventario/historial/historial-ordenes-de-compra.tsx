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
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { paths } from 'src/paths';
import dayjs from 'dayjs';
import { useOrdenesCompraApi } from 'src/api/ordenesCompra/useOrdenesCompraApi';
import { CompraMaterial, OrdenCompra } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import { formatearFecha } from 'src/utils/format-date';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { formatearQuetzales } from 'src/utils/format-currency';

export const HistorialOrdenesDeCompra = () => {
  const router = useRouter();
  const { getOrdenesCompra } = useOrdenesCompraApi();
  const canViewDetalleOrdenCompra = useHasPermission(PermissionId.VER_DETALLE_OC);

  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({ search: '' });

  const fetchOrdenes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrdenesCompra();
      setOrdenes(data);
    } catch (error) {
      console.error('Error al obtener órdenes de compra', error);
    } finally {
      setLoading(false);
    }
  }, [getOrdenesCompra]);

  useEffect(() => {
    fetchOrdenes();
  }, [fetchOrdenes]);

  const calcularTotal = useCallback((compras: CompraMaterial[]) => {
    return compras.reduce((acc, c) => acc + Number(c.cantidad) * Number(c.precio_unitario), 0);
  }, []);

  // ✅ aplicar filtros con helper genérico
  const ordenesFiltradas = useMemo(() => {
    return aplicarFiltros(ordenes, filtros, {
      camposTexto: [
        'id',
        'usuario_creador.first_name',
        'usuario_creador.last_name',
        'numero_factura',
      ],
      campoFecha: 'fecha_factura',
    });
  }, [ordenes, filtros]);

  return (
    <Card>
      {loading && <FullPageLoader />}

      <TablaPaginadaConFiltros
        totalItems={ordenesFiltradas.length}
        itemsPerPage={25}
        onFiltrar={(f) => setFiltros(f)}
        filtrosFecha
      >
        {(currentPage) => {
          const items = ordenesFiltradas.slice((currentPage - 1) * 25, currentPage * 25);

          return (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Fecha de creación</TableCell>
                    <TableCell>Fecha de factura</TableCell>
                    <TableCell>Usuario creador</TableCell>
                    <TableCell>Número de factura</TableCell>
                    <TableCell>Total (Q)</TableCell>
                    <TableCell>Usuario creador</TableCell>
                    {canViewDetalleOrdenCompra && (
                      <TableCell align="center">Ver detalles</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((orden, index) => (
                    <TableRow key={orden.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatearFecha(orden.fecha_creacion)}</TableCell>
                      <TableCell>{formatearFecha(orden.fecha_factura)}</TableCell>
                      <TableCell>
                        {orden.usuario_creador.first_name} {orden.usuario_creador.last_name}
                      </TableCell>
                      <TableCell>{orden.numero_factura}</TableCell>
                      <TableCell>{formatearQuetzales(calcularTotal(orden.compras))}</TableCell>
                      <TableCell>{orden.usuario_creador.first_name} {orden.usuario_creador.last_name}</TableCell>
                      {canViewDetalleOrdenCompra && (
                        <TableCell align="center">
                          <IconButton
                            onClick={() =>
                              router.push(`${paths.dashboard.oficina.orden_de_compra(orden.id)}`)
                            }
                          >
                            <SvgIcon>
                              <VisibilityIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {items.length === 0 && !loading && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                      >
                        No hay órdenes de compra registradas
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
