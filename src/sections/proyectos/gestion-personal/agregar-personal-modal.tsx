import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';
import { DiaToggle } from 'src/sections/proyectos/gestion-maquinaria/dia-toggle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface ModalAgregarPersonalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    usuario_id: number;
    dias_asignados: string[];
    fecha_entrada: string;
    fecha_fin: string;
  }) => void;
  personalDisponible: any[];
}

export const ModalAgregarPersonal: FC<ModalAgregarPersonalProps> = ({
  open,
  onClose,
  onConfirm,
  personalDisponible,
}) => {
  const [personalId, setPersonalId] = useState<number | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [desde, setDesde] = useState<Date | null>(null);
  const [hasta, setHasta] = useState<Date | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleConfirm = () => {
    if (personalId && dias.length && desde && hasta) {
      const desdeString = format(desde, 'yyyy-MM-dd');
      const hastaString = format(hasta, 'yyyy-MM-dd');
      onConfirm({
        usuario_id: personalId,
        dias_asignados: dias,
        fecha_entrada: desdeString,
        fecha_fin: hastaString,
      });
      onClose();
      setPersonalId(null);
      setDias([]);
      setDesde(null);
      setHasta(null);
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
      <DialogTitle>Asignar recurso técnico</DialogTitle>
      <DialogContent 
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
        <Stack
          spacing={3}
          mt={1}
        >
          {/* Selector de personal */}
          <FormControl fullWidth>
            <InputLabel>Ingeniero o Arquitecto</InputLabel>
            <Select
              value={personalId ?? ''}
              label="Ingeniero o Arquitecto"
              onChange={(e) => setPersonalId(Number(e.target.value))}
            >
              {personalDisponible.map((p) => (
                <MenuItem
                  key={p.id}
                  value={p.id}
                >
                  {p.first_name} {p.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Días de la semana */}
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Días de asignación
            </Typography>
            <Stack
              direction="row"
              flexWrap="wrap"
            >
              {DIAS_SEMANA.map((dia) => (
                <DiaToggle
                  key={dia}
                  dia={dia}
                  selected={dias.includes(dia)}
                  onClick={() => toggleDia(dia)}
                />
              ))}
            </Stack>
          </Box>

          {/* Fechas */}
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fechas de asignación <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
              >
                <Box flex={1}>
                  <Typography variant="caption">Desde</Typography>
                  <DateCalendar
                    value={desde}
                    onChange={setDesde}
                    sx={{
                      width: '100%',
                      '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': {
                        mx: 0,
                      },
                    }}
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant="caption">Hasta</Typography>
                  <DateCalendar
                    value={hasta}
                    onChange={setHasta}
                    sx={{
                      width: '100%',
                      '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': {
                        mx: 0,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </LocalizationProvider>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!personalId || !dias.length || !desde || !hasta}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
