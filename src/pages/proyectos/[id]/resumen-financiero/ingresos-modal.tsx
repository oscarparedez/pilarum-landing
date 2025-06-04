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
import { ModalEditarIngreso } from './editar-ingreso-modal';

interface Ingreso {
  id_ingreso: string;
  proyecto_id: string;
  monto_total: string;
  fecha_ingreso: string;
  tipo_ingreso: string;
  tipo_documento: string;
  anotaciones: string;
  usuario_registro: string;
}

interface ModalListaIngresosProps {
  open: boolean;
  onClose: () => void;
  ingresos: Ingreso[];
}

export const ModalListaIngresos: FC<ModalListaIngresosProps> = ({
  open,
  onClose,
  ingresos,
}) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

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
            <CardHeader title="Historial de ingresos" />
            <Divider />
            <Table>
              <TableBody>
                {ingresos.map((ingreso, index) => {
                  const fechaFormatted = format(
                    new Date(ingreso.fecha_ingreso),
                    'dd LLL yyyy'
                  ).toUpperCase();
                  return (
                    <TableRow key={ingreso.id_ingreso || index}>
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
                        <Typography variant="subtitle2">
                          {ingreso.usuario_registro}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          {ingreso.tipo_ingreso} - {ingreso.tipo_documento}
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
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                          onClick={() => {
                            setEditandoIndex(index);
                            setModalEditarAbierto(true);
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

      {editandoIndex !== null && (
        <ModalEditarIngreso
          open={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          initialData={ingresos[editandoIndex]}
          onConfirm={(data) => {
            console.log('Ingreso editado:', data);
            setModalEditarAbierto(false);
            // Aquí podrías hacer refetch o levantar al padre si es necesario
          }}
        />
      )}
    </>
  );
};
