import { FC, useState } from 'react';
import {
  Box,
  Modal,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';

interface ModalAmpliarPresupuestoProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { monto: number; motivo?: string }) => void;
}

export const ModalAmpliarPresupuesto: FC<ModalAmpliarPresupuestoProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [monto, setMonto] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [fecha, setFecha] = useState<Date | null>(new Date());

  const handleGuardar = () => {
    if (!monto || !fecha) return;
    onSave({ monto: parseFloat(monto), motivo: anotaciones });
  };

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
          width: '90%',
          maxWidth: 600,
          p: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Ampliar presupuesto
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Completa los campos para registrar una ampliación de presupuesto
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Monto (Q)"
                type="number"
                fullWidth
                required
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />

              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  Fecha de ampliación <span style={{ color: 'red' }}>*</span>
                </Typography>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DateCalendar
                    value={fecha}
                    onChange={setFecha}
                  />
                </LocalizationProvider>
              </Box>

              <TextField
                label="Anotaciones"
                multiline
                rows={3}
                fullWidth
                value={anotaciones}
                onChange={(e) => setAnotaciones(e.target.value)}
              />
            </Stack>
          </CardContent>

          <Divider />

          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGuardar}
              disabled={!monto || !fecha}
            >
              Guardar ampliación
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
