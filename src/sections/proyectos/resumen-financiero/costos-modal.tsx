import { FC, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  IconButton,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TrashIcon from '@untitled-ui/icons-react/build/esm/Trash01';
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';

import { ModalEditarCosto } from './editar-costo-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { Costo } from 'src/api/types';

interface ModalListaCostosProps {
  open: boolean;
  onClose: () => void;
  costos: Costo[];
  tiposPago: { id: number; nombre: string }[];
  onActualizarCosto: (
    id: number,
    data: {
      fecha_pago: string;
      tipo_pago: number;
      tipo_documento: string;
      anotaciones?: string;
      correlativo?: string;
      monto_total: number;
      usuario_registro: string;
    }
  ) => Promise<void>;
  onEliminarCosto: (id_pago: number) => Promise<void>;
}

const formatTipoDocumento = (tipo: string) => {
  if (!tipo) return '';
  return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
};

export const ModalListaCostos: FC<ModalListaCostosProps> = ({
  open,
  onClose,
  costos,
  tiposPago,
  onActualizarCosto,
  onEliminarCosto,
}) => {
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const [costoEditando, setCostoEditando] = useState<Costo | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [costoAEliminar, setCostoAEliminar] = useState<Costo | null>(null);

  const canEditCosto = useHasPermission(PermissionId.EDITAR_INGRESOS_COSTOS_PROYECTO);
  const canDeleteCosto = useHasPermission(PermissionId.ELIMINAR_INGRESOS_COSTOS_PROYECTO);

  const costosFiltrados = useMemo(() => {
    return aplicarFiltros(costos, filtros, {
      camposTexto: [
        'usuario_registro.first_name',
        'usuario_registro.last_name',
        'tipo_pago.nombre',
        'tipo_documento',
        'anotaciones',
      ],
      campoFecha: 'fecha_pago',
    });
  }, [costos, filtros]);

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const handleActualizarCosto = useCallback(
    async (
      id: number,
      data: {
        fecha_pago: string;
        tipo_pago: number;
        tipo_documento: string;
        anotaciones?: string;
        correlativo?: string;
        monto_total: number;
        usuario_registro: string;
      }
    ) => {
      if (costoEditando) {
        await onActualizarCosto(id, data);
        setCostoEditando(null);
        setModalEditarAbierto(false);
      }
    },
    [costoEditando, onActualizarCosto]
  );

  const handleEliminarCosto = useCallback(() => {
    if (costoAEliminar?.id_pago) {
      onEliminarCosto(costoAEliminar.id_pago);
      setCostoAEliminar(null);
    }
  }, [costoAEliminar, onEliminarCosto]);

  const handleCloseEditar = useCallback(() => {
    setModalEditarAbierto(false);
  }, []);

  const handleCloseEliminar = useCallback(() => {
    setCostoAEliminar(null);
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={isMobile}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Card>
            <CardHeader title="Historial de costos" />
            <Divider />

            <TablaPaginadaConFiltros
              totalItems={costosFiltrados.length}
              onFiltrar={handleFiltrar}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {costosFiltrados.slice((currentPage - 1) * 5, currentPage * 5).map((costo) => (
                      <TableRow key={costo.id_pago}>
                        <TableCell width={100}>
                          <Typography
                            align="center"
                            color="text.secondary"
                            variant="subtitle2"
                          >
                            {formatearFecha(costo.fecha_pago)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.5}>
                            {/* Usuario creador */}
                            <Typography variant="subtitle2">
                              👤 <b>Usuario creador:</b> {costo.usuario_registro.first_name}{' '}
                              {costo.usuario_registro.last_name}
                            </Typography>

                            {/* Tipo de pago */}
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              💳 <b>Tipo de pago:</b> {costo.tipo_pago.nombre}
                            </Typography>

                            {/* Tipo de documento + correlativo */}
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              📄 <b>Tipo de documento:</b>{' '}
                              {formatTipoDocumento(costo.tipo_documento)}{' '}
                              {costo.correlativo ? `(${costo.correlativo})` : ''}
                            </Typography>

                            {/* Anotaciones */}
                            {costo.anotaciones && (
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                📝 <b>Anotaciones:</b> {costo.anotaciones}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <Typography
                            color="success.main"
                            variant="subtitle2"
                          >
                            {formatearQuetzales(Number(costo.monto_total))}
                          </Typography>

                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                          >
                            {canEditCosto && (
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setCostoEditando(costo);
                                  setModalEditarAbierto(true);
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            )}

                            {canDeleteCosto && (
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setCostoAEliminar(costo);
                                }}
                              >
                                <TrashIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TablaPaginadaConFiltros>
          </Card>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {costoEditando && (
        <ModalEditarCosto
          open={modalEditarAbierto}
          onClose={handleCloseEditar}
          initialData={costoEditando}
          tiposPago={tiposPago}
          onConfirm={handleActualizarCosto}
        />
      )}

      <ModalEliminar
        type="costo"
        open={!!costoAEliminar}
        onClose={handleCloseEliminar}
        onConfirm={handleEliminarCosto}
      />
    </>
  );
};
