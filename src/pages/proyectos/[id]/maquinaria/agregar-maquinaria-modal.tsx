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

interface ModalAgregarMaquinariaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevaAsignacionMaquinaria) => void;
  maquinasDisponibles: Maquinaria[];
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ModalAgregarMaquinaria: FC<ModalAgregarMaquinariaProps> = ({
  open,
  onClose,
  onConfirm,
  maquinasDisponibles,
}) => {
  const [maquina, setMaquina] = useState('');
  const [dias, setDias] = useState<string[]>([]);
  const [hasta, setHasta] = useState<Date | null>(null);
  const [asignadoA, setAsignadoA] = useState('');

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleConfirm = () => {
    if (maquina && dias.length && hasta && asignadoA) {
      const hastaString = hasta.toISOString().split('T')[0];
      onConfirm({ equipo: maquina, dias_asignados: dias, hasta: hastaString, asignadoA });
      onClose();
      setMaquina('');
      setDias([]);
      setHasta(null);
      setAsignadoA('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Asignar maquinaria al proyecto</DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={3}
          mt={1}
        >
          {/* Maquinaria */}
          <FormControl fullWidth>
            <InputLabel>Maquinaria</InputLabel>
            <Select
              value={maquina}
              label="Maquinaria"
              onChange={(e) => setMaquina(e.target.value)}
            >
              {maquinasDisponibles.map((m) => (
                <MenuItem
                  key={m}
                  value={m}
                >
                  {m}
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
              Días de uso
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

          {/* Fecha hasta con DateCalendar */}
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fecha hasta <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <DateCalendar
                value={hasta}
                onChange={setHasta}
              />
            </LocalizationProvider>
          </Box>

          {/* Asignado a */}
          <TextField
            fullWidth
            label="Asignado a"
            value={asignadoA}
            onChange={(e) => setAsignadoA(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!maquina || !dias.length || !hasta || !asignadoA}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
