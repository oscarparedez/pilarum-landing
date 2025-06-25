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
import { Pago } from '../index.d';

interface ModalEditarPagoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    fecha_pago: string;
    tipo_pago: string;
    tipo_documento: string;
    anotaciones: string;
    monto_total: number;
    usuario_registro: string;
  }) => void;
  initialData: Pago;
}

export const ModalEditarPago: FC<ModalEditarPagoProps> = ({
  open,
  onClose,
  onConfirm,
  initialData,
}) => {
  const [fecha, setFecha] = useState<Date | null>(null);
  const [tipoPago, setTipoPago] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [monto, setMonto] = useState(0);

  useEffect(() => {
    setFecha(new Date(initialData.fecha_pago));
    setTipoPago(initialData.tipo_pago);
    setTipoDocumento(initialData.tipo_documento);
    setAnotaciones(initialData.anotaciones);
    setMonto(initialData.monto_total);
  }, [initialData]);

  const handleConfirm = () => {
    if (!fecha || !tipoPago || !tipoDocumento || !monto) return;

    onConfirm({
      fecha_pago: format(fecha, 'yyyy-MM-dd'),
      tipo_pago: tipoPago,
      tipo_documento: tipoDocumento,
      anotaciones,
      monto_total: monto,
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
              Editar pago
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
                onChange={(e) => setMonto(Number(e.target.value))}
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
                    value={fecha}
                    onChange={setFecha}
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
                  label="Tipo de pago"
                  select
                  required
                  fullWidth
                  sx={{ flex: 1 }}
                  value={tipoPago}
                  onChange={(e) => setTipoPago(e.target.value)}
                >
                  <MenuItem value="Socio">Socio</MenuItem>
                  <MenuItem value="Maestro de obra">Maestro de obra</MenuItem>
                </TextField>

                <TextField
                  label="Tipo de documento"
                  select
                  required
                  fullWidth
                  sx={{ flex: 1 }}
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
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
              onClick={handleConfirm}
              disabled={!fecha || !tipoPago || !tipoDocumento || !monto}
            >
              Guardar cambios
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
