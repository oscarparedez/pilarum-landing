import { FC, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CustomDateCalendar } from 'src/components/custom-date-components';

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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGuardar = () => {
    if (!monto || !fecha) return;
    onSave({ monto: parseFloat(monto), motivo: anotaciones });
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
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
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
                <CustomDateCalendar
                  value={fecha}
                  onChange={setFecha}
                />
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
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGuardar}
          disabled={!monto || !fecha}
        >
          Guardar ampliación
        </Button>
      </DialogActions>
    </Dialog>
  );
};
