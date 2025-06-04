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
  Typography
} from '@mui/material';
import { format } from 'date-fns';

interface AmpliacionPresupuesto {
  fecha: string;
  motivo: string;
  monto?: string;
  usuario: string;
}

interface ModalAmpliacionesPresupuestoProps {
  open: boolean;
  onClose: () => void;
  ampliaciones: AmpliacionPresupuesto[];
}

export const ModalAmpliacionesPresupuesto: FC<ModalAmpliacionesPresupuestoProps> = ({
  open,
  onClose,
  ampliaciones,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 600,
        p: 3,
      }}
    >
      <Card>
        <CardHeader title="Historial de ampliaciones de presupuesto" />
        <Divider />
        <Table>
          <TableBody>
            {ampliaciones.map((item, index) => {
              const fechaFormatted = format(new Date(item.fecha), 'dd LLL yyyy').toUpperCase();
              return (
                <TableRow key={index}>
                  <TableCell width={120}>
                    <Box sx={{ p: 1 }}>
                      <Typography align="center" color="text.secondary" variant="subtitle2">
                        {fechaFormatted}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{item.usuario}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {item.motivo}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" color="success.main">
                      +{item.monto}
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
