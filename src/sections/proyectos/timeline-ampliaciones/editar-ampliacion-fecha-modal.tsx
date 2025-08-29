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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatearFechaLocal, formatearFechaLocalMasUno } from 'src/utils/format-date';

interface ModalEditarAmpliacionFechaProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    fecha: string;
    motivo: string;
  };
  onConfirm: (data: { ampliacionId: number; fecha: string; motivo: string }) => void;
}

export const ModalEditarAmpliacionFecha: FC<ModalEditarAmpliacionFechaProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [fecha, setFecha] = useState<Date | null>(formatearFechaLocal(initialData.fecha));
  const [motivo, setMotivo] = useState(initialData.motivo);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initialData) {
      setFecha(formatearFechaLocal(initialData.fecha));
      setMotivo(initialData.motivo);
    }
  }, [initialData]);

  const handleSave = () => {
    if (!fecha || !motivo) {
      return;
    }

    onConfirm({
      ampliacionId: initialData.id,
      fecha: format(fecha, 'yyyy-MM-dd'),
      motivo,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      keepMounted
      PaperProps={{
        sx: { borderRadius: 3, py: 4 },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', mb: 2 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Editar ampliación de fecha
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Fecha anterior: <strong>{initialData.fecha}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
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
              value={fecha}
              onChange={(newDate) => setFecha(newDate)}
              minDate={formatearFechaLocalMasUno(initialData.fecha)}
              sx={{
                width: '100%',
                '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': {
                  mx: 0,
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        <TextField
          label="Motivo"
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
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={!fecha || !motivo}
          >
            Guardar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
