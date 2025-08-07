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
          >
            <InputLabel shrink>Maquinaria</InputLabel>
            <Select
              value={equipo}
              label="Maquinaria"
              onChange={(e) => setEquipo(e.target.value)}
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
                  selected={dias_asignados.includes(dia)}
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
              Fechas de asignación <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <Stack
                direction="row"
                spacing={2}
              >
                <Box flex={1}>
                  <Typography variant="caption">Desde</Typography>
                  <DateCalendar
                    value={desdeDate}
                    onChange={setDesdeDate}
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant="caption">Hasta</Typography>
                  <DateCalendar
                    value={hastaDate}
                    onChange={setHastaDate}
                  />
                </Box>
              </Stack>
            </LocalizationProvider>
          </Box>

          {/* Asignado a */}
          <FormControl fullWidth>
            <InputLabel shrink>Asignado a</InputLabel>
            <Select
              value={asignadoA}
              label="Asignado a"
              onChange={(e) => setAsignadoA(e.target.value)}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!equipo || !dias_asignados.length || !hastaDate || !asignadoA}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
