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
} from '@mui/material';
import { FC, useState } from 'react';
import { DiaToggle } from '../maquinaria/dia-toggle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { es } from 'date-fns/locale';

interface ModalAgregarPersonalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    personal: string;
    tipo: 'Ingeniero' | 'Arquitecto';
    dias: string[];
    hasta: string;
  }) => void;
  personalDisponible: { nombre: string; tipo: 'Ingeniero' | 'Arquitecto' }[];
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ModalAgregarPersonal: FC<ModalAgregarPersonalProps> = ({
  open,
  onClose,
  onConfirm,
  personalDisponible,
}) => {
  const [personal, setPersonal] = useState('');
  const [tipo, setTipo] = useState<'Ingeniero' | 'Arquitecto' | ''>('');
  const [dias, setDias] = useState<string[]>([]);
  const [hasta, setHasta] = useState<Date | null>(null);

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleConfirm = () => {
    if (personal && dias.length && hasta && tipo) {
      const hastaString = hasta.toISOString().split('T')[0];
      onConfirm({ personal, tipo, dias, hasta: hastaString });
      onClose();
      setPersonal('');
      setTipo('');
      setDias([]);
      setHasta(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Asignar recurso técnico</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Ingeniero o Arquitecto</InputLabel>
            <Select
              value={personal}
              label="Ingeniero o Arquitecto"
              onChange={(e) => {
                const seleccionado = personalDisponible.find((p) => p.nombre === e.target.value);
                setPersonal(e.target.value);
                if (seleccionado) setTipo(seleccionado.tipo);
              }}
            >
              {personalDisponible.map((p) => (
                <MenuItem key={p.nombre} value={p.nombre}>
                  {p.nombre} ({p.tipo})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Días de asignación
            </Typography>
            <Stack direction="row" flexWrap="wrap">
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

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Fecha hasta <span style={{ color: 'red' }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
              <DateCalendar value={hasta} onChange={setHasta} />
            </LocalizationProvider>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!personal || !tipo || !dias.length || !hasta}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
