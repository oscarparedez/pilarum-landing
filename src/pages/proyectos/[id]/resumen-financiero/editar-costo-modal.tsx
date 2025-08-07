import { FC, useCallback, useEffect, useState } from 'react';
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
import { Costo } from '../index.d';

interface ModalEditarCostoProps {
  open: boolean;
  onClose: () => void;
  initialData: Costo;
  tiposPago: { id: number; nombre: string }[];
  onConfirm: (
    id: number,
    data: {
      fecha_pago: string;
      tipo_pago: number;
      tipo_documento: string;
      anotaciones?: string;
      correlativo?: string;
      monto_total: number;
      usuario_registro: string;
    }
  ) => void;
}

export const ModalEditarCosto: FC<ModalEditarCostoProps> = ({
  open,
  onClose,
  initialData,
  tiposPago,
  onConfirm,
}) => {
  const [fecha, setFecha] = useState<Date | null>(null);
  const [monto, setMonto] = useState<number | ''>('');
  const [tipoPago, setTipoPago] = useState<number | ''>('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [correlativo, setCorrelativo] = useState('');
  const [anotaciones, setAnotaciones] = useState('');

  useEffect(() => {
    setFecha(new Date(initialData.fecha_pago));
    setMonto(initialData.monto_total);
    setTipoPago(initialData.tipo_pago.id);
    setTipoDocumento(initialData.tipo_documento);
    setCorrelativo(initialData.correlativo || '');
    setAnotaciones(initialData.anotaciones || '');
  }, [initialData]);

  const handleSave = useCallback(() => {
    if (!fecha || !monto || !tipoPago || !tipoDocumento) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    onConfirm(initialData.id_pago, {
      fecha_pago: format(fecha, 'yyyy-MM-dd'),
      tipo_pago: tipoPago,
      tipo_documento: tipoDocumento,
      correlativo: correlativo.trim() || '',
      anotaciones,
      monto_total: Number(monto),
      usuario_registro: initialData.usuario_registro,
    });

    onClose();
  }, [
    fecha,
    monto,
    tipoPago,
    tipoDocumento,
    correlativo,
    anotaciones,
    initialData.id_pago,
    initialData.usuario_registro,
    onConfirm,
    onClose,
  ]);

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
              Editar costo
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Modifica los campos necesarios y guarda los cambios
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
                  Fecha del costo <span style={{ color: 'red' }}>*</span>
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

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Tipo de pago"
                  select
                  fullWidth
                  required
                  value={tipoPago}
                  onChange={(e) => setTipoPago(Number(e.target.value))}
                >
                  {tiposPago.map((tipo) => (
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
                  <MenuItem value="transferencia">Transferencia</MenuItem>
                  <MenuItem value="efectivo">Efectivo</MenuItem>
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
              disabled={!fecha || !monto || !tipoPago || !tipoDocumento}
            >
              Guardar cambios
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
