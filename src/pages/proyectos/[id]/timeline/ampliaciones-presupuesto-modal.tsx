import { FC, useState } from 'react';
import {
  Box,
  Modal,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';

import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarAmpliacionPresupuesto } from './editar-ampliacion-presupuesto-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { formatearFecha } from 'src/utils/format-date';
import { formatearQuetzales } from 'src/utils/format-currency';
import { AmpliacionPresupuesto } from '../index.d';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/pages/oficina/roles/permissions';

interface ModalAmpliacionesPresupuestoProps {
  open: boolean;
  onClose: () => void;
  ampliaciones: AmpliacionPresupuesto[];
  onEditarAmpliacion: (id: number, data: { monto: number; motivo?: string }) => void;
  onEliminarAmpliacion: (id: number) => void;
}

export const ModalAmpliacionesPresupuesto: FC<ModalAmpliacionesPresupuestoProps> = ({
  open,
  onClose,
  ampliaciones,
  onEditarAmpliacion,
  onEliminarAmpliacion,
}) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [eliminando, setEliminando] = useState<AmpliacionPresupuesto | null>(null);

  const canEditAmpliacionesFechaFin = useHasPermission(
    PermissionId.EDITAR_AMPLIACIONES_PRESUPUESTO
  );
  const canDeleteAmpliacionesFechaFin = useHasPermission(
    PermissionId.ELIMINAR_AMPLIACIONES_PRESUPUESTO
  );

  const nombreUsuario = (usuario: any) => {
    if (!usuario) return 'Desconocido';
    if (typeof usuario === 'string') return usuario;
    return `${usuario.first_name ?? ''} ${usuario.last_name ?? ''}`.trim() || 'Desconocido';
  };

  const handleAmpliacionActualizada = (data: { monto: number; motivo?: string }) => {
    if (editandoIndex !== null) {
      const id = ampliaciones[editandoIndex].id;
      onEditarAmpliacion(id, data);
      setEditModalOpen(false);
    }
  };

  const handleAmpliacionEliminada = () => {
    if (eliminando) {
      onEliminarAmpliacion(eliminando.id);
      setEliminando(null);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: 900,
            p: 3,
          }}
        >
          <Card>
            <CardHeader title="Historial de ampliaciones de presupuesto" />
            <Divider />

            <TablaPaginadaConFiltros
              onFiltrar={() => {}}
              totalItems={ampliaciones.length}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {ampliaciones
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, index) => {
                        const fechaFormatted = formatearFecha(item.fecha);
                        const globalIndex = index + (currentPage - 1) * 5;

                        return (
                          <TableRow key={index}>
                            <TableCell width={120}>
                              <Box sx={{ p: 1 }}>
                                <Typography
                                  align="center"
                                  color="text.secondary"
                                  variant="subtitle2"
                                >
                                  {fechaFormatted}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {nombreUsuario(item.usuario)}
                              </Typography>
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {item.motivo || 'Sin motivo'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="subtitle2"
                                color="success.main"
                              >
                                +{formatearQuetzales(Number(item.monto))}
                              </Typography>

                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                              >
                                {canEditAmpliacionesFechaFin && (
                                  <IconButton
                                    onClick={() => {
                                      setEditandoIndex(globalIndex);
                                      setEditModalOpen(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                )}
                                {canDeleteAmpliacionesFechaFin && (
                                  <IconButton onClick={() => setEliminando(item)}>
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </TablaPaginadaConFiltros>
          </Card>
        </Box>
      </Modal>

      {editandoIndex !== null && ampliaciones[editandoIndex] && (
        <ModalEditarAmpliacionPresupuesto
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={ampliaciones[editandoIndex]}
          onConfirm={handleAmpliacionActualizada}
        />
      )}

      <ModalEliminar
        type="ampliación de presupuesto"
        open={!!eliminando}
        onClose={() => setEliminando(null)}
        onConfirm={handleAmpliacionEliminada}
      />
    </>
  );
};
