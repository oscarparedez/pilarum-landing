import { FC, useState, useCallback, useMemo } from 'react';
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
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import PersonIcon from '@mui/icons-material/PersonOutline';
import NotesIcon from '@mui/icons-material/NotesOutlined';

import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarAmpliacionFecha } from './editar-ampliacion-fecha-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/pages/oficina/roles/permissions';

interface Ampliacion {
  id: number;
  fecha: string;
  motivo: string;
  usuario: any;
}

interface ModalAmpliacionesFechaProps {
  open: boolean;
  onClose: () => void;
  ampliaciones: Ampliacion[];
  onAmpliacionActualizada: (id: number, data: { fecha: string; motivo: string }) => Promise<void>;
  onEliminarAmpliacion: (id: number) => Promise<void>;
}

export const ModalAmpliacionesFecha: FC<ModalAmpliacionesFechaProps> = ({
  open,
  onClose,
  ampliaciones,
  onAmpliacionActualizada,
  onEliminarAmpliacion,
}) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [eliminando, setEliminando] = useState<Ampliacion | null>(null);

  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const ampliacionesFiltradas = useMemo(() => {
    return aplicarFiltros(ampliaciones, filtros, {
      camposTexto: ['usuario.first_name', 'usuario.last_name', 'motivo'],
      campoFecha: 'fecha',
    });
  }, [ampliaciones, filtros]);

  const canEditAmpliacionesFecha = useHasPermission(PermissionId.EDITAR_AMPLIACION_FECHA_FIN);
  const canEliminarAmpliacionesFecha = useHasPermission(PermissionId.ELIMINAR_AMPLIACION_FECHA_FIN);

  const nombreUsuario = (usuario: any) =>
    usuario ? `${usuario.first_name} ${usuario.last_name}` : 'Desconocido';

  const handleAmpliacionActualizada = async (data: {
    ampliacionId: number;
    fecha: string;
    motivo: string;
  }) => {
    await onAmpliacionActualizada(data.ampliacionId, {
      fecha: data.fecha,
      motivo: data.motivo,
    });
    setEditModalOpen(false);
    setEditandoIndex(null);
  };

  const handleAmpliacionEliminada = async () => {
    if (!eliminando) return;
    await onEliminarAmpliacion(eliminando.id);
    setEliminando(null);
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
            p: 2,
          }}
        >
          <Card>
            <CardHeader title="Historial de ampliaciones de fecha" />
            <Divider />
            <TablaPaginadaConFiltros
              totalItems={ampliacionesFiltradas.length}
              onFiltrar={handleFiltrar}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {ampliacionesFiltradas
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, index) => {
                        const fechaFormatted = formatearFecha(item.fecha);
                        const globalIndex = index + (currentPage - 1) * 5;

                        return (
                          <TableRow key={item.id}>
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
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <PersonIcon
                                  fontSize="small"
                                  color="action"
                                />
                                <Typography variant="subtitle2">
                                  Usuario creador: {nombreUsuario(item.usuario)}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <NotesIcon
                                  fontSize="small"
                                  color="action"
                                />
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  Motivo: {item.motivo}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="right">
                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                              >
                                {canEditAmpliacionesFecha && (
                                  <IconButton
                                    onClick={() => {
                                      setEditandoIndex(globalIndex);
                                      setEditModalOpen(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                )}
                                {canEliminarAmpliacionesFecha && (
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
        <ModalEditarAmpliacionFecha
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={ampliaciones[editandoIndex]}
          onConfirm={handleAmpliacionActualizada}
        />
      )}

      {eliminando && (
        <ModalEliminar
          type="ampliación de fecha"
          open={true}
          onClose={() => setEliminando(null)}
          onConfirm={handleAmpliacionEliminada}
        />
      )}
    </>
  );
};
