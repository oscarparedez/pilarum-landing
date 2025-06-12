import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import type { Consumo } from '../index.d';

interface Props {
  open: boolean;
  consumo: Consumo | null;
  onClose: () => void;
  onConfirm: (data: Consumo & { nuevasImagenes: File[]; fotos: string[] }) => void;
}

export const ModalEditarConsumo: FC<Props> = ({ open, consumo, onClose, onConfirm }) => {
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [reportadoPor, setReportadoPor] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [costo, setCosto] = useState('');
  const [imagenes, setImagenes] = useState<(string | File)[]>([]);

  useEffect(() => {
    if (consumo) {
      setTipo(consumo.tipo);
      setFecha(new Date(consumo.fecha));
      setCantidad(consumo.cantidad);
      setUnidad(consumo.unidad);
      setReportadoPor(consumo.reportadoPor);
      setAnotaciones(consumo.anotaciones);
      setCosto(consumo.costo.toString());
      setImagenes(consumo.fotos);
    }
  }, [consumo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevas = Array.from(e.target.files);
    const restantes = 3 - imagenes.length;
    setImagenes((prev) => [...prev, ...nuevas.slice(0, restantes)]);
    e.target.value = '';
  };

  const handleConfirm = () => {
    if (tipo && fecha && cantidad && unidad && reportadoPor && costo) {
      onConfirm({
        ...consumo!,
        tipo,
        fecha: fecha.toISOString().split('T')[0],
        cantidad,
        unidad,
        reportadoPor,
        anotaciones,
        costo: parseFloat(costo),
        nuevasImagenes: imagenes.filter((img) => typeof img !== 'string') as File[],
        fotos: imagenes.filter((img) => typeof img === 'string') as string[],
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar consumo</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <TextField label="Tipo de consumo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
          <Box>
            <Typography variant="subtitle2" gutterBottom>Fecha del consumo</Typography>
            <DateCalendar value={fecha} onChange={(newValue) => setFecha(newValue)} />
          </Box>
          <Stack direction="row" spacing={2}>
            <TextField label="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} fullWidth />
            <TextField select label="Unidad" value={unidad} onChange={(e) => setUnidad(e.target.value)} fullWidth>
              <MenuItem value="galones">galones</MenuItem>
              <MenuItem value="litros">litros</MenuItem>
            </TextField>
          </Stack>
          <TextField label="Reportado por" value={reportadoPor} onChange={(e) => setReportadoPor(e.target.value)} />
          <TextField label="Costo (Q)" type="number" value={costo} onChange={(e) => setCosto(e.target.value)} />
          <TextField label="Anotaciones" multiline minRows={3} value={anotaciones} onChange={(e) => setAnotaciones(e.target.value)} />

          <Box>
            <Typography variant="subtitle2" gutterBottom>Subir imágenes (máximo 3)</Typography>
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
              <Typography color="text.secondary">Arrastra o haz clic para subir imágenes</Typography>
              <Typography variant="caption" color="text.secondary">Máximo 3 archivos (.jpg, .png)</Typography>
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
              <Stack direction="row" spacing={2} mt={2}>
                {imagenes.map((item, i) => {
                  const src = typeof item === 'string' ? item : URL.createObjectURL(item);
                  return (
                    <Box key={i} sx={{ position: 'relative', width: 80, height: 80 }}>
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
                        onClick={() => setImagenes((prev) => prev.filter((_, idx) => idx !== i))}
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
          disabled={!tipo || !fecha || !cantidad || !unidad || !reportadoPor || !costo}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};