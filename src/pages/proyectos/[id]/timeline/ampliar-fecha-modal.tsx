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

interface AmpliarFechaModalProps {
  open: boolean;
  onClose: () => void;
  fechaActual: string;
  onSave?: (nuevaFecha: Date, anotaciones: string) => void;
}

export const AmpliarFechaModal: FC<AmpliarFechaModalProps> = ({
  open,
  onClose,
  fechaActual,
  onSave,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [anotaciones, setAnotaciones] = useState('');

  const handleSave = () => {
    if (fechaSeleccionada && anotaciones && onSave) {
      onSave(fechaSeleccionada, anotaciones);
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
            />
          </LocalizationProvider>
        </Box>

        <TextField
          label="Anotaciones"
          multiline
          rows={3}
          fullWidth
          required
          value={anotaciones}
          onChange={(e) => setAnotaciones(e.target.value)}
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
            disabled={!fechaSeleccionada || !anotaciones}
          >
            Guardar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
