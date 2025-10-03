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
  Tooltip,
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
                gap: 3,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(0,0,0,0.3)',
                },
              }}
            >
              {pendientes.length === 0 ? (
                <Box
                  sx={{
                    gridColumn: '1 / -1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 6,
                    color: 'text.secondary',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      fontSize: '2rem',
                    }}
                  >
                    📋
                  </Box>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 1 }}
                  >
                    No hay tareas en este estado
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    align="center"
                  >
                    Las tareas aparecerán aquí cuando cambien a este estado
                  </Typography>
                </Box>
              ) : (
                pendientes.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      borderRadius: 3,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {/* Header with status indicator */}
                    <Box
                      sx={{
                        p: 2.5,
                        pb: 2,
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        mb={1.5}
                      >
                        <Tooltip
                          title={p.titulo.length > 50 ? p.titulo : ''}
                          arrow
                          placement="top"
                        >
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                              fontSize: '1.1rem',
                              lineHeight: 1.3,
                              color: 'text.primary',
                              flex: 1,
                              pr: 1,
                              cursor: p.titulo.length > 50 ? 'help' : 'default',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {p.titulo}
                          </Typography>
                        </Tooltip>
                        <Chip
                          size="small"
                          label={
                            p.estado === 'no_iniciado'
                              ? 'No iniciado'
                              : p.estado === 'pendiente'
                              ? 'En progreso'
                              : 'Completado'
                          }
                          color={chipColor[p.estado]}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>

                      {/* Descripción */}
                      <Tooltip
                        title={p.descripcion && p.descripcion.length > 80 ? p.descripcion : ''}
                        arrow
                        placement="bottom"
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            cursor: p.descripcion && p.descripcion.length > 80 ? 'help' : 'default',
                          }}
                        >
                          {p.descripcion || 'Sin descripción'}
                        </Typography>
                      </Tooltip>
                    </Box>

                    {/* Body with assignment and creator info */}
                    <Box sx={{ p: 2.5, pt: 2 }}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        mb={2.5}
                      >
                        {/* Assigned user */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: p.usuario_asignado ? 'success.main' : 'grey.400',
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.85rem' }}
                          >
                            <strong>Asignado:</strong>{' '}
                            {p.usuario_asignado
                              ? `${p.usuario_asignado.first_name} ${p.usuario_asignado.last_name}`
                              : 'Sin asignar'}
                          </Typography>
                        </Box>

                        {/* Creator and date */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.85rem' }}
                          >
                            <strong>Creado por:</strong>{' '}
                            {p.usuario_creador
                              ? `${p.usuario_creador.first_name} ${p.usuario_creador.last_name}`
                              : '—'}{' '}
                            • {formatearFecha(p.fecha_creacion)}
                          </Typography>
                        </Box>
                      </Box>

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
                                  label="▶ Iniciar"
                                  color="warning"
                                  size="medium"
                                  onClick={() => handleChangeEstado(p.id, 'pendiente')}
                                  sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    height: 36,
                                    '&:hover': { transform: 'scale(1.05)' },
                                  }}
                                />
                                <Chip
                                  label="✓ Completar"
                                  color="success"
                                  size="medium"
                                  onClick={() => handleChangeEstado(p.id, 'completado')}
                                  sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    height: 36,
                                    '&:hover': { transform: 'scale(1.05)' },
                                  }}
                                />
                              </>
                            )}
                            {estado === 'pendiente' && (
                              <>
                                <Chip
                                  label="⏸ Reiniciar"
                                  variant="outlined"
                                  size="medium"
                                  onClick={() => handleChangeEstado(p.id, 'no_iniciado')}
                                  sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    height: 36,
                                    '&:hover': { transform: 'scale(1.05)' },
                                  }}
                                />
                                <Chip
                                  label="✓ Completar"
                                  color="success"
                                  size="medium"
                                  onClick={() => handleChangeEstado(p.id, 'completado')}
                                  sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    height: 36,
                                    '&:hover': { transform: 'scale(1.05)' },
                                  }}
                                />
                              </>
                            )}
                            {estado === 'completado' && (
                              <Chip
                                label="↻ Reactivar"
                                color="warning"
                                size="medium"
                                onClick={() => handleChangeEstado(p.id, 'pendiente')}
                                sx={{
                                  fontSize: '0.9rem',
                                  fontWeight: 600,
                                  height: 36,
                                  '&:hover': { transform: 'scale(1.05)' },
                                }}
                              />
                            )}
                          </>
                        )}

                        {/* Eliminar */}
                        {onDeletePendiente && canDelete && (
                          <Chip
                            label="🗑 Eliminar"
                            color="error"
                            size="medium"
                            onClick={() => handleDelete(p.id)}
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              height: 36,
                              '&:hover': { transform: 'scale(1.05)' },
                            }}
                          />
                        )}
                      </Box>
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
