import { FC } from 'react';
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

interface Asignacion {
  proyecto: string;
  fechaInicio: string;
  fechaFin: string;
  dias: string;
}

interface Props {
  asignaciones: Asignacion[];
}

export const Asignaciones: FC<Props> = ({ asignaciones }) => (
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
            {asignaciones.map((a, i) => (
              <TableRow
                key={i}
                hover
              >
                <TableCell>{a.proyecto}</TableCell>
                <TableCell>{a.fechaInicio}</TableCell>
                <TableCell>{a.fechaFin}</TableCell>
                <TableCell>{a.dias}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  </Box>
);
