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
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';

interface AmpliarFechaModalProps {
  open: boolean;
  onClose: () => void;
  fechaActual: string;
  onSave?: (nuevaFecha: Date) => void;
}

export const AmpliarFechaModal: FC<AmpliarFechaModalProps> = ({
  open,
  onClose,
  fechaActual,
  onSave,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  const handleSave = () => {
    if (fechaSeleccionada && onSave) {
      onSave(fechaSeleccionada);
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
        sx: { borderRadius: 3, py: 4, minHeight: 300 },
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

      <Box
        display="flex"
        justifyContent="center"
        py={4}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={es}
        >
          <DateCalendar
            sx={{
                transform: 'scale(1.2)',

              '& .MuiPickersCalendarHeader-label': {
                textTransform: 'capitalize',
                fontWeight: 'medium',
              },
            }}
            views={['year', 'month', 'day']}
            value={fechaSeleccionada}
            onChange={(newDate) => setFechaSeleccionada(newDate)}
          />
        </LocalizationProvider>
      </Box>

      <DialogActions sx={{ justifyContent: 'center', mt: 0 }}>
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
            disabled={!fechaSeleccionada}
          >
            Guardar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
