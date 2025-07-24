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
import { FC, useEffect, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';
import { DiaToggle } from './dia-toggle';
import { AsignacionMaquinaria, Maquinaria, NuevaAsignacionMaquinaria } from 'src/api/types';

interface ModalEditarMaquinariaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevaAsignacionMaquinaria) => void;
  maquinasDisponibles: Maquinaria[];
  initialData: AsignacionMaquinaria;
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ModalEditarMaquinaria: FC<ModalEditarMaquinariaProps> = ({
  open,
  onClose,
  onConfirm,
  maquinasDisponibles,
  initialData,
}) => {
  const binarioToDias = (bin: string): string[] =>
    bin
      .split('')
      .map((val, i) => (val === '1' ? DIAS_SEMANA[i] : null))
      .filter(Boolean) as string[];

  const [maquina, setMaquina] = useState(initialData.maquina);
  const [dias, setDias] = useState<string[]>(binarioToDias(initialData.diasBinarios));
  const [hastaDate, setHastaDate] = useState<Date | null>(new Date(initialData.hasta));
  const [asignadoA, setAsignadoA] = useState(initialData.asignadoA);

  useEffect(() => {
    setMaquina(initialData.maquina);
    setDias(binarioToDias(initialData.diasBinarios));
    setHastaDate(new Date(initialData.hasta));
    setAsignadoA(initialData.asignadoA);
  }, [initialData]);

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleConfirm = () => {
    if (maquina && dias.length && hastaDate && asignadoA) {
      onConfirm({
        maquina,
        dias,
        hasta: format(hastaDate, 'yyyy-MM-dd'),
        asignadoA,
      });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Editar maquinaria asignada</DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={3}
          mt={1}
        >
          {/* Maquinaria */}
          <FormControl
            fullWidth
            disabled
          >
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

          {/* Días */}
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

          {/* Fecha hasta */}
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Hasta
            </Typography>
            <DateCalendar
              value={hastaDate}
              onChange={(newDate) => setHastaDate(newDate)}
              disablePast
            />
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
          disabled={!maquina || !dias.length || !hastaDate || !asignadoA}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
