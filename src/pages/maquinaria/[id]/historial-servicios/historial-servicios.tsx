import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import { FC, useCallback, useMemo, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import { ModalRegistrarServicio } from './registrar-servicio-modal';
import { ServicioImagenesModal } from './servicio-imagenes-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarServicio } from './editar-servicio-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { ActualizarGastoOperativo, GastoOperativo, NuevoGastoOperativo } from 'src/api/types';
import { formatearFechaHora } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/pages/oficina/roles/permissions';

interface HistorialServiciosProps {
  servicios: GastoOperativo[];
  onCrearServicio: (data: NuevoGastoOperativo) => void;
  onActualizarServicio: (id: number, data: ActualizarGastoOperativo) => void;
  onEliminarServicio: (id: number) => void;
}

export const HistorialServicios: FC<HistorialServiciosProps> = ({
  servicios,
  onCrearServicio,
  onActualizarServicio,
  onEliminarServicio,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarServicio, setEditarServicio] = useState<GastoOperativo | null>(null);
  const [servicioAEliminar, setServicioAEliminar] = useState<GastoOperativo | null>(null);
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const canRegistrarServicios = useHasPermission(PermissionId.REGISTRAR_SERVICIO);
  const canEditarServicios = useHasPermission(PermissionId.EDITAR_SERVICIO);
  const canEliminarServicios = useHasPermission(PermissionId.ELIMINAR_SERVICIO);

  const serviciosFiltrados = useMemo(() => {
    return aplicarFiltros(servicios, filtros, {
      camposTexto: ['descripcion'],
      campoFecha: 'fecha_gasto',
    });
  }, [servicios, filtros]);

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const abrirModal = (imgs: string[]) => {
    setImagenes(imgs);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const handleCrearServicio = useCallback(
    (data: NuevoGastoOperativo) => {
      onCrearServicio(data);
      setAgregarModalOpen(false);
    },
    [onCrearServicio]
  );

  const handleActualizarServicio = useCallback(
    (id: number, data: ActualizarGastoOperativo) => {
      onActualizarServicio(id, data);
      setEditarServicio(null);
    },
    [onActualizarServicio]
  );

  const handleEliminarServicio = useCallback(() => {
    if (!servicioAEliminar) return;
    const id = servicioAEliminar.id;
    onEliminarServicio(id);
    setServicioAEliminar(null);
  }, [servicioAEliminar, onEliminarServicio]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Historial de servicios</Typography>
          {canRegistrarServicios && (
            <Button
              variant="contained"
              onClick={() => setAgregarModalOpen(true)}
            >
              Registrar servicio
            </Button>
          )}
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={serviciosFiltrados.length}
          onFiltrar={handleFiltrar}
          filtrosSearch
          filtrosFecha
        >
          {(currentPage) => {
            return (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha de creación</TableCell>
                      <TableCell>Fecha de servicio</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Anotaciones</TableCell>
                      <TableCell>Usuario creador</TableCell>
                      {(canEliminarServicios || canEliminarServicios) && (
                        <TableCell>Acciones</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviciosFiltrados.slice((currentPage - 1) * 5, currentPage * 5).map((s) => (
                      <TableRow
                        key={s.id}
                        hover
                      >
                        <TableCell>{formatearFechaHora(s.fecha_creacion)}</TableCell>
                        <TableCell>{formatearFechaHora(s.fecha_gasto)}</TableCell>
                        <TableCell>Q{s.costo.toLocaleString()}</TableCell>
                        <TableCell>{s.descripcion}</TableCell>
                        <TableCell>
                          {s.usuario_creador.first_name} {s.usuario_creador.last_name}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => s.fotos && abrirModal(s.fotos.map((f) => f.imagen))}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {canEditarServicios && (
                            <IconButton onClick={() => setEditarServicio(s)}>
                              <EditIcon />
                            </IconButton>
                          )}
                          {canEliminarServicios && (
                            <IconButton onClick={() => setServicioAEliminar(s)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            );
          }}
        </TablaPaginadaConFiltros>
      </Card>

      <ModalRegistrarServicio
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={handleCrearServicio}
      />

      {editarServicio && (
        <ModalEditarServicio
          open={!!editarServicio}
          servicio={editarServicio}
          onClose={() => setEditarServicio(null)}
          onConfirm={handleActualizarServicio}
        />
      )}

      <ModalEliminar
        type="servicio"
        open={!!servicioAEliminar}
        onClose={() => setServicioAEliminar(null)}
        onConfirm={handleEliminarServicio}
      />

      <ServicioImagenesModal
        open={modalOpen}
        onClose={cerrarModal}
        images={imagenes}
      />
    </Box>
  );
};
