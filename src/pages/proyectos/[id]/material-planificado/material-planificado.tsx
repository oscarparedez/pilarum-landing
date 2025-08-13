import { FC, useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
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
  Tooltip,
  Button,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/SendRounded';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalMovimientos } from './movimientos-material-planificado-modal';
import { useInventarioApi } from 'src/api/inventario/useInventarioApi';
import { Inventario } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import { formatearQuetzales } from 'src/utils/format-currency';
import { paths } from 'src/paths';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/pages/oficina/roles/permissions';

export const MaterialPlanificado: FC = () => {
  const router = useRouter();
  const proyectoIdParam = router.query.id;
  const proyectoId = typeof proyectoIdParam === 'string' ? Number(proyectoIdParam) : NaN;

  const { getInventarioPorProyecto } = useInventarioApi();

  const [loading, setLoading] = useState(false);
  const [inventarioProyecto, setInventarioProyecto] = useState<Inventario[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');

  const canViewHistorialMovimientos = useHasPermission(PermissionId.VER_MOV_MATERIALES_PROYECTO)
  const canTrasladarABodegaCentral = useHasPermission(PermissionId.TRASLADAR_A_BODEGA_CENTRAL)

  const itemsConStock = useMemo(
    () => inventarioProyecto.filter((inv) => (inv.cantidad ?? 0) > 0),
    [inventarioProyecto]
  );

  const hayMaterial = itemsConStock.length > 0;

  const irATrasladar = useCallback(() => {
    router.push(paths.dashboard.proyectos.trasladar(proyectoId));
  }, [router, proyectoId]);

  const irATrasladarDesdeBodega = useCallback(() => {
    router.push(paths.dashboard.oficina.inventario);
  }, [router]);

  const irAMovimientos = useCallback(
    (id: number) => {
      router.push(paths.dashboard.proyectos.movimientos(proyectoId, id));
    },
    [router, proyectoId]
  );

  const loadInventario = useCallback(async () => {
    if (!router.isReady || !Number.isFinite(proyectoId)) return;
    setLoading(true);
    try {
      const data = await getInventarioPorProyecto(proyectoId);
      setInventarioProyecto(data ?? []);
    } catch (err) {
      console.error(err);
      toast.error('Error cargando inventario del proyecto');
    } finally {
      setLoading(false);
    }
  }, [router.isReady, proyectoId, getInventarioPorProyecto]);

  useEffect(() => {
    loadInventario();
  }, [loadInventario]);

  const EmptyState = useMemo(
    () => (
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" py={6} px={2}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay material con stock en este proyecto
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Cuando haya existencias, aparecerán aquí.
        </Typography>
        <Tooltip title="Ir a la pantalla para trasladar/devolver materiales">
          <span>
            <Button variant="contained" color="secondary" endIcon={<SendIcon />} onClick={irATrasladarDesdeBodega}>
              Trasladar desde bodega
            </Button>
          </span>
        </Tooltip>
      </Box>
    ),
    [irATrasladarDesdeBodega]
  );

  return (
    <Box sx={{ p: 3 }}>
      {loading && <FullPageLoader />}
      <Card sx={{ overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ px: 3, pt: 3, gap: 2 }}>
          <Typography variant="h5">Material planificado</Typography>
          <Tooltip title="Ir a la pantalla para trasladar/devolver materiales">
            <span>
              {hayMaterial && canTrasladarABodegaCentral && (
                <Button onClick={irATrasladar} variant="contained" color="secondary" endIcon={<SendIcon />}>
                  Trasladar a bodega
                </Button>
              )}
            </span>
          </Tooltip>
        </Stack>

        <Divider sx={{ mt: 2, mb: 0 }} />

        {!hayMaterial ? (
          EmptyState
        ) : (
          <TablaPaginadaConFiltros totalItems={itemsConStock.length} onFiltrar={() => {}} filtrosFecha={false} filtrosEstado={false}>
            {(currentPage, orden) => {
              const pageSize = 5;
              const sorted = itemsConStock.slice().sort((a, b) => {
                const na = a.material.nombre ?? '';
                const nb = b.material.nombre ?? '';
                return orden === 'asc' ? na.localeCompare(nb) : nb.localeCompare(na);
              });
              const pageItems = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

              return (
                <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Material</TableCell>
                        <TableCell>Unidad</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Precio unitario</TableCell>
                        { canViewHistorialMovimientos && <TableCell align="right">Acciones</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pageItems.map((inv) => (
                        <TableRow hover key={inv.id} sx={{ transition: '0.2s', '&:hover': { backgroundColor: 'action.hover' } }}>
                          <TableCell>
                            <Typography variant="subtitle2">{inv.material.nombre ?? '—'}</Typography>
                          </TableCell>
                          <TableCell>{inv.material.unidad?.nombre ?? '—'}</TableCell>
                          <TableCell>{inv.cantidad ?? 0}</TableCell>
                          <TableCell>{formatearQuetzales(inv.precio_unitario ?? 0)}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Ver movimientos">
                                <IconButton onClick={() => irAMovimientos(inv.id)} size="small">
                                  <SvgIcon>
                                    <VisibilityIcon />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                            </Stack>
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

      <ModalMovimientos open={modalOpen} onClose={() => setModalOpen(false)} movimientos={movimientos} producto={productoSeleccionado} />
    </Box>
  );
};
