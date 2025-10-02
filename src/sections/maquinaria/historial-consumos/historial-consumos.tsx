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
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';
import EditIcon from '@untitled-ui/icons-react/build/esm/Pencil01';
import TrashIcon from '@untitled-ui/icons-react/build/esm/Trash01';
import { ModalRegistrarConsumo } from './registrar-consumo-modal';
import { ConsumoImagenesModal } from './consumo-imagenes-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarConsumo } from './editar-consumo-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { ActualizarGastoOperativo, GastoOperativo, NuevoGastoOperativo } from 'src/api/types';
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { formatearQuetzales } from 'src/utils/format-currency';

interface HistorialConsumosProps {
  consumos: GastoOperativo[];
  onCrearConsumo: (data: NuevoGastoOperativo) => void;
  onActualizarConsumo: (id: number, data: ActualizarGastoOperativo) => void;
  onEliminarConsumo: (id: number) => void;
}

export const HistorialConsumos: FC<HistorialConsumosProps> = ({
  consumos,
  onCrearConsumo,
  onActualizarConsumo,
  onEliminarConsumo,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarConsumo, setEditarConsumo] = useState<GastoOperativo | null>(null);
  const [consumoAEliminar, setConsumoAEliminar] = useState<GastoOperativo | null>(null);
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const canRegistrarConsumo = useHasPermission(PermissionId.REGISTRAR_CONSUMO);
  const canEditarConsumo = useHasPermission(PermissionId.EDITAR_CONSUMO);
  const canEliminarConsumo = useHasPermission(PermissionId.ELIMINAR_CONSUMO);

  const consumosFiltrados = useMemo(() => {
    return aplicarFiltros(consumos, filtros, {
      camposTexto: ['descripcion'],
      campoFecha: 'fecha_gasto',
    });
  }, [consumos, filtros]);

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

  const handleCrearConsumo = useCallback(
    (data: NuevoGastoOperativo) => {
      onCrearConsumo(data);
      setAgregarModalOpen(false);
    },
    [onCrearConsumo]
  );

  const handleActualizarConsumo = useCallback(
    (id: number, data: ActualizarGastoOperativo) => {
      onActualizarConsumo(id, data);
      setEditarConsumo(null);
    },
    [onActualizarConsumo]
  );

  const handleEliminarConsumo = useCallback(() => {
    if (!consumoAEliminar) return;
    const id = consumoAEliminar.id;
    onEliminarConsumo(id);
    setConsumoAEliminar(null);
  }, [consumoAEliminar, onEliminarConsumo]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Historial de combustible</Typography>
          {canRegistrarConsumo && (
            <Button
              variant="contained"
              onClick={() => setAgregarModalOpen(true)}
            >
              Registrar consumo
            </Button>
          )}
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={consumosFiltrados.length}
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
                      <TableCell>Fecha de consumo</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Anotaciones</TableCell>
                      <TableCell>Usuario creador</TableCell>
                      {(canEditarConsumo || canEliminarConsumo) && <TableCell>Acciones</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consumosFiltrados.slice((currentPage - 1) * 5, currentPage * 5).map((c) => (
                      <TableRow
                        key={c.id}
                        hover
                      >
                        <TableCell>{formatearFecha(c.fecha_creacion)}</TableCell>
                        <TableCell>{formatearFecha(c.fecha_gasto)}</TableCell>
                        <TableCell>{formatearQuetzales(Number(c.costo))}</TableCell>
                        <TableCell>{c.descripcion}</TableCell>
                        <TableCell>
                          {c.usuario_creador.first_name} {c.usuario_creador.last_name}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="info"
                            onClick={() => c.fotos && abrirModal(c.fotos.map((f) => f.imagen))}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {canEditarConsumo && (
                            <IconButton
                              color="success"
                              onClick={() => setEditarConsumo(c)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {canEliminarConsumo && (
                            <IconButton
                              color="error"
                              onClick={() => setConsumoAEliminar(c)}
                            >
                              <TrashIcon />
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

      <ModalRegistrarConsumo
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={handleCrearConsumo}
      />

      {editarConsumo && (
        <ModalEditarConsumo
          open={!!editarConsumo}
          consumo={editarConsumo}
          onClose={() => setEditarConsumo(null)}
          onConfirm={handleActualizarConsumo}
        />
      )}

      <ModalEliminar
        type="consumo"
        open={!!consumoAEliminar}
        onClose={() => setConsumoAEliminar(null)}
        onConfirm={handleEliminarConsumo}
      />

      <ConsumoImagenesModal
        open={modalOpen}
        onClose={cerrarModal}
        images={imagenes}
      />
    </Box>
  );
};
