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
} from '@mui/material';
import { useRouter } from 'next/router';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { paths } from 'src/paths';
import { useEffect, useMemo, useState } from 'react';
import { OrdenMovimientoInventario } from 'src/api/types';
import { useMovimientosInventarioApi } from 'src/api/movimientos/useMovimientosInventarioApi';
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';

export const HistorialTrasladosInventario = () => {
  const router = useRouter();
  const { getOrdenesMovimientoInventario } = useMovimientosInventarioApi();

  const [ordenes, setOrdenes] = useState<OrdenMovimientoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ search: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrdenesMovimientoInventario();
        setOrdenes(data);
      } catch (err) {
        console.error('Error al obtener órdenes de movimiento', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getOrdenesMovimientoInventario]);

  const mapTipoMovimiento = (tipo: number) => {
    switch (tipo) {
      case 1:
        return 'Entrada';
      case 2:
        return 'Salida';
      default:
        return 'Desconocido';
    }
  };

  const ordenesFiltradas = useMemo(() => {
    const texto = (filtros.search ?? '').toLowerCase();

    return ordenes.filter((orden) => {
      const coincideBasicos =
        aplicarFiltros([orden], filtros, {
          camposTexto: ['id', 'proyecto.nombre'],
          campoFecha: 'fecha_movimiento',
        }).length > 0;

      const tipoTexto = mapTipoMovimiento(orden.tipo_movimiento).toLowerCase();
      const coincideTipo = texto === '' || tipoTexto.includes(texto);

      return coincideBasicos || coincideTipo;
    });
  }, [ordenes, filtros]);

  return (
    <Card sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ px: 3, pt: 3 }}
      >
        Historial de movimientos de inventario
      </Typography>

      {loading ? (
        <CircularProgress sx={{ m: 3 }} />
      ) : (
        <TablaPaginadaConFiltros
          totalItems={ordenesFiltradas.length}
          onFiltrar={(f) => setFiltros(f)}
          filtrosFecha // 👈 ahora activamos filtro por fecha
          filtrosEstado={false}
        >
          {(currentPage) => {
            const items = ordenesFiltradas.slice((currentPage - 1) * 5, currentPage * 5);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Fecha de orden de movimiento</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Proyecto</TableCell>
                      <TableCell align="center">Ver detalles</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((orden) => (
                      <TableRow key={orden.id}>
                        <TableCell>{orden.id}</TableCell>
                        <TableCell>{formatearFecha(orden.fecha_movimiento)}</TableCell>
                        <TableCell>{mapTipoMovimiento(orden.tipo_movimiento)}</TableCell>
                        <TableCell>{orden.proyecto.nombre}</TableCell>

                        <TableCell align="center">
                          <IconButton
                            onClick={() =>
                              router.push(
                                `${paths.dashboard.oficina.movimiento_inventario(orden.id)}`
                              )
                            }
                          >
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
      )}
    </Card>
  );
};
