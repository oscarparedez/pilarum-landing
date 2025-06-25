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

export const ModalRegistrarIngreso: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [tipoIngreso, setTipoIngreso] = useState('');

  const handleTipoIngresoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoIngreso(event.target.value);
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
              Nuevo ingreso al proyecto
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Completa los siguientes campos para registrar un nuevo ingreso
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Monto total (Q)"
                type="number"
                fullWidth
                required
              />

              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  Fecha de ingreso <span style={{ color: 'red' }}>*</span>
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
                label="Tipo de ingreso"
                select
                fullWidth
                required
                value={tipoIngreso}
                onChange={handleTipoIngresoChange}
              >
                <MenuItem value="avance">Avance de obra</MenuItem>
                <MenuItem value="final">Pago final</MenuItem>
              </TextField>

              {tipoIngreso === 'final' && (
                <TextField
                  label="Socio"
                  select
                  fullWidth
                  required
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
              Guardar ingreso
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
