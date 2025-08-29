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
import { DiaToggle } from './dia-toggle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { es } from 'date-fns/locale';
import { Maquinaria, NuevaAsignacionMaquinaria } from 'src/api/types';
import { format } from 'date-fns';

interface ModalAgregarMaquinariaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevaAsignacionMaquinaria) => void;
  maquinasDisponibles: Maquinaria[];
  usuarios: any[];
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ModalAgregarMaquinaria: FC<ModalAgregarMaquinariaProps> = ({
  open,
  onClose,
  onConfirm,
  maquinasDisponibles,
  usuarios,
}) => {
  const [maquina, setMaquina] = useState<number | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [desde, setDesde] = useState<Date | null>(null);
  const [hasta, setHasta] = useState<Date | null>(null);
  const [asignadoA, setAsignadoA] = useState<number | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleConfirm = () => {
    if (maquina && dias.length && desde && hasta && asignadoA !== null) {
      const desdeString = format(desde, 'yyyy-MM-dd');
      const hastaString = format(hasta, 'yyyy-MM-dd');

      onConfirm({
        equipo: maquina,
        dias_asignados: dias,
        fecha_entrada: desdeString,
        fecha_fin: hastaString,
        usuario_recibe: asignadoA,
      });

      onClose();
      setMaquina(null);
      setDias([]);
      setDesde(null);
      setHasta(null);
      setAsignadoA(null);
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
      <DialogTitle>Asignar maquinaria al proyecto</DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '100dvh', sm: '90dvh', md: '80vh' },
          overflow: 'auto',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Stack
          spacing={3}
          mt={1}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
          >
            <FormControl sx={{ width: '100%' }}>
              <InputLabel>Maquinaria</InputLabel>
              <Select
                value={maquina}
                label="Maquinaria"
                onChange={(e) => setMaquina(Number(e.target.value))}
                fullWidth
              >
                {maquinasDisponibles.map((m) => (
                  <MenuItem
                    key={m.id}
                    value={m.id}
                  >
                    {m.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <InputLabel>Asignado a</InputLabel>
              <Select
                value={asignadoA}
                label="Asignado a"
                onChange={(e) => setAsignadoA(e.target.value as number)}
                fullWidth
              >
                {usuarios.map((usuario) => (
                  <MenuItem
                    key={usuario.id}
                    value={usuario.id}
                  >
                    {usuario.first_name} {usuario.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Días de uso
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              {DIAS_SEMANA.map((dia) => (
                <DiaToggle
                  key={dia}
                  dia={dia}
                  selected={dias.includes(dia)}
                  onClick={() => toggleDia(dia)}
                />
              ))}
            </Box>
          </Box>

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
                direction={{ xs: 'column', lg: 'row' }}
                spacing={2}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption">Desde</Typography>
                  <DateCalendar
                    value={desde}
                    onChange={setDesde}
                    sx={{
                      width: '100%',
                      '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': { mx: 0 },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption">Hasta</Typography>
                  <DateCalendar
                    value={hasta}
                    onChange={setHasta}
                    sx={{
                      width: '100%',
                      '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': { mx: 0 },
                    }}
                  />
                </Box>
              </Stack>
            </LocalizationProvider>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={
            !maquina ||
            !dias.length ||
            !desde ||
            !hasta ||
            !asignadoA ||
            asignadoA === null ||
            (desde && hasta ? desde > hasta : false)
          }
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
