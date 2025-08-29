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
import { FC, useEffect, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';
import { DiaToggle } from './dia-toggle';
import { AsignacionMaquinaria, Maquinaria, NuevaAsignacionMaquinaria } from 'src/api/types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface ModalEditarMaquinariaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevaAsignacionMaquinaria) => void;
  maquinasDisponibles: Maquinaria[];
  usuarios: any[];
  initialData: AsignacionMaquinaria;
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ModalEditarMaquinaria: FC<ModalEditarMaquinariaProps> = ({
  open,
  onClose,
  onConfirm,
  maquinasDisponibles,
  usuarios,
  initialData,
}) => {
  const [equipo, setEquipo] = useState<number | null>(null);
  const [dias_asignados, setDias] = useState<string[]>([]);
  const [desdeDate, setDesdeDate] = useState<Date | null>(null);
  const [hastaDate, setHastaDate] = useState<Date | null>(null);
  const [asignadoA, setAsignadoA] = useState<number | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setEquipo(initialData.equipo.id);
    setDias(initialData.dias_asignados || []);
    setDesdeDate(initialData.fecha_entrada ? new Date(initialData.fecha_entrada) : null);
    setHastaDate(initialData.fecha_fin ? new Date(initialData.fecha_fin) : null);
    setAsignadoA(initialData.usuario_recibe.id);
  }, [initialData]);

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleConfirm = () => {
    if (equipo && dias_asignados.length && desdeDate && hastaDate && asignadoA !== null) {
      onConfirm({
        equipo,
        dias_asignados,
        fecha_entrada: format(desdeDate, 'yyyy-MM-dd'),
        fecha_fin: format(hastaDate, 'yyyy-MM-dd'),
        usuario_recibe: asignadoA,
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
      <DialogTitle>Editar maquinaria asignada</DialogTitle>
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
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
          >
            <FormControl fullWidth>
              <InputLabel shrink>Maquinaria</InputLabel>
              <Select
                value={equipo}
                label="Maquinaria"
                onChange={(e) => setEquipo(e.target.value as number)}
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

            <FormControl fullWidth>
              <InputLabel shrink>Asignado a</InputLabel>
              <Select
                value={asignadoA}
                label="Asignado a"
                onChange={(e) => setAsignadoA(e.target.value as number)}
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
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1.5}
              alignItems="center"
            >
              {DIAS_SEMANA.map((dia) => (
                <DiaToggle
                  key={dia}
                  dia={dia}
                  selected={dias_asignados.includes(dia)}
                  onClick={() => toggleDia(dia)}
                />
              ))}
            </Stack>
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
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption">Desde</Typography>
                  <DateCalendar
                    value={desdeDate}
                    onChange={setDesdeDate}
                    sx={{
                      width: '100%',
                      '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': { mx: 0 },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption">Hasta</Typography>
                  <DateCalendar
                    value={hastaDate}
                    onChange={setHastaDate}
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

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={
            !equipo ||
            !dias_asignados.length ||
            !desdeDate ||
            !hastaDate ||
            !asignadoA ||
            asignadoA === null ||
            (desdeDate && hastaDate ? desdeDate > hastaDate : false)
          }
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
