import { FC, useState, useMemo, useCallback } from 'react';
import {
  Modal,
  Box,
  Card,
  CardHeader,
  Divider,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Pendiente } from 'src/api/types';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { useTheme } from '@mui/material/styles';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { formatearFecha } from 'src/utils/format-date';

interface Props {
  open: boolean;
  onClose: () => void;
  estado: 'no_iniciado' | 'pendiente' | 'completado' | null;
  pendientes: Pendiente[];
  onChangeEstado?: (id: number, nuevoEstado: 'no_iniciado' | 'pendiente' | 'completado') => void;
  onDeletePendiente?: (id: number) => void;
  tipo: 'oficina' | 'proyecto';
}

export const ModalPendientesPorEstado: FC<Props> = ({
  open,
  onClose,
  estado,
  pendientes,
  onChangeEstado,
  onDeletePendiente,
  tipo,
}) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Permisos
  const canChangeStatusTareaProyecto = useHasPermission(PermissionId.CAMBIAR_STATUS_TAREA_PROYECTO);
  const canChangeStatusTareaGeneral = useHasPermission(PermissionId.CAMBIAR_STATUS_TAREA_GENERAL);
  const canDeleteTareaProyecto = useHasPermission(PermissionId.ELIMINAR_TAREA_PROYECTO);
  const canDeleteTareaGeneral = useHasPermission(PermissionId.ELIMINAR_TAREA_GENERAL);

  const canChangeStatus = useMemo(
    () =>
      (tipo === 'proyecto' && canChangeStatusTareaProyecto) ||
      (tipo === 'oficina' && canChangeStatusTareaGeneral),
    [tipo, canChangeStatusTareaProyecto, canChangeStatusTareaGeneral]
  );

  const canDelete = useMemo(
    () =>
      (tipo === 'proyecto' && canDeleteTareaProyecto) ||
      (tipo === 'oficina' && canDeleteTareaGeneral),
    [tipo, canDeleteTareaProyecto, canDeleteTareaGeneral]
  );

  const tituloEstado = useMemo(
    () =>
      estado
        ? {
            no_iniciado: 'Tareas no iniciadas',
            pendiente: 'Tareas activas',
            completado: 'Tareas completadas',
          }[estado]
        : '',
    [estado]
  );

  const chipColor = useMemo(
    () =>
      ({
        no_iniciado: 'default',
        pendiente: 'warning',
        completado: 'success',
      }) as const,
    []
  );

  const getColumns = useCallback(() => {
    if (isSmall) return 'repeat(2, 1fr)';
    if (isMedium) return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  }, [isSmall, isMedium]);

  const handleChangeEstado = useCallback(
    (id: number, nuevoEstado: 'no_iniciado' | 'pendiente' | 'completado') => {
      if (onChangeEstado) onChangeEstado(id, nuevoEstado);
    },
    [onChangeEstado]
  );

  const handleDelete = useCallback((id: number) => setDeleteId(id), []);
  const handleConfirmDelete = useCallback(() => {
    if (deleteId !== null && onDeletePendiente) {
      onDeletePendiente(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, onDeletePendiente]);

  if (!estado) return null;

  console.log("candelete", canDeleteTareaGeneral, canDeleteTareaProyecto)

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
            width: '98%',
            maxWidth: 1300,
            p: 3,
          }}
        >
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              title={tituloEstado}
              action={
                <IconButton
                  onClick={onClose}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              }
              sx={{ pb: 1.5 }}
            />
            <Divider />

            <Box
              sx={{
                p: 3,
                maxHeight: '70vh',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: getColumns(),
                gap: 2,
                fontSize: '1.125rem',
              }}
            >
              {pendientes.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ gridColumn: '1 / -1', py: 4, fontSize: '1.125rem' }}
                >
                  No hay tareas en este estado.
                </Typography>
              ) : (
                pendientes.map((p) => (
                  <Box
                    key={p.id}
                    p={3}
                    borderRadius={2}
                    bgcolor="background.paper"
                    boxShadow="0 1px 4px rgba(0,0,0,0.06)"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    sx={{
                      transition:
                        'box-shadow 0.25s ease, transform 0.25s ease, background-color 0.25s ease',
                      '&:hover': {
                        boxShadow: '0 6px 18px rgba(0,0,0,0.10)',
                        transform: 'translateY(-2px)',
                        backgroundColor: (theme) => theme.palette.background.default,
                      },
                      fontSize: '1.125rem',
                    }}
                  >
                    {/* Info */}
                    <Box mb={1}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ fontSize: '1.25rem' }}
                      >
                        {p.titulo}
                      </Typography>
                      <Chip
                        size="small"
                        label={p.estado}
                        color={chipColor[p.estado]}
                        sx={{ mt: 0.5, fontSize: '1rem', height: 28 }}
                      />
                    </Box>

                    {/* Descripción */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                      sx={{ fontSize: '1.125rem' }}
                    >
                      {p.descripcion || 'Sin descripción'}
                    </Typography>

                    {/* Footer */}
                    <Typography
                      fontWeight="bold"
                      variant="caption"
                      color="text.disabled"
                      mb={1}
                      sx={{ fontSize: '1rem' }}
                    >
                      {p.usuario_creador
                        ? `Creado por ${p.usuario_creador.first_name} ${p.usuario_creador.last_name}`
                        : '—'}{' '}
                      • {formatearFecha(p.fecha_creacion)}
                    </Typography>

                    {/* Acciones */}
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap={1}
                      mt="auto"
                    >
                      {/* Cambiar estado */}
                      {onChangeEstado && canChangeStatus && (
                        <>
                          {estado === 'no_iniciado' && (
                            <>
                              <Chip
                                label="Marcar activo"
                                color="warning"
                                size="small"
                                onClick={() => handleChangeEstado(p.id, 'pendiente')}
                                sx={{ fontSize: '1rem', height: 28 }}
                              />
                              <Chip
                                label="Completar"
                                color="success"
                                size="small"
                                onClick={() => handleChangeEstado(p.id, 'completado')}
                                sx={{ fontSize: '1rem', height: 28 }}
                              />
                            </>
                          )}
                          {estado === 'pendiente' && (
                            <>
                              <Chip
                                label="No iniciado"
                                variant="outlined"
                                size="small"
                                onClick={() => handleChangeEstado(p.id, 'no_iniciado')}
                                sx={{ fontSize: '1rem', height: 28 }}
                              />
                              <Chip
                                label="Completar"
                                color="success"
                                size="small"
                                onClick={() => handleChangeEstado(p.id, 'completado')}
                                sx={{ fontSize: '1rem', height: 28 }}
                              />
                            </>
                          )}
                          {estado === 'completado' && (
                            <Chip
                              label="Reactivar"
                              color="warning"
                              size="small"
                              onClick={() => handleChangeEstado(p.id, 'pendiente')}
                              sx={{ fontSize: '1rem', height: 28 }}
                            />
                          )}
                        </>
                      )}

                      {/* Eliminar */}
                      {onDeletePendiente && canDelete && (
                        <Chip
                          label="Eliminar"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(p.id)}
                          sx={{ fontSize: '1rem', height: 28 }}
                        />
                      )}
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        </Box>
      </Modal>

      {/* Confirmación eliminar */}
      {deleteId !== null && onDeletePendiente && (
        <ModalEliminar
          type="pendiente"
          open={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};
