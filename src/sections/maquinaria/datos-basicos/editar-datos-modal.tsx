import { FC, useEffect, useState } from 'react';
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
import { format, parseISO } from 'date-fns';
import { NuevaMaquinaria, TipoDocumento, TipoMaquinaria } from 'src/api/types';

interface EditarDatosBasicosModalProps {
  open: boolean;
  onClose: () => void;
  initialData: NuevaMaquinaria;
  onConfirm: (data: NuevaMaquinaria) => void;
}

export const EditarDatosBasicosModal: FC<EditarDatosBasicosModalProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [tipo, setTipo] = useState<TipoMaquinaria>(initialData.tipo);
  const [nombre, setNombre] = useState(initialData.nombre);
  const [identificador, setIdentificador] = useState(initialData.identificador || '');
  const [costo, setCosto] = useState(initialData.costo.toString());
  const [fechaCompra, setFechaCompra] = useState<Date | null>(
    initialData.fecha_compra ? parseISO(initialData.fecha_compra) : new Date()
  );
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>(initialData.tipo_documento);
  const [anotaciones, setAnotaciones] = useState(initialData.anotaciones || '');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      setTipo(initialData.tipo);
      setNombre(initialData.nombre);
      setIdentificador(initialData.identificador || '');
      setCosto(initialData.costo.toString());
      setFechaCompra(initialData.fecha_compra ? parseISO(initialData.fecha_compra) : new Date());
      setTipoDocumento(initialData.tipo_documento);
      setAnotaciones(initialData.anotaciones || '');
    }
  }, [open, initialData]);

  const handleConfirm = () => {
    if (!nombre.trim() || !costo || !fechaCompra) return;
    onConfirm({
      ...initialData,
      tipo,
      nombre: nombre.trim(),
      identificador: identificador.trim(),
      costo: parseFloat(costo),
      fecha_compra: format(fechaCompra, 'yyyy-MM-dd'),
      tipo_documento: tipoDocumento,
      anotaciones: anotaciones.trim() || undefined,
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
      <DialogTitle>Editar maquinaria</DialogTitle>
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
            onChange={(e) => setTipo(e.target.value as TipoMaquinaria)}
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
          disabled={!nombre || !costo || !fechaCompra}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
