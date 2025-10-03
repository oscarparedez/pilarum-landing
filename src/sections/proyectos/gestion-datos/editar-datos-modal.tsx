import { FC, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import { CustomDateCalendar } from 'src/components/custom-date-components';
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
  const [identificador, setIdentificador] = useState(initialData.identificador);
  const [presupuestoInicial, setPresupuestoInicial] = useState<number>(
    initialData.presupuestoInicial
  );
  const [socio, setSocio] = useState<Socio | null>(initialData.socio_asignado ?? null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date(initialData.fechaInicio));
  const [fechaFin, setFechaFin] = useState<Date | null>(new Date(initialData.fechaFin));

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditarDatosBasicos = useCallback(() => {
    if (nombre && ubicacion && identificador && presupuestoInicial && fechaInicio && fechaFin && socio?.id) {
      onEditarDatosBasicos({
        nombre,
        ubicacion,
        identificador,
        presupuestoInicial,
        fecha_inicio: format(fechaInicio, 'yyyy-MM-dd'),
        fecha_fin: format(fechaFin, 'yyyy-MM-dd'),
        socio_asignado: socio.id,
      });
      onClose();
    }
  }, [
    nombre,
    ubicacion,
    identificador,
    presupuestoInicial,
    fechaInicio,
    fechaFin,
    socio,
    onEditarDatosBasicos,
    onClose,
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      keepMounted
    >
      <DialogTitle>Editar datos básicos del proyecto</DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
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
            label="Identificador"
            fullWidth
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          />

          <TextField
            label="Presupuesto inicial (Q)"
            fullWidth
            type="number"
            value={presupuestoInicial}
            onChange={(e) => {
              const v = e.target.value;
              setPresupuestoInicial(v === '' ? 0 : Number(v));
            }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />

          <FormControl fullWidth>
            <InputLabel id="socio-label">Socio asignado</InputLabel>
            <Select
              labelId="socio-label"
              value={socio?.id ?? ''}
              label="Socio asignado"
              onChange={(e) => {
                const id = Number(e.target.value);
                const selected = socios.find((s) => s.id === id) || null;
                setSocio(selected);
              }}
            >
              {socios.map((s) => (
                <MenuItem
                  key={s.id}
                  value={s.id}
                >
                  {s.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', md: 'flex-start' }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1 }}
              >
                Fecha de inicio
              </Typography>
              <CustomDateCalendar
                value={fechaInicio}
                onChange={(d) => setFechaInicio(d)}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1 }}
              >
                Fecha final
              </Typography>
              <CustomDateCalendar
                value={fechaFin}
                onChange={(d) => setFechaFin(d)}
              />
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!nombre || !ubicacion || !identificador || !presupuestoInicial || !fechaInicio || !fechaFin || !socio}
          onClick={handleEditarDatosBasicos}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
