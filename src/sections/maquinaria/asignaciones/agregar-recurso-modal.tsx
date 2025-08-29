import { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { NuevaMaquinaria, TipoDocumento, TipoMaquinaria } from 'src/api/types';

interface ModalAgregarRecursoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevaMaquinaria) => void;
}

export const ModalAgregarRecurso: FC<ModalAgregarRecursoProps> = ({ open, onClose, onConfirm }) => {
  const [tipo, setTipo] = useState<TipoMaquinaria>('maquinaria');
  const [nombre, setNombre] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [costo, setCosto] = useState('');
  const [fechaCompra, setFechaCompra] = useState<Date | null>(new Date());
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('cheque');
  const [anotaciones, setAnotaciones] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleConfirm = () => {
    if (!nombre || !costo || !fechaCompra || !tipoDocumento || !identificador) return;
    const data: NuevaMaquinaria = {
      tipo,
      nombre: nombre.trim(),
      identificador,
      costo: parseFloat(costo),
      fecha_compra: format(fechaCompra, 'yyyy-MM-dd'),
      tipo_documento: tipoDocumento,
      ...(anotaciones.trim() && { anotaciones: anotaciones.trim() }),
    };
    onConfirm(data);
    onClose();
    setNombre('');
    setIdentificador('');
    setCosto('');
    setTipo('maquinaria');
    setFechaCompra(new Date());
    setTipoDocumento('cheque');
    setAnotaciones('');
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
      <DialogTitle>Agregar nueva maquinaria</DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '100dvh', sm: '90dvh' },
          overflow: 'auto',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={2}>
          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'maquinaria' | 'herramienta')}
            fullWidth
          >
            <MenuItem value="maquinaria">Maquinaria</MenuItem>
            <MenuItem value="herramienta">Herramienta</MenuItem>
          </TextField>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
          >
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              fullWidth
            />
            <TextField
              label="Identificador"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              fullWidth
            />
          </Stack>

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={es}
          >
            <div>
              <Typography
                variant="body2"
                sx={{ mb: 1 }}
              >
                Fecha de compra <span style={{ color: 'red' }}>*</span>
              </Typography>
              <DateCalendar
                value={fechaCompra}
                onChange={setFechaCompra}
                sx={{
                  width: '100%',
                  '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': { mx: 0 },
                }}
              />
            </div>
          </LocalizationProvider>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
          >
            <TextField
              label="Tipo de documento"
              select
              fullWidth
              required
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
            >
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </TextField>

            <TextField
              label="Costo"
              type="number"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Stack>

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

      <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={!nombre || !costo || !fechaCompra || !tipoDocumento || !identificador}
        >
          Guardar recurso
        </Button>
      </DialogActions>
    </Dialog>
  );
};
