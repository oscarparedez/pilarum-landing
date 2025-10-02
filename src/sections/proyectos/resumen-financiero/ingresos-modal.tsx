import { FC, useState, useMemo, useCallback } from 'react';
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

import { ModalEditarIngreso } from './editar-ingreso-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { Ingreso } from 'src/api/types';

interface ModalListaIngresosProps {
  open: boolean;
  onClose: () => void;
  ingresos: Ingreso[];
  tiposIngreso: { id: number; nombre: string }[];
  onActualizarIngreso: (
    id: number,
    data: {
      monto_total: number;
      tipo_ingreso: number;
      tipo_documento: string;
      fecha_ingreso: string;
      anotaciones?: string;
      correlativo?: string;
    }
  ) => Promise<void>;
  onEliminarIngreso: (ingreso_id: number) => Promise<void>;
}

const formatTipoDocumento = (tipo: string) => {
  if (!tipo) return '';
  return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
};

export const ModalListaIngresos: FC<ModalListaIngresosProps> = ({
  open,
  onClose,
  ingresos,
  tiposIngreso,
  onActualizarIngreso,
  onEliminarIngreso,
}) => {
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const [ingresoEditando, setIngresoEditando] = useState<Ingreso | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [ingresoAEliminar, setIngresoAEliminar] = useState<Ingreso | null>(null);

  const canEditIngreso = useHasPermission(PermissionId.EDITAR_INGRESOS_COSTOS_PROYECTO);
  const canDeleteIngreso = useHasPermission(PermissionId.ELIMINAR_INGRESOS_COSTOS_PROYECTO);

  const ingresosFiltrados = useMemo(() => {
    return aplicarFiltros(ingresos, filtros, {
      camposTexto: [
        'usuario_registro.first_name',
        'usuario_registro.last_name',
        'tipo_ingreso.nombre',
        'tipo_documento',
        'anotaciones',
      ],
      campoFecha: 'fecha_ingreso',
    });
  }, [ingresos, filtros]);

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const handleActualizarIngreso = useCallback(
    async (
      id: number,
      data: {
        monto_total: number;
        tipo_ingreso: number;
        tipo_documento: string;
        fecha_ingreso: string;
        anotaciones?: string;
        correlativo?: string;
      }
    ) => {
      await onActualizarIngreso(id, data);
      setModalEditarAbierto(false);
      setIngresoEditando(null);
    },
    [onActualizarIngreso]
  );

  const handleEliminarIngreso = useCallback(() => {
    if (ingresoAEliminar) {
      onEliminarIngreso(ingresoAEliminar.id_ingreso);
      setIngresoAEliminar(null);
    }
  }, [ingresoAEliminar, onEliminarIngreso]);

  const handleCloseEditarIngreso = useCallback(() => {
    setIngresoEditando(null);
    setModalEditarAbierto(false);
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
        aria-labelledby="modal-lista-ingresos"
      >
        <DialogContent sx={{ p: 0 }}>
          <Card>
            <CardHeader title="Historial de ingresos" />
            <Divider />

            <TablaPaginadaConFiltros
              totalItems={ingresosFiltrados.length}
              onFiltrar={handleFiltrar}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {ingresosFiltrados
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((ingreso) => (
                        <TableRow key={ingreso.id_ingreso}>
                          <TableCell width={100}>
                            <Typography
                              align="center"
                              color="text.secondary"
                              variant="subtitle2"
                            >
                              {formatearFecha(ingreso.fecha_ingreso)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Stack spacing={0.5}>
                              {/* Usuario creador */}
                              <Typography variant="subtitle2">
                                👤 <b>Usuario creador:</b> {ingreso.usuario_registro.first_name}{' '}
                                {ingreso.usuario_registro.last_name}
                              </Typography>

                              {/* Tipo de ingreso */}
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                💰 <b>Tipo de ingreso:</b> {ingreso.tipo_ingreso.nombre}
                              </Typography>

                              {/* Tipo de documento + correlativo */}
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                📄 <b>Tipo de documento:</b>{' '}
                                {formatTipoDocumento(ingreso.tipo_documento)}{' '}
                                {ingreso.correlativo ? `(${ingreso.correlativo})` : ''}
                              </Typography>

                              {/* Anotaciones */}
                              {ingreso.anotaciones && (
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  📝 <b>Anotaciones:</b> {ingreso.anotaciones}
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>

                          <TableCell align="right">
                            <Typography
                              color="success.main"
                              variant="subtitle2"
                            >
                              {formatearQuetzales(ingreso.monto_total)}
                            </Typography>

                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                            >
                              {canEditIngreso && (
                                <IconButton
                                  color="success"
                                  onClick={() => {
                                    setIngresoEditando(ingreso);
                                    setModalEditarAbierto(true);
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              )}

                              {canDeleteIngreso && (
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    setIngresoAEliminar(ingreso);
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

      {ingresoEditando && (
        <ModalEditarIngreso
          open={modalEditarAbierto}
          onClose={handleCloseEditarIngreso}
          initialData={ingresoEditando}
          tiposIngreso={tiposIngreso}
          onConfirm={handleActualizarIngreso}
        />
      )}

      <ModalEliminar
        type="ingreso"
        open={!!ingresoAEliminar}
        onClose={() => setIngresoAEliminar(null)}
        onConfirm={handleEliminarIngreso}
      />
    </>
  );
};
