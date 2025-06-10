import { FC, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Tarea } from '../index.d';
import { formatearFecha } from 'src/utils/format-date';

interface ModalTareasProps {
  open: boolean;
  onClose: () => void;
  tareas: Tarea[];
  estado: Tarea['estado'];
  onActualizarEstado: (id: string, nuevoEstado: Tarea['estado']) => void;
}

export const ModalTareas: FC<ModalTareasProps> = ({
  open,
  onClose,
  tareas,
  estado,
  onActualizarEstado,
}) => {
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio: Date | null;
    fechaFin: Date | null;
  }>({
    search: '',
    fechaInicio: null,
    fechaFin: null,
  });

  const tareasFiltradas = tareas.filter((t) => {
    const matchSearch = filtros.search
      ? t.descripcion.toLowerCase().includes(filtros.search.toLowerCase())
      : true;
    const fecha = new Date(t.fechaCreacion);
    const matchInicio = filtros.fechaInicio ? fecha >= filtros.fechaInicio : true;
    const matchFin = filtros.fechaFin ? fecha <= filtros.fechaFin : true;
    return matchSearch && matchInicio && matchFin;
  });

  const titulo =
    estado === 'pendiente'
      ? 'Tareas pendientes'
      : estado === 'activa'
      ? 'Tareas activas'
      : 'Tareas completadas';

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <>
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
            <CardHeader title={titulo} />
            <Divider />
            <TablaPaginadaConFiltros
              onFiltrar={(f) => setFiltros(f)}
              totalItems={tareasFiltradas.length}
              filtrosSearch
              filtrosFecha
            >
              {(currentPage) => {
                const start = (currentPage - 1) * 5;
                const current = tareasFiltradas.slice(start, start + 5);
                return (
                  <Table>
                    <TableBody>
                      {current.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell width={120}>
                            <Box sx={{ p: 1 }}>
                              <Typography
                                align="center"
                                color="text.secondary"
                                variant="subtitle2"
                              >
                                {formatearFecha(t.fechaCreacion)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Asignado a: {t.asignadoA.nombre}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              {t.descripcion}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {estado === 'pendiente' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="info"
                                onClick={() => onActualizarEstado(t.id, 'activa')}
                              >
                                Activar tarea
                              </Button>
                            )}

                            {estado === 'activa' && (
                              <Stack
                                spacing={1}
                                alignItems="flex-end"
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="warning"
                                  onClick={() => onActualizarEstado(t.id, 'pendiente')}
                                >
                                  Mover a pendientes
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => onActualizarEstado(t.id, 'completada')}
                                >
                                  Completar
                                </Button>
                              </Stack>
                            )}

                            {estado === 'completada' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="info"
                                onClick={() => onActualizarEstado(t.id, 'activa')}
                              >
                                Reabrir tarea
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              }}
            </TablaPaginadaConFiltros>
          </Card>
        </Box>
      </>
    </Modal>
  );
};
