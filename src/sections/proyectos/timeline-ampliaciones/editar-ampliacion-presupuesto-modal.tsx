import { FC, useState, useEffect } from 'react';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';

interface ModalEditarAmpliacionPresupuestoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { fecha: string; motivo: string; monto: number; usuario: string }) => void;
  initialData: {
    fecha: string;
    motivo: string;
    monto?: number;
    usuario: string;
  };
}

export const ModalEditarAmpliacionPresupuesto: FC<ModalEditarAmpliacionPresupuestoProps> = ({
  open,
  onClose,
  onConfirm,
  initialData,
}) => {
  const [fecha, setFecha] = useState<Date | null>(new Date(initialData.fecha));
  const [motivo, setMotivo] = useState(initialData.motivo);
  const [monto, setMonto] = useState<number | ''>('');

  useEffect(() => {
    setFecha(new Date(initialData.fecha));
    setMotivo(initialData.motivo);
    setMonto(initialData.monto ?? '');
  }, [initialData]);

  const handleConfirm = () => {
    if (fecha && motivo && monto) {
      onConfirm({
        fecha: format(fecha, 'yyyy-MM-dd'),
        motivo,
        monto,
        usuario: initialData.usuario,
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: '90%',
          maxWidth: 500,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h6">Editar ampliación de presupuesto</Typography>

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fecha
            </Typography>
            <DateCalendar
              value={fecha}
              onChange={(newValue) => setFecha(newValue)}
            />
          </Box>

          <TextField
            fullWidth
            label="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />

          <TextField
            fullWidth
            label="Monto (Q)"
            value={monto}
            onChange={(e) => {
              const value = e.target.value;
              setMonto(value === '' ? '' : Number(value));
            }}
            type="number"
            inputProps={{ min: 0 }}
          />

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
          >
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={!fecha || !motivo || !monto}
            >
              Guardar cambios
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
