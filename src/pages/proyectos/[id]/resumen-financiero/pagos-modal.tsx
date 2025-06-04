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

interface Pago {
  id_pago: string;
  proyecto_id: string;
  monto_total: string;
  fecha_pago: string;
  tipo_pago: string;
  tipo_documento: string;
  anotaciones: string;
  usuario_registro: string;
}

interface ModalListaPagosProps {
  open: boolean;
  onClose: () => void;
  pagos: Pago[];
}

export const ModalListaPagos: FC<ModalListaPagosProps> = ({ open, onClose, pagos }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
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
          <CardHeader title="Historial de pagos" />
          <Divider />
          <Table>
            <TableBody>
              {pagos.map((ingreso, index) => {
                const fechaFormatted = format(
                  new Date(ingreso.fecha_pago),
                  'dd LLL yyyy'
                ).toUpperCase();
                return (
                  <TableRow key={ingreso.id_pago || index}>
                    <TableCell width={100}>
                      <Box sx={{ p: 1 }}>
                        <Typography
                          align="center"
                          color="text.secondary"
                          variant="subtitle2"
                        >
                          {fechaFormatted}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{ingreso.usuario_registro}</Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {ingreso.tipo_pago} - {ingreso.tipo_documento}
                      </Typography>
                      {ingreso.anotaciones && (
                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          {ingreso.anotaciones}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color="success.main"
                        variant="subtitle2"
                      >
                        {ingreso.monto_total}
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
