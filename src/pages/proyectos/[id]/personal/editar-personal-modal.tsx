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
  import { FC, useEffect, useState } from 'react';
  import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
  import { format } from 'date-fns';
  import { DiaToggle } from '../maquinaria/dia-toggle';
  
  interface ModalEditarPersonalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: {
      personal: string;
      dias: string[];
      hasta: string;
    }) => void;
    personalDisponible: { nombre: string; tipo: 'Ingeniero' | 'Arquitecto' }[];
    initialData: {
      personal: string;
      diasBinarios: string;
      hasta: string;
    };
  }
  
  const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  export const ModalEditarPersonal: FC<ModalEditarPersonalProps> = ({
    open,
    onClose,
    onConfirm,
    personalDisponible,
    initialData,
  }) => {
    const binarioToDias = (bin: string): string[] =>
      bin
        .split('')
        .map((val, i) => (val === '1' ? DIAS_SEMANA[i] : null))
        .filter(Boolean) as string[];
  
    const [personal, setPersonal] = useState(initialData.personal);
    const [dias, setDias] = useState<string[]>(binarioToDias(initialData.diasBinarios));
    const [hastaDate, setHastaDate] = useState<Date | null>(new Date(initialData.hasta));
  
    useEffect(() => {
      setPersonal(initialData.personal);
      setDias(binarioToDias(initialData.diasBinarios));
      setHastaDate(new Date(initialData.hasta));
    }, [initialData]);
  
    const toggleDia = (dia: string) => {
      setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
    };
  
    const handleConfirm = () => {
      if (personal && dias.length && hastaDate) {
        onConfirm({
          personal,
          dias,
          hasta: format(hastaDate, 'yyyy-MM-dd'),
        });
        onClose();
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar técnico asignado</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} mt={1}>
            <FormControl fullWidth disabled>
              <InputLabel>Técnico</InputLabel>
              <Select value={personal} label="Técnico">
                {personalDisponible.map((p) => (
                  <MenuItem key={p.nombre} value={p.nombre}>
                    {p.nombre} ({p.tipo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Días de trabajo
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
                Hasta
              </Typography>
              <DateCalendar
                value={hastaDate}
                onChange={(newDate) => setHastaDate(newDate)}
                disablePast
              />
            </Box>
          </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!personal || !dias.length || !hastaDate}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  