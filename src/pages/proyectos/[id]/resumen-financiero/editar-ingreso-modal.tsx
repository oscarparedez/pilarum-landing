import { FC, useEffect, useState } from 'react';
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
import { format } from 'date-fns';
import { Ingreso } from '../index.d';

interface ModalEditarIngresoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    fecha_ingreso: string;
    monto_total: number;
    tipo_ingreso: string;
    tipo_documento: string;
    anotaciones: string;
    usuario_registro: string;
  }) => void;
  initialData: Ingreso;
}

export const ModalEditarIngreso: FC<ModalEditarIngresoProps> = ({
  open,
  onClose,
  onConfirm,
  initialData,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [monto, setMonto] = useState(0);
  const [tipoIngreso, setTipoIngreso] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [anotaciones, setAnotaciones] = useState('');

  useEffect(() => {
    setSelectedDate(new Date(initialData.fecha_ingreso));
    setMonto(initialData.monto_total);
    setTipoIngreso(initialData.tipo_ingreso);
    setTipoDocumento(initialData.tipo_documento);
    setAnotaciones(initialData.anotaciones);
  }, [initialData]);

  const handleConfirm = () => {
    if (!selectedDate || !monto || !tipoIngreso || !tipoDocumento) return;

    onConfirm({
      fecha_ingreso: format(selectedDate, 'yyyy-MM-dd'),
      monto_total: monto,
      tipo_ingreso: tipoIngreso,
      tipo_documento: tipoDocumento,
      anotaciones,
      usuario_registro: initialData.usuario_registro,
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
              Editar ingreso
            </Typography>
            <Stack
              spacing={3}
              mt={2}
            >
              <TextField
                label="Monto total (Q)"
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

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <TextField
                  label="Tipo de ingreso"
                  select
                  required
                  value={tipoIngreso}
                  onChange={(e) => setTipoIngreso(e.target.value)}
                  fullWidth
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="Avance de obra">Avance de obra</MenuItem>
                  <MenuItem value="Pago final">Pago final</MenuItem>
                </TextField>

                <TextField
                  label="Tipo de documento"
                  select
                  required
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  fullWidth
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="Cheque">Cheque</MenuItem>
                  <MenuItem value="Transferencia">Transferencia</MenuItem>
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                </TextField>
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
              onClick={handleConfirm}
              disabled={!selectedDate || !monto || !tipoIngreso || !tipoDocumento}
            >
              Guardar cambios
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
