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
} from '@mui/material';
import { Stack } from '@mui/system';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';

interface Asignacion {
  proyecto: string;
  fechaInicio: string;
  fechaFin: string;
  dias: string;
}

interface Props {
  asignaciones: Asignacion[];
}

export const Asignaciones: FC<Props> = ({ asignaciones }) => {
  const [filtros, setFiltros] = useState<{
    search?: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({});

  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;

  const asignacionesFiltradas = useMemo(() => {
    return asignaciones.filter((a) => {
      const cumpleBusqueda =
        !filtros.search ||
        a.proyecto.toLowerCase().includes(filtros.search.toLowerCase());
      const cumpleFechaInicio =
        !filtros.fechaInicio ||
        new Date(a.fechaInicio) >= new Date(filtros.fechaInicio);
      const cumpleFechaFin =
        !filtros.fechaFin ||
        new Date(a.fechaFin) <= new Date(filtros.fechaFin);

      return cumpleBusqueda && cumpleFechaInicio && cumpleFechaFin;
    });
  }, [asignaciones, filtros]);

  const paginatedAsignaciones = useMemo(() => {
    const start = (paginaActual - 1) * rowsPerPage;
    return asignacionesFiltradas.slice(start, start + rowsPerPage);
  }, [asignacionesFiltradas, paginaActual]);

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
          filtrosSearch
          filtrosFecha
        >
          {(page, estado) => {
            setPaginaActual(page);
            setFiltros((prev) => ({ ...prev, estado }));

            return (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Proyecto</TableCell>
                      <TableCell>Inicio</TableCell>
                      <TableCell>Fin</TableCell>
                      <TableCell>Días</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAsignaciones.map((a, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{a.proyecto}</TableCell>
                        <TableCell>{a.fechaInicio}</TableCell>
                        <TableCell>{a.fechaFin}</TableCell>
                        <TableCell>{a.dias}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            );
          }}
        </TablaPaginadaConFiltros>
      </Card>
    </Box>
  );
};
