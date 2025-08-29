import { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useSociosApi } from 'src/api/socios/useSociosApi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface CrearProyectoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    nombre: string;
    ubicacion: string;
    presupuestoInicial: number;
    socio_asignado: string;
    fecha_inicio: string;
    fecha_fin: string;
  }) => void;
}

interface Socio {
  id: number;
  tipo: 'interno' | 'externo';
  nombre: string;
}

export const CrearProyectoModal: FC<CrearProyectoModalProps> = ({ open, onClose, onConfirm }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [presupuesto, setPresupuesto] = useState<number | ''>('');
  const [socioAsignado, setSocioAsignado] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
  const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
  const [socios, setSocios] = useState<Socio[]>([]);
  const { getSociosInternos } = useSociosApi();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // iPhone → full screen dialog

  useEffect(() => {
    const fetchSociosInternos = async () => {
      try {
        const socios = await getSociosInternos();
        setSocios(socios);
      } catch (error) {
        toast.error('Error al cargar socios internos');
      }
    };

    if (open) {
      fetchSociosInternos();
    }
  }, [open, getSociosInternos]);

  const handleConfirm = () => {
    if (nombre && ubicacion && presupuesto !== '' && socioAsignado && fechaInicio && fechaFin) {
      onConfirm({
        nombre,
        ubicacion,
        presupuestoInicial: Number(presupuesto),
        socio_asignado: socioAsignado,
        fecha_inicio: format(fechaInicio, 'yyyy-MM-dd'),
        fecha_fin: format(fechaFin, 'yyyy-MM-dd')
      });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      keepMounted
    >
      <DialogTitle>Crear nuevo proyecto</DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
        <Stack spacing={3}>
          <TextField
            label="Nombre del proyecto"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <TextField
            label="Ubicación"
            fullWidth
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />

          <TextField
            label="Presupuesto inicial (Q)"
            type="number"
            fullWidth
            value={presupuesto}
            onChange={(e) => setPresupuesto(e.target.value === '' ? '' : Number(e.target.value))}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />

          <FormControl fullWidth>
            <InputLabel id="socio-asignado-label">Socio asignado</InputLabel>
            <Select
              labelId="socio-asignado-label"
              value={socioAsignado}
              label="Socio asignado"
              onChange={(e) => setSocioAsignado(String(e.target.value))}
            >
              {socios.map((socio) => (
                <MenuItem
                  key={socio.id}
                  value={socio.id}
                >
                  {socio.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', md: 'flex-start' }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1 }}
                >
                  Fecha de inicio
                </Typography>
                <DateCalendar
                  value={fechaInicio}
                  onChange={(d) => setFechaInicio(d)}
                  sx={{
                    width: '100%',
                    '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': {
                      mx: 0,
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1 }}
                >
                  Fecha final
                </Typography>
                <DateCalendar
                  value={fechaFin}
                  onChange={(d) => setFechaFin(d)}
                  sx={{
                    width: '100%',
                    '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': {
                      mx: 0,
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!nombre || !ubicacion || presupuesto === '' || !socioAsignado || !fechaInicio || !fechaFin}
          onClick={handleConfirm}
        >
          Guardar proyecto
        </Button>
      </DialogActions>
    </Dialog>
  );
};
