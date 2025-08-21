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
  TextField,
  Typography,
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
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Asignar maquinaria al proyecto</DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={3}
          mt={1}
        >
          {/* Maquinaria + Asignado a (50% / 50%) */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
          >
            {/* Maquinaria */}
            <FormControl sx={{ flexBasis: { xs: '100%', md: '50%' } }}>
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

            {/* Asignado a */}
            <FormControl sx={{ flexBasis: { xs: '100%', md: '50%' } }}>
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

          {/* Días de la semana (debajo de los dropdowns) */}
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
                flexWrap: 'wrap', // siempre en fila; hace wrap si no caben
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

          {/* Fechas (debajo de días) */}
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
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant="caption">Hasta</Typography>
                  <DateCalendar
                    value={hasta}
                    onChange={setHasta}
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
            !maquina ||
            !dias.length ||
            !desde ||
            !hasta ||
            !asignadoA ||
            asignadoA === null ||
            desde > hasta
          }
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
