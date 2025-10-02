import React from 'react';
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
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useInventarioApi } from 'src/api/inventario/useInventarioApi';
import toast from 'react-hot-toast';
import { Inventario as InventarioInterface } from 'src/api/types';
import { formatearQuetzales } from 'src/utils/format-currency';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { paths } from 'src/paths';

export const Inventario = () => {
  const [filtros, setFiltros] = useState({ search: '' });
  const [inventario, setInventario] = useState<InventarioInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getInventario } = useInventarioApi();

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
    router.push(paths.dashboard.oficina.movimientos_material(productoId));
  };

  return (
    <React.Fragment>
      {/* HEADER CARD */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
          <Typography variant="h5">Inventario en bodega central</Typography>
        </Box>
      </Card>

      {/* LISTADO DE MATERIALES CARD */}
      <Card>
        <TablaPaginadaConFiltros
          totalItems={inventarioFiltrado.length}
          itemsPerPage={25}
          onFiltrar={(f) => setFiltros(f)}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage) => {
            const items = inventarioFiltrado.slice((currentPage - 1) * 25, currentPage * 25);
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
                        <TableCell align="center">Ver movimientos</TableCell>
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
    </React.Fragment>
  );
};
