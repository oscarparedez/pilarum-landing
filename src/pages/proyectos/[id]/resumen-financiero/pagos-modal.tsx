import { FC, useState } from 'react';
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
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { ModalEditarPago } from './editar-pago-modal';

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
  const [editando, setEditando] = useState<Pago | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
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
            <CardHeader title="Historial de pagos" />
            <Divider />
            <Table>
              <TableBody>
                {pagos.map((pago, index) => {
                  const fechaFormatted = format(new Date(pago.fecha_pago), 'dd LLL yyyy').toUpperCase();
                  return (
                    <TableRow key={pago.id_pago || index}>
                      <TableCell width={100}>
                        <Box sx={{ p: 1 }}>
                          <Typography align="center" color="text.secondary" variant="subtitle2">
                            {fechaFormatted}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{pago.usuario_registro}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {pago.tipo_pago} - {pago.tipo_documento}
                        </Typography>
                        {pago.anotaciones && (
                          <Typography color="text.secondary" variant="body2">
                            {pago.anotaciones}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="success.main" variant="subtitle2">
                          {pago.monto_total}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setEditando(pago);
                            setEditModalOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </Box>
      </Modal>

      {editando && (
        <ModalEditarPago
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={editando}
          onConfirm={(data) => {
            // Acá deberías hacer refetch o levantar a nivel superior
            console.log('Datos editados:', data);
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};
