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
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import type { GastoMaquinaria } from '../index.d';
import { ModalRegistrarServicio } from './registrar-servicio-modal';
import { ServicioImagenesModal } from './servicio-imagenes-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarServicio } from './editar-servicio-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';

interface Props {
  servicios: GastoMaquinaria[];
}

export const HistorialServicios: FC<Props> = ({ servicios }) => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarServicio, setEditarServicio] = useState<GastoMaquinaria | null>(null);
  const [servicioAEliminar, setServicioAEliminar] = useState<GastoMaquinaria | null>(null);
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [fotosVisor, setFotosVisor] = useState<string[]>([]);
  const [filtros, setFiltros] = useState<{
    search?: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({});

  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;

  const serviciosFiltrados = useMemo(() => {
    return servicios.filter((s) => {
      const cumpleBusqueda =
        !filtros.search ||
        s.tipo_gasto.toLowerCase().includes(filtros.search.toLowerCase()) ||
        s.solicitadoPor.nombre.toLowerCase().includes(filtros.search.toLowerCase()) ||
        s.anotaciones.toLowerCase().includes(filtros.search.toLowerCase());

      const cumpleFechaInicio =
        !filtros.fechaInicio || new Date(s.fecha_creacion) >= new Date(filtros.fechaInicio);

      const cumpleFechaFin = !filtros.fechaFin || new Date(s.fecha_creacion) <= new Date(filtros.fechaFin);

      return cumpleBusqueda && cumpleFechaInicio && cumpleFechaFin;
    });
  }, [servicios, filtros]);

  const paginatedServicios = useMemo(() => {
    const start = (paginaActual - 1) * rowsPerPage;
    return serviciosFiltrados.slice(start, start + rowsPerPage);
  }, [serviciosFiltrados, paginaActual]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Historial de mantenimiento</Typography>
          <Button
            variant="contained"
            onClick={() => setAgregarModalOpen(true)}
          >
            Registrar servicio
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={serviciosFiltrados.length}
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
                      <TableCell>Solicitado por</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Anotaciones</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedServicios.map((s, i) => (
                      <TableRow
                        key={i}
                        hover
                      >
                        <TableCell>{s.tipo_gasto}</TableCell>
                        <TableCell>{s.fecha_creacion}</TableCell>
                        <TableCell>{s.solicitadoPor.nombre}</TableCell>
                        <TableCell>Q{s.costo.toLocaleString()}</TableCell>
                        <TableCell>{s.anotaciones}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setFotosVisor(s.fotos);
                              setVisorAbierto(true);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton onClick={() => setEditarServicio(s)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => setServicioAEliminar(s)}>
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

      <ModalRegistrarServicio
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={(data) => {
          console.log('Nuevo servicio registrado:', data);
          setAgregarModalOpen(false);
        }}
      />

      <ModalEditarServicio
        open={!!editarServicio}
        servicio={editarServicio}
        onClose={() => setEditarServicio(null)}
        onConfirm={(data) => {
          console.log('Servicio editado:', data);
          setEditarServicio(null);
        }}
      />

      <ModalEliminar
        type="servicio"
        open={!!servicioAEliminar}
        onClose={() => setServicioAEliminar(null)}
        onConfirm={() => {
          console.log('Eliminando:', servicioAEliminar);
          setServicioAEliminar(null);
        }}
      />

      <ServicioImagenesModal
        open={visorAbierto}
        onClose={() => setVisorAbierto(false)}
        images={fotosVisor}
      />
    </Box>
  );
};
