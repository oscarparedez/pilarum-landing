// ModalMovimientos.tsx
import { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import numeral from 'numeral';

interface Movimiento {
  id: string;
  cantidad: number;
  unidad: string;
  creadoPor: string;
  fecha: number;
  tipo: 'entrada' | 'salida';
}

interface ModalMovimientosProps {
  open: boolean;
  onClose: () => void;
  movimientos: Movimiento[];
  producto: string;
}

export const ModalMovimientos: FC<ModalMovimientosProps> = ({
  open,
  onClose,
  movimientos,
  producto,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 10 }}>
        <Card>
          <CardHeader title={`Movimientos de: ${producto}`} />
          <Divider />
          <Table>
            <TableBody>
              {movimientos.map((mov) => {
                const fechaCompleta = format(mov.fecha, 'dd LLL yyyy').toUpperCase();
                const tipo = mov.tipo === 'entrada' ? 'Ingreso de material' : 'Salida de material';
                const cantidadTexto = `${mov.tipo === 'entrada' ? '+' : '-'} ${mov.cantidad} ${
                  mov.unidad
                }`;
                const colorCantidad = mov.tipo === 'entrada' ? 'success.main' : 'error.main';

                return (
                  <TableRow key={mov.id}>
                    <TableCell width={120}>
                      <Box sx={{ p: 1 }}>
                        <Typography
                          align="center"
                          color="text.secondary"
                          variant="subtitle2"
                        >
                          {fechaCompleta}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{mov.creadoPor}</Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {tipo}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={colorCantidad}
                        variant="subtitle2"
                      >
                        {cantidadTexto}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {mov.unidad.toUpperCase()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </Modal>
  );
};
