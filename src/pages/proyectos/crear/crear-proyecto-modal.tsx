import { FC, useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useSociosApi } from 'src/api/socios/useSociosApi';

interface CrearProyectoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    nombre: string;
    ubicacion: string;
    presupuestoInicial: number;
    socioAsignado: string;
    fechaInicio: string;
    fechaFin: string;
  }) => void;
}

interface Socio {
  id: number;
  tipo: 'interno' | 'externo';
  nombre: string;
}

export const CrearProyectoModal: FC<CrearProyectoModalProps> = ({ open, onClose, onConfirm }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [presupuesto, setPresupuesto] = useState<number | ''>('');
  const [socioAsignado, setSocioAsignado] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
  const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
  const [socios, setSocios] = useState<Socio[]>([]);
  const { getSociosInternos } = useSociosApi();

useEffect(() => {
  const fetchSociosInternos = async () => {
    try {
      const socios = await getSociosInternos();
      setSocios(socios);
    } catch (error) {
      console.error('Error fetching socios:', error);
    }
  };

  if (open) {
    fetchSociosInternos();
  }
}, [open, getSociosInternos]);

  const handleConfirm = () => {
    if (nombre && ubicacion && presupuesto !== '' && socioAsignado && fechaInicio && fechaFin) {
      onConfirm({
        nombre,
        ubicacion,
        presupuestoInicial: Number(presupuesto),
        socioAsignado,
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
      });
      onClose();
    }
  };

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
          Crear nuevo proyecto
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
            type="number"
            fullWidth
            value={presupuesto}
            onChange={(e) => setPresupuesto(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <FormControl fullWidth>
            <InputLabel id="socio-asignado-label">Socio asignado</InputLabel>
            <Select
              labelId="socio-asignado-label"
              value={socioAsignado}
              label="Socio asignado"
              onChange={(e) => setSocioAsignado(e.target.value)}
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
            <Button variant="contained" onClick={handleConfirm}>
              Guardar proyecto
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
