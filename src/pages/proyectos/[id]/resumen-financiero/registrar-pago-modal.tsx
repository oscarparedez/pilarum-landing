import { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Modal,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';

export const ModalRegistrarCobro: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [tipoPago, setTipoPago] = useState('');
  const [socio, setSocio] = useState('');
  const [monto, setMonto] = useState('');
  const [documento, setDocumento] = useState('');
  const [anotaciones, setAnotaciones] = useState('');

  const handleTipoPagoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTipoPago(value);
    if (value !== 'socio') {
      setSocio('');
    }
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
              sx={{ fontWeight: 'bold' }}
            >
              Nuevo pago del proyecto
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Completa los siguientes campos para registrar un nuevo pago
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
                  Fecha de pago <span style={{ color: 'red' }}>*</span>
                </Typography>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DateCalendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                  />
                </LocalizationProvider>
              </Box>

              <TextField
                label="Tipo de pago"
                select
                fullWidth
                required
                value={tipoPago}
                onChange={handleTipoPagoChange}
              >
                <MenuItem value="maestro">Pago a maestro de obra</MenuItem>
                <MenuItem value="socio">Pago a socio</MenuItem>
              </TextField>

              {tipoPago === 'socio' && (
                <TextField
                  label="Socio"
                  select
                  fullWidth
                  required
                  value={socio}
                  onChange={(e) => setSocio(e.target.value)}
                >
                  <MenuItem value="socio1">Socio 1</MenuItem>
                  <MenuItem value="socio2">Socio 2</MenuItem>
                </TextField>
              )}

              <TextField
                label="Tipo de documento"
                select
                fullWidth
                required
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              >
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
                <MenuItem value="efectivo">Efectivo</MenuItem>
              </TextField>

              <TextField
                label="Anotaciones"
                multiline
                rows={3}
                fullWidth
                required
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
            >
              Guardar pago
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
export default ModalRegistrarCobro;
