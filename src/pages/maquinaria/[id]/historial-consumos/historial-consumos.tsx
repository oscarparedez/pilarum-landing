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
import { ModalRegistrarConsumo } from './registrar-consumo-modal';
import { ConsumoImagenesModal } from './consumo-imagenes-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarConsumo } from './editar-consumo-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { GastoOperativo, NuevoGastoOperativo } from 'src/api/types';
import { formatearFechaHora } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';

interface HistorialConsumosProps {
  consumos: GastoOperativo[];
  onCrearConsumo: (data: NuevoGastoOperativo) => void;
  onActualizarConsumo: (id: number, data: NuevoGastoOperativo) => void;
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
    (id: number, data: NuevoGastoOperativo) => {
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
          <Button
            variant="contained"
            onClick={() => setAgregarModalOpen(true)}
          >
            Registrar consumo
          </Button>
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
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consumosFiltrados.slice((currentPage - 1) * 5, currentPage * 5).map((c) => (
                      <TableRow
                        key={c.id}
                        hover
                      >
                        <TableCell>{formatearFechaHora(c.fecha_creacion)}</TableCell>
                        <TableCell>{formatearFechaHora(c.fecha_gasto)}</TableCell>
                        <TableCell>Q{c.costo.toLocaleString()}</TableCell>
                        <TableCell>{c.descripcion}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => c.fotos && abrirModal(c.fotos.map((f) => f.imagen))}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton onClick={() => setEditarConsumo(c)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => setConsumoAEliminar(c)}>
                            <DeleteIcon />
                          </IconButton>
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
