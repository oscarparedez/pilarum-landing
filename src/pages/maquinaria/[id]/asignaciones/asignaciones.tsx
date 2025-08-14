import { FC, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Paper,
} from '@mui/material';
import { Stack } from '@mui/system';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { AsignacionMaquinaria } from 'src/api/types';
import { formatearFechaHora } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';

interface Props {
  asignaciones: AsignacionMaquinaria[];
}

export const Asignaciones: FC<Props> = ({ asignaciones }) => {
  const [filtros, setFiltros] = useState({
    search: '',
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;
  const today = useMemo(() => new Date(), []);

  const calcularEstado = useCallback(
    (entrada: string, fin?: string): 'Activo' | 'Inactivo' => {
      const hoy = today;
      const finDate = fin ? new Date(fin) : null;
      if (finDate && finDate < hoy) return 'Inactivo';
      return 'Activo';
    },
    [today]
  );

  const asignacionesConEstado = useMemo(() => {
    return asignaciones.map((a) => ({
      ...a,
      estado: calcularEstado(a.fecha_fin),
    }));
  }, [asignaciones, calcularEstado]);

  const asignacionesFiltradas = useMemo(() => {
    return aplicarFiltros(asignacionesConEstado, filtros, {
      camposTexto: ['proyecto.nombre'],
    });
  }, [asignacionesConEstado, filtros]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Asignaciones</Typography>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={asignacionesFiltradas.length}
          onFiltrar={(f) => setFiltros((prev) => ({ ...prev, ...f }))}
          onPageChange={(page) => setPaginaActual(page)}
          filtrosSearch
          filtrosEstado
          filtrosFecha={false}
        >
          {(currentPage, estadoFiltro) => {
            const asignacionesVisibles =
              estadoFiltro && estadoFiltro !== 'Todos'
                ? asignacionesFiltradas.filter((a) => a.estado === estadoFiltro)
                : asignacionesFiltradas;

            const start = (currentPage - 1) * rowsPerPage;
            const paginated = asignacionesVisibles.slice(start, start + rowsPerPage);

            return (
              <TableContainer
                component={Paper}
                sx={{ overflowX: 'auto', maxHeight: 600 }}
              >
                <Table
                  size="small"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Proyecto</TableCell>
                      <TableCell>Inicio</TableCell>
                      <TableCell>Fin</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Días</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map((a, i) => (
                      <TableRow
                        key={i}
                        hover
                      >
                        <TableCell>
                          {a.proyecto.nombre} - #{a.proyecto.id}
                        </TableCell>
                        <TableCell>{formatearFechaHora(a.fecha_entrada)}</TableCell>
                        <TableCell>{formatearFechaHora(a.fecha_fin)}</TableCell>
                        <TableCell>{a.estado}</TableCell>
                        <TableCell>{a.dias_asignados.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </TablaPaginadaConFiltros>
      </Card>
    </Box>
  );
};
