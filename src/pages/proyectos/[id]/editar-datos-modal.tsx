import { FC, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

interface EditarDatosBasicosModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    nombre: string;
    ubicacion: string;
    fechaInicio: string;
    fechaFin: string;
    presupuestoInicial: number;
  };
  onConfirm: (data: {
    nombre: string;
    ubicacion: string;
    fechaInicio: string;
    fechaFin: string;
    presupuestoInicial: number;
  }) => void;
}

export const EditarDatosBasicosModal: FC<EditarDatosBasicosModalProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);
  const [ubicacion, setUbicacion] = useState(initialData.ubicacion);
  const [presupuesto, setPresupuesto] = useState(initialData.presupuestoInicial);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date(initialData.fechaInicio));
  const [fechaFin, setFechaFin] = useState<Date | null>(new Date(initialData.fechaFin));

  const handleConfirm = () => {
    if (nombre && ubicacion && presupuesto && fechaInicio && fechaFin) {
      onConfirm({
        nombre,
        ubicacion,
        presupuestoInicial: presupuesto,
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Editar datos básicos del proyecto
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Nombre del proyecto"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <TextField
            label="Ubicación"
            fullWidth
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />

          <TextField
            label="Presupuesto inicial (Q)"
            fullWidth
            value={presupuesto}
            onChange={(e) => setPresupuesto(Number(e.target.value))}
          />

          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="subtitle2">Fecha de inicio</Typography>
              <DateCalendar value={fechaInicio} onChange={(d) => setFechaInicio(d)} />
            </Box>

            <Box>
              <Typography variant="subtitle2">Fecha final</Typography>
              <DateCalendar value={fechaFin} onChange={(d) => setFechaFin(d)} />
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleConfirm}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
