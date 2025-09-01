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
import { FC, useCallback, useEffect, useState } from 'react';
import { CustomDateCalendar } from 'src/components/custom-date-components';
import { format } from 'date-fns';
import { DiaToggle } from 'src/sections/proyectos/gestion-maquinaria/dia-toggle';
import { Personal } from 'src/api/types';
import es from 'date-fns/locale/es';

interface ModalEditarPersonalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    asignacion_id: number,
    data: {
      usuario_id: number;
      dias_asignados: string[];
      fecha_entrada: string;
      fecha_fin: string;
    }
  ) => void;
  personalDisponible: Personal[];
  initialData: any;
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ModalEditarPersonal: FC<ModalEditarPersonalProps> = ({
  open,
  onClose,
  onConfirm,
  personalDisponible,
  initialData,
}) => {
  const [personalId, setPersonalId] = useState<number | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [desdeDate, setDesdeDate] = useState<Date | null>(null);
  const [hastaDate, setHastaDate] = useState<Date | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initialData) {
      setPersonalId(initialData.usuario.id);
      setDias(initialData.dias_asignados || []);
      setDesdeDate(initialData.fecha_entrada ? new Date(initialData.fecha_entrada) : null);
      setHastaDate(initialData.fecha_fin ? new Date(initialData.fecha_fin) : null);
    }
  }, [initialData]);

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleCloseModal = useCallback(() => {
    setPersonalId(null);
    setDias([]);
    setDesdeDate(null);
    setHastaDate(null);
    onClose();
  }, [onClose]);

  const handleConfirm = () => {
    if (dias.length && desdeDate && hastaDate) {
      onConfirm(initialData.id, {
        usuario_id: personalId!,
        dias_asignados: dias,
        fecha_entrada: format(desdeDate, 'yyyy-MM-dd'),
        fecha_fin: format(hastaDate, 'yyyy-MM-dd'),
      });
      handleCloseModal();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      keepMounted
    >
      <DialogTitle>Editar técnico asignado</DialogTitle>
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
          <FormControl fullWidth>
            <InputLabel shrink>Ingeniero o Arquitecto</InputLabel>
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

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Días de trabajo
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

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fechas de asignación
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
            >
              <Box flex={1}>
                <Typography variant="caption">Desde</Typography>
                <CustomDateCalendar
                  value={desdeDate}
                  onChange={setDesdeDate}
                />
              </Box>
              <Box flex={1}>
                <Typography variant="caption">Hasta</Typography>
                <CustomDateCalendar
                  value={hastaDate}
                  onChange={setHastaDate}
                />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseModal}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!personalId || !dias.length || !desdeDate || !hastaDate}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
