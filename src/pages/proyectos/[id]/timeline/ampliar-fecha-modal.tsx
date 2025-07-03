import { FC, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  TextField,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import { formatearFechaLocalMasUno } from 'src/utils/format-date';

interface AmpliarFechaModalProps {
  open: boolean;
  onClose: () => void;
  fechaActual: string;
  onSave: (nuevaFecha: Date, motivo: string) => void;
}

export const AmpliarFechaModal: FC<AmpliarFechaModalProps> = ({
  open,
  onClose,
  fechaActual,
  onSave,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [motivo, setMotivo] = useState('');

  const handleSave = () => {
    if (fechaSeleccionada && motivo && onSave) {
      onSave(fechaSeleccionada, motivo);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, py: 4 },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', mb: 2 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Seleccionar nueva fecha de fin
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Fecha actual estimada: <strong>{fechaActual}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          justifyContent="center"
          py={2}
        >
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={es}
          >
            <DateCalendar
              views={['year', 'month', 'day']}
              value={fechaSeleccionada}
              onChange={(newDate) => setFechaSeleccionada(newDate)}
              minDate={formatearFechaLocalMasUno(fechaActual)}
            />
          </LocalizationProvider>
        </Box>

        <TextField
          label="motivo"
          multiline
          rows={3}
          fullWidth
          required
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            onClick={onClose}
            color="inherit"
            size="large"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            size="large"
            disabled={!fechaSeleccionada || !motivo}
          >
            Guardar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
