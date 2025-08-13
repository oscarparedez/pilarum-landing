import { FC, useState } from 'react';
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
import { PermissionId } from 'src/pages/oficina/roles/permissions';

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
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // <600px
  const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600-900px

  const canChangeStatusTareaProyecto = useHasPermission(PermissionId.CAMBIAR_STATUS_TAREA_PROYECTO);
  const canChangeStatusTareaGeneral = useHasPermission(PermissionId.CAMBIAR_STATUS_TAREA_GENERAL);
  const canDeleteTareaProyecto = useHasPermission(PermissionId.ELIMINAR_TAREA_PROYECTO);
  const canDeleteTareaGeneral = useHasPermission(PermissionId.ELIMINAR_TAREA_GENERAL);

  if (!estado) return null;

  const tituloEstado = {
    no_iniciado: 'Tareas no iniciadas',
    pendiente: 'Tareas activas',
    completado: 'Tareas completadas',
  }[estado];

  const chipColor = {
    no_iniciado: 'default',
    pendiente: 'warning',
    completado: 'success',
  } as const;

  // Ajustar columnas según tamaño de pantalla
  const getColumns = () => {
    if (isSmall) return 'repeat(2, 1fr)'; // Móviles
    if (isMedium) return 'repeat(3, 1fr)'; // Tablets
    return 'repeat(4, 1fr)'; // Escritorios
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
            maxWidth: 1200,
            p: 2,
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
              }}
            >
              {pendientes.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ gridColumn: '1 / -1', py: 4 }}
                >
                  No hay tareas en este estado.
                </Typography>
              ) : (
                pendientes.map((p) => (
                  <Box
                    key={p.id}
                    p={2}
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
                    }}
                  >
                    {/* Info */}
                    <Box mb={1}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                      >
                        {p.titulo}
                      </Typography>
                      <Chip
                        size="small"
                        label={p.estado}
                        color={chipColor[p.estado]}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>

                    {/* Descripción */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                    >
                      {p.descripcion || 'Sin descripción'}
                    </Typography>

                    {/* Footer */}
                    <Typography
                      fontWeight="bold"
                      variant="caption"
                      color="text.disabled"
                      mb={1}
                    >
                      {p.usuario_creador
                        ? `Creado por ${p.usuario_creador.first_name} ${p.usuario_creador.last_name}`
                        : '—'}{' '}
                      • {new Date(p.fecha_creacion).toLocaleString()}
                    </Typography>

                    {/* Acciones */}
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap={1}
                      mt="auto"
                    >
                      {/* Cambiar estado */}
                      {onChangeEstado && estado === 'no_iniciado' && (
                        <>
                          {((tipo === 'proyecto' && canChangeStatusTareaProyecto) ||
                            (tipo === 'oficina' && canChangeStatusTareaGeneral)) && (
                            <>
                              <Chip
                                label="Marcar activo"
                                color="warning"
                                size="small"
                                onClick={() => onChangeEstado(p.id, 'pendiente')}
                              />
                              <Chip
                                label="Completar"
                                color="success"
                                size="small"
                                onClick={() => onChangeEstado(p.id, 'completado')}
                              />
                            </>
                          )}
                        </>
                      )}

                      {onChangeEstado && estado === 'pendiente' && (
                        <>
                          {((tipo === 'proyecto' && canChangeStatusTareaProyecto) ||
                            (tipo === 'oficina' && canChangeStatusTareaGeneral)) && (
                            <>
                              <Chip
                                label="No iniciado"
                                variant="outlined"
                                size="small"
                                onClick={() => onChangeEstado(p.id, 'no_iniciado')}
                              />
                              <Chip
                                label="Completar"
                                color="success"
                                size="small"
                                onClick={() => onChangeEstado(p.id, 'completado')}
                              />
                            </>
                          )}
                        </>
                      )}

                      {onChangeEstado && estado === 'completado' && (
                        <>
                          {((tipo === 'proyecto' && canChangeStatusTareaProyecto) ||
                            (tipo === 'oficina' && canChangeStatusTareaGeneral)) && (
                            <Chip
                              label="Reactivar"
                              color="warning"
                              size="small"
                              onClick={() => onChangeEstado(p.id, 'pendiente')}
                            />
                          )}
                        </>
                      )}

                      {/* Eliminar */}
                      {onDeletePendiente &&
                        ((tipo === 'proyecto' && canDeleteTareaProyecto) ||
                          (tipo === 'oficina' && canDeleteTareaGeneral)) && (
                          <Chip
                            label="Eliminar"
                            color="error"
                            size="small"
                            onClick={() => setDeleteId(p.id)}
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
          onConfirm={() => {
            onDeletePendiente(deleteId);
            setDeleteId(null);
          }}
        />
      )}
    </>
  );
};
