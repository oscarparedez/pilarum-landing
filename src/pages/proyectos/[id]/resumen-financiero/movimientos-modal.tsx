import { FC } from 'react';
import {
  Box,
  Modal,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

interface Movimiento {
  tipo: 'Ingreso' | 'Pago';
  monto: string;
  fecha: string;
  descripcion: string;
  usuario: string;
}

interface ModalMovimientosProps {
  open: boolean;
  onClose: () => void;
  movimientos: Movimiento[];
}

export const ModalMovimientos: FC<ModalMovimientosProps> = ({ open, onClose, movimientos }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        maxWidth: 800,
        maxHeight: '90vh',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Card>
        <CardHeader title="Movimientos financieros" />
        <Divider />
        <Table>
          <TableBody>
            {movimientos.map((item, index) => {
              const fechaFormatted = format(new Date(item.fecha), 'dd LLL yyyy').toUpperCase();
              const isIngreso = item.tipo === 'Ingreso';

              return (
                <TableRow key={index}>
                  <TableCell width={100}>
                    <Box sx={{ p: 1 }}>
                      <Typography align="center" color="text.secondary" variant="subtitle2">
                        {fechaFormatted}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{item.usuario}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {item.descripcion}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="subtitle2"
                      color={isIngreso ? 'success.main' : 'error.main'}
                    >
                      {isIngreso ? '+' : '-'} {item.monto}
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
