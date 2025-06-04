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

interface ModalAgregarMaquinariaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { maquina: string; dias: string[]; hasta: string; asignadoA: string }) => void;
  maquinasDisponibles: string[];
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
  const [hasta, setHasta] = useState('');
  const [asignadoA, setAsignadoA] = useState('');

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleConfirm = () => {
    if (maquina && dias.length && hasta && asignadoA) {
      onConfirm({ maquina, dias, hasta, asignadoA });
      onClose();
      setMaquina('');
      setDias([]);
      setHasta('');
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

          {/* Fecha hasta */}
          <TextField
            fullWidth
            type="date"
            label="Hasta"
            InputLabelProps={{ shrink: true }}
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />

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
