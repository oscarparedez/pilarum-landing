import { FC, useMemo, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';

import type { Consumo } from '../index.d';
import { ModalRegistrarConsumo } from './registrar-consumo-modal';
import { ConsumoImagenesModal } from './consumo-imagenes-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarConsumo } from './editar-consumo-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';

interface Props {
  consumos: Consumo[];
}

export const HistorialConsumos: FC<Props> = ({ consumos }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [fotosVisor, setFotosVisor] = useState<string[]>([]);
  const [consumoEditando, setConsumoEditando] = useState<Consumo | null>(null);
  const [consumoAEliminar, setConsumoAEliminar] = useState<Consumo | null>(null);
  const [filtros, setFiltros] = useState<{
    search?: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({});

  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;

  const consumosFiltrados = useMemo(() => {
    return consumos.filter((c) => {
      const cumpleBusqueda =
        !filtros.search ||
        c.tipo.toLowerCase().includes(filtros.search.toLowerCase()) ||
        c.reportadoPor.toLowerCase().includes(filtros.search.toLowerCase()) ||
        c.anotaciones.toLowerCase().includes(filtros.search.toLowerCase());

      const cumpleFechaInicio =
        !filtros.fechaInicio || new Date(c.fecha) >= new Date(filtros.fechaInicio);

      const cumpleFechaFin = !filtros.fechaFin || new Date(c.fecha) <= new Date(filtros.fechaFin);

      return cumpleBusqueda && cumpleFechaInicio && cumpleFechaFin;
    });
  }, [consumos, filtros]);

  const paginatedConsumos = useMemo(() => {
    const start = (paginaActual - 1) * rowsPerPage;
    return consumosFiltrados.slice(start, start + rowsPerPage);
  }, [consumosFiltrados, paginaActual]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Historial de consumos</Typography>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
          >
            Registrar consumo
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={consumosFiltrados.length}
          onFiltrar={(f) => setFiltros((prev) => ({ ...prev, ...f }))}
          filtrosSearch
          filtrosFecha
        >
          {(page) => {
            setPaginaActual(page);
            return (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Reportado por</TableCell>
                      <TableCell>Anotaciones</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedConsumos.map((c, i) => (
                      <TableRow
                        key={i}
                        hover
                      >
                        <TableCell>{c.tipo}</TableCell>
                        <TableCell>{c.fecha}</TableCell>
                        <TableCell>
                          {c.cantidad} {c.unidad}
                        </TableCell>
                        <TableCell>{c.reportadoPor}</TableCell>
                        <TableCell>{c.anotaciones}</TableCell>
                        <TableCell>Q{c.costo.toLocaleString()}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setFotosVisor(c.fotos);
                              setVisorAbierto(true);
                            }}
                            disabled={c.fotos.length === 0}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton onClick={() => setConsumoEditando(c)}>
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(data) => {
          console.log('Nuevo consumo registrado:', data);
          setModalOpen(false);
        }}
      />

      <ModalEditarConsumo
        open={!!consumoEditando}
        consumo={consumoEditando}
        onClose={() => setConsumoEditando(null)}
        onConfirm={(data) => {
          console.log('Consumo editado:', data);
          setConsumoEditando(null);
        }}
      />

      <ModalEliminar
        type="consumo"
        open={!!consumoAEliminar}
        onClose={() => setConsumoAEliminar(null)}
        onConfirm={() => {
          console.log('Eliminando:', consumoAEliminar);
          setConsumoAEliminar(null);
        }}
      />

      <ConsumoImagenesModal
        open={visorAbierto}
        onClose={() => setVisorAbierto(false)}
        images={fotosVisor}
      />
    </Box>
  );
};
