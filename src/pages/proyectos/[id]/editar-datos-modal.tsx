import { FC, useState, useCallback } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { NuevoProyecto, Proyecto, Socio } from 'src/api/types';
import { format } from 'date-fns';

interface EditarDatosBasicosModalProps {
  open: boolean;
  socios: Socio[];
  onClose: () => void;
  initialData: Proyecto;
  onEditarDatosBasicos: (data: NuevoProyecto) => void;
}

export const EditarDatosBasicosModal: FC<EditarDatosBasicosModalProps> = ({
  open,
  socios,
  onClose,
  initialData,
  onEditarDatosBasicos,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);
  const [ubicacion, setUbicacion] = useState(initialData.ubicacion);
  const [presupuestoInicial, setPresupuestoInicial] = useState(initialData.presupuestoInicial);
  const [socio, setSocio] = useState(initialData.socio_asignado);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date(initialData.fechaInicio));
  const [fechaFin, setFechaFin] = useState<Date | null>(new Date(initialData.fechaFin));

  const handleEditarDatosBasicos = useCallback(() => {
    if (nombre && ubicacion && presupuestoInicial && fechaInicio && fechaFin && socio) {
      onEditarDatosBasicos({
        nombre,
        ubicacion,
        presupuestoInicial,
        fecha_inicio: format(fechaInicio, 'yyyy-MM-dd'),
        fecha_fin: format(fechaFin, 'yyyy-MM-dd'),
        socio_asignado: socio.id,
      });
      onClose();
    }
  }, [nombre, ubicacion, presupuestoInicial, fechaInicio, fechaFin, socio, onEditarDatosBasicos, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Editar datos básicos del proyecto
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Nombre del proyecto"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <TextField
            label="Ubicación"
            fullWidth
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />

          <TextField
            label="Presupuesto inicial (Q)"
            fullWidth
            type="number"
            value={presupuestoInicial}
            onChange={(e) => setPresupuestoInicial(Number(e.target.value))}
          />

          <FormControl fullWidth>
            <InputLabel id="socio-label">Socio asignado</InputLabel>
            <Select
              labelId="socio-label"
              value={socio?.id || ''}
              label="Socio asignado"
              onChange={(e) => {
                const selected = socios.find((s) => s.id === e.target.value);
                if (selected) setSocio(selected);
              }}
            >
              {socios.map((socio) => (
                <MenuItem key={socio.id} value={socio.id}>
                  {socio.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="subtitle2">Fecha de inicio</Typography>
              <DateCalendar value={fechaInicio} onChange={(d) => setFechaInicio(d)} />
            </Box>

            <Box>
              <Typography variant="subtitle2">Fecha final</Typography>
              <DateCalendar value={fechaFin} onChange={(d) => setFechaFin(d)} />
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleEditarDatosBasicos}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
