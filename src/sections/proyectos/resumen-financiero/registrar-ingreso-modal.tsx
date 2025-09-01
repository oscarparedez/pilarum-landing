import { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CustomDateCalendar } from 'src/components/custom-date-components';
import { format } from 'date-fns';
import { TipoIngreso } from 'src/api/types';

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
      fecha_ingreso: format(selectedDate, 'yyyy-MM-dd'),
      anotaciones,
      correlativo: correlativo.trim() || '',
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
    >
      <DialogTitle>
        Nuevo ingreso al proyecto
      </DialogTitle>
      <DialogContent
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
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
              variant="subtitle2"
              sx={{ mb: 1 }}
            >
              Fecha del ingreso
            </Typography>
            <CustomDateCalendar
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </Box>

          <Stack spacing={2}>
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
            </Stack>

            <TextField
              label="Correlativo"
              fullWidth
              value={correlativo}
              onChange={(e) => setCorrelativo(e.target.value)}
            />              <TextField
                label="Anotaciones"
                multiline
                rows={3}
                fullWidth
                value={anotaciones}
                onChange={(e) => setAnotaciones(e.target.value)}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!selectedDate || !monto || tipoIngreso === '' || !tipoDocumento}
            >
              Guardar ingreso
            </Button>
          </DialogActions>
    </Dialog>
  );
};
