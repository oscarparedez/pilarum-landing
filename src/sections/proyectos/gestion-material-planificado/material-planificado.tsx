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
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';
import SendIcon from '@mui/icons-material/SendRounded';
import { useRouter } from 'next/router';

import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Inventario, InventarioConfig } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import { formatearQuetzales } from 'src/utils/format-currency';
import { paths } from 'src/paths';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

interface MaterialPlanificadoProps {
  materialPlanificado: InventarioConfig;
}

export const MaterialPlanificado: FC<MaterialPlanificadoProps> = ({ materialPlanificado }) => {
  const router = useRouter();
  const proyectoIdParam = router.query.id;
  const proyectoId = typeof proyectoIdParam === 'string' ? Number(proyectoIdParam) : NaN;

  const [loading, ] = useState(false);
  const [inventarioProyecto, setInventarioProyecto] = useState<Inventario[]>([]);

  const canViewHistorialMovimientos = useHasPermission(PermissionId.VER_MOV_MATERIALES_PROYECTO);
  const canTrasladarABodegaCentral = useHasPermission(PermissionId.TRASLADAR_A_BODEGA_CENTRAL);

  const itemsConStock = useMemo(
    () => inventarioProyecto.filter((inv) => (inv.cantidad ?? 0) > 0),
    [inventarioProyecto]
  );

  const hayMaterial = itemsConStock.length > 0;

  // 🔹 Total valor de materiales asignados al proyecto (stock actual del proyecto)
  const totalValorMateriales = useMemo(
    () =>
      itemsConStock.reduce((acc, inv) => {
        const qty = Number(inv.cantidad ?? 0);
        const pu = Number(inv.precio_unitario ?? 0);
        return acc + qty * pu;
      }, 0),
    [itemsConStock]
  );

  const irATrasladar = useCallback(() => {
    router.push(paths.dashboard.proyectos.trasladar(proyectoId));
  }, [router, proyectoId]);

  const irATrasladarDesdeBodega = useCallback(() => {
    router.push(paths.dashboard.oficina.trasladar);
  }, [router]);

  const irAMovimientos = useCallback(
    (id: number) => {
      router.push(paths.dashboard.proyectos.movimientos(proyectoId, id));
    },
    [router, proyectoId]
  );

  useEffect(() => {
    const { inventarios } = materialPlanificado;
    setInventarioProyecto(inventarios ?? []);
  }, [materialPlanificado, setInventarioProyecto]);

  const EmptyState = useMemo(
    () => (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        py={6}
        px={2}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
        >
          No hay material con stock en este proyecto
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: 'center' }}
        >
          Cuando haya existencias, aparecerán aquí.
        </Typography>
        <Tooltip title="Ir a la pantalla para trasladar/devolver materiales">
          <span>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<SendIcon />}
              onClick={irATrasladarDesdeBodega}
            >
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
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ px: 3, pt: 3, gap: 2 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">Material planificado</Typography>
            {hayMaterial && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Valor total de materiales asignados:&nbsp;
                <strong>{formatearQuetzales(totalValorMateriales)}</strong>
              </Typography>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
          >
            {hayMaterial && canTrasladarABodegaCentral && (
              <Tooltip title="Ir a la pantalla para trasladar/devolver materiales">
                <span>
                  <Button
                    onClick={irATrasladar}
                    variant="contained"
                    color="secondary"
                    endIcon={<SendIcon />}
                  >
                    Trasladar a bodega
                  </Button>
                </span>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mt: 2, mb: 0 }} />

        {!hayMaterial ? (
          EmptyState
        ) : (
          <>
            <TablaPaginadaConFiltros
              totalItems={itemsConStock.length}
              onFiltrar={() => {}}
              filtrosFecha={false}
              filtrosEstado={false}
            >
              {(currentPage, orden) => {
                const pageSize = 5;
                const sorted = itemsConStock.slice().sort((a, b) => {
                  const na = a.material.nombre ?? '';
                  const nb = b.material.nombre ?? '';
                  return orden === 'asc' ? na.localeCompare(nb) : nb.localeCompare(na);
                });
                const pageItems = sorted.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                );

                return (
                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: 0 }}
                  >
                    <Table
                      size="small"
                      stickyHeader
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Material</TableCell>
                          <TableCell>Unidad</TableCell>
                          <TableCell>Stock</TableCell>
                          <TableCell>Precio unitario</TableCell>
                          {canViewHistorialMovimientos && <TableCell>Acciones</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pageItems.map((inv) => {
                          const showActions = canViewHistorialMovimientos;
                          return (
                            <TableRow
                              hover
                              key={inv.id}
                              sx={{
                                transition: '0.2s',
                                '&:hover': { backgroundColor: 'action.hover' },
                              }}
                            >
                              <TableCell>
                                <Typography variant="subtitle2">
                                  {inv.material.nombre ?? '—'}
                                </Typography>
                              </TableCell>
                              <TableCell>{inv.material.unidad?.nombre ?? '—'}</TableCell>
                              <TableCell>{inv.cantidad ?? 0}</TableCell>
                              <TableCell>
                                {formatearQuetzales(Number(inv.precio_unitario))}
                              </TableCell>
                              {showActions && (
                                <TableCell>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                  >
                                    <Tooltip title="Ver movimientos">
                                      <IconButton
                                        onClick={() => irAMovimientos(inv.id)}
                                        size="small"
                                      >
                                        <SvgIcon>
                                          <VisibilityIcon />
                                        </SvgIcon>
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              }}
            </TablaPaginadaConFiltros>

            {/* Resumen debajo de la tabla */}
            <Box
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: 'background.default',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Valor total de materiales asignados:&nbsp;
                <strong>{formatearQuetzales(totalValorMateriales)}</strong>
              </Typography>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
};
