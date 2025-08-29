import { FC, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import PersonIcon from '@mui/icons-material/PersonOutline';
import NotesIcon from '@mui/icons-material/NotesOutlined';

import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarAmpliacionPresupuesto } from './editar-ampliacion-presupuesto-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { formatearFecha } from 'src/utils/format-date';
import { formatearQuetzales } from 'src/utils/format-currency';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { AmpliacionPresupuesto } from 'src/api/types';

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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  // ---- Filtros (igual que en Revisiones) ----
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
      // Si quisieras filtrar también por monto vía texto, podrías agregar un campo derivado.
    });
  }, [ampliaciones, filtros]);
  // -------------------------------------------

  return (
    <>
            <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
        keepMounted
      >
        <DialogTitle>Historial de ampliaciones de presupuesto</DialogTitle>
        <DialogContent
          dividers
          sx={{
            maxHeight: { xs: '90dvh', sm: '80vh' },
            overflow: 'auto',
          }}
        >
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
                          <TableRow key={item.id ?? index}>
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
                                sx={{ mb: 0.5 }}
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
                                  Motivo: {item.motivo || 'Sin motivo'}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="right">
                              <Typography
                                variant="subtitle2"
                                color="success.main"
                                sx={{ mb: 0.5 }}
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
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

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
