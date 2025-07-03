import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import type { GastoMaquinaria, TipoConsumo } from '../index.d';
import { formatearFechaLocal } from 'src/utils/format-date';

interface ModalEditarServicioProps {
  open: boolean;
  servicio: GastoMaquinaria | null;
  onClose: () => void;
  onConfirm: (data: GastoMaquinaria & { nuevasImagenes: File[] }) => void;
}

const usuarios = [
  { id: 'user-001', nombre: 'Juan Pérez' },
  { id: 'user-002', nombre: 'Ana Gómez' },
  { id: 'user-003', nombre: 'Carlos Méndez' },
  { id: 'user-004', nombre: 'Lucía Ramos' },
  { id: 'user-005', nombre: 'Luis García' },
];

export const ModalEditarServicio: FC<ModalEditarServicioProps> = ({
  open,
  servicio,
  onClose,
  onConfirm,
}) => {
  const [tipo, setTipo] = useState<TipoConsumo>('');
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [anotaciones, setAnotaciones] = useState('');
  const [costo, setCosto] = useState('');
  const [solicitadoPor, setSolicitadoPor] = useState<{ id: string; nombre: string } | null>(null);
  const [imagenes, setImagenes] = useState<(string | File)[]>([]);
  const [cargadas, setCargadas] = useState<boolean[]>([]);

  useEffect(() => {
    if (servicio) {
      setTipo(servicio.tipo_gasto);
      setFecha(formatearFechaLocal(servicio.fecha_creacion));
      setAnotaciones(servicio.anotaciones);
      setCosto(servicio.costo.toString());
      setSolicitadoPor(servicio.solicitadoPor);
      setImagenes(servicio.fotos);
      setCargadas(servicio.fotos.map(() => true));
    }
  }, [servicio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const remaining = 3 - imagenes.length;
    const nuevos = files.slice(0, remaining);
    setImagenes((prev) => [...prev, ...nuevos]);
    setCargadas((prev) => [...prev, ...Array(nuevos.length).fill(false)]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setCargadas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (servicio && tipo && fecha && costo && solicitadoPor) {
      const nuevasImagenes = imagenes.filter((img) => img instanceof File) as File[];
      onConfirm({
        ...servicio,
        tipo_gasto: tipo,
        fecha_creacion: fecha.toISOString().split('T')[0],
        anotaciones,
        costo: parseFloat(costo),
        solicitadoPor,
        nuevasImagenes,
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
      <DialogTitle>Editar servicio</DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={3}
          mt={1}
        >
          <TextField
            select
            label="Tipo de servicio"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoConsumo)}
          >
            <MenuItem value="Reparación">Reparación</MenuItem>
            <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
          </TextField>

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fecha del servicio
            </Typography>
            <DateCalendar
              value={fecha}
              onChange={(newValue) => setFecha(newValue)}
            />
          </Box>

          <TextField
            label="Costo (Q)"
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            inputProps={{ min: 0 }}
          />

          <TextField
            select
            label="Solicitado por"
            value={solicitadoPor?.id || ''}
            onChange={(e) => {
              const user = usuarios.find((u) => u.id === e.target.value);
              if (user) setSolicitadoPor(user);
            }}
            fullWidth
          >
            {usuarios.map((user) => (
              <MenuItem
                key={user.id}
                value={user.id}
              >
                {user.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Anotaciones"
            multiline
            minRows={3}
            value={anotaciones}
            onChange={(e) => setAnotaciones(e.target.value)}
          />

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Subir imágenes (máximo 3)
            </Typography>
            <Box
              component="label"
              htmlFor="upload-input"
              sx={{
                border: '2px dashed #d0d0d0',
                borderRadius: 2,
                px: 2,
                py: 4,
                textAlign: 'center',
                cursor: imagenes.length >= 3 ? 'not-allowed' : 'pointer',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                opacity: imagenes.length >= 3 ? 0.5 : 1,
                pointerEvents: imagenes.length >= 3 ? 'none' : 'auto',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: imagenes.length >= 3 ? '#f9f9f9' : '#f0f0f0',
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                Arrastra o haz clic para subir imágenes
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Máximo 3 archivos (.jpg, .png)
              </Typography>
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Box>

            {imagenes.length > 0 && (
              <Stack
                direction="row"
                spacing={2}
                mt={2}
              >
                {imagenes.map((item, i) => {
                  const src = typeof item === 'string' ? item : URL.createObjectURL(item);
                  return (
                    <Box
                      key={i}
                      sx={{ position: 'relative', width: 80, height: 80 }}
                    >
                      <Box
                        component="img"
                        src={src}
                        alt={`img-${i}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid #ccc',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(i)}
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          padding: '2px',
                          '&:hover': {
                            backgroundColor: '#eee',
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!tipo || !fecha || !costo || !solicitadoPor}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
