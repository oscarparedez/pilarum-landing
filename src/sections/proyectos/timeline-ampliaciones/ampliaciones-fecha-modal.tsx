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
import EditIcon from '@untitled-ui/icons-react/build/esm/Pencil01';
import TrashIcon from '@untitled-ui/icons-react/build/esm/Trash01';
import PersonIcon from '@mui/icons-material/PersonOutline';
import NotesIcon from '@mui/icons-material/NotesOutlined';

import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarAmpliacionFecha } from './editar-ampliacion-fecha-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

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

export const AmpliacionesFechaModal: FC<ModalAmpliacionesFechaProps> = ({
  open = false,
  onClose,
  ampliaciones = [],
  onAmpliacionActualizada,
  onEliminarAmpliacion,
  ...other
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [filtros, setFiltros] = useState({ search: '' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState<Ampliacion | null>(null);

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
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
        keepMounted
        {...other}
      >
        <DialogTitle>Historial de ampliaciones de fecha</DialogTitle>
        <DialogContent
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
                                  color="success"
                                  onClick={() => {
                                    setEditandoIndex(globalIndex);
                                    setEditModalOpen(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                              {canEliminarAmpliacionesFecha && (
                                <IconButton
                                  color="error"
                                  onClick={() => setEliminando(item)}
                                >
                                  <TrashIcon />
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

      {editandoIndex !== null &&
        editandoIndex < ampliaciones.length &&
        ampliaciones[editandoIndex] && (
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
