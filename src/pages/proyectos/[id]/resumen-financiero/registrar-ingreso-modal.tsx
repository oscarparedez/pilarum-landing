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
import { TipoIngreso } from '../../configuracion/tipo-ingresos/index.d';

interface ModalRegistrarIngresoProps {
  open: boolean;
  tiposIngreso: TipoIngreso[];
  onClose: () => void;
  onSave: (data: {
    monto_total: number;
    tipo_ingreso: number;
    tipo_documento: string;
    fecha_ingreso: string;
    anotaciones?: string;
    correlativo?: string;
  }) => void;
}

export const ModalRegistrarIngreso: FC<ModalRegistrarIngresoProps> = ({
  open,
  tiposIngreso,
  onClose,
  onSave,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [monto, setMonto] = useState<number | ''>('');
  const [tipoIngreso, setTipoIngreso] = useState<number | ''>('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [correlativo, setCorrelativo] = useState('');
  const [anotaciones, setAnotaciones] = useState('');

  const handleSave = () => {
    if (!selectedDate || !monto || tipoIngreso === '' || !tipoDocumento) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    onSave({
      monto_total: Number(monto),
      tipo_ingreso: tipoIngreso as number,
      tipo_documento: tipoDocumento,
      fecha_ingreso: selectedDate.toISOString().split('T')[0],
      anotaciones,
      correlativo: correlativo.trim() || '',
    });

    onClose();
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
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
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

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Tipo de ingreso"
                  select
                  fullWidth
                  required
                  value={tipoIngreso}
                  onChange={(e) => setTipoIngreso(Number(e.target.value))}
                >
                  {tiposIngreso.map((tipo) => (
                    <MenuItem
                      key={tipo.id}
                      value={tipo.id}
                    >
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Tipo de documento"
                  select
                  fullWidth
                  required
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                >
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="efectivo">Efectivo</MenuItem>
                  <MenuItem value="transferencia">Transferencia</MenuItem>
                </TextField>
              </Box>

              <TextField
                label="Correlativo"
                fullWidth
                value={correlativo}
                onChange={(e) => setCorrelativo(e.target.value)}
              />

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
              onClick={handleSave}
              disabled={!selectedDate || !monto || tipoIngreso === '' || !tipoDocumento}
            >
              Guardar ingreso
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
