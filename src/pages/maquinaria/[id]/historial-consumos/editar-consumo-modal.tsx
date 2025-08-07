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
  CircularProgress,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { GastoOperativo, NuevoGastoOperativo } from 'src/api/types';
import { format } from 'date-fns';

interface ModalEditarConsumoProps {
  open: boolean;
  consumo: GastoOperativo;
  onClose: () => void;
  onConfirm: (id: number, data: NuevoGastoOperativo) => void;
}

export const ModalEditarConsumo: FC<ModalEditarConsumoProps> = ({
  open,
  consumo,
  onClose,
  onConfirm,
}) => {
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState<number>(0);
  const [fotos, setFotos] = useState<(string | File)[]>([]);
  const [cargadas, setCargadas] = useState<boolean[]>([]);

  useEffect(() => {
    if (consumo) {
      setFecha(consumo.fecha_gasto ? new Date(consumo.fecha_gasto) : null);
      setDescripcion(consumo.descripcion);
      setCosto(consumo.costo);
      setFotos(consumo.fotos?.map((f) => f.imagen) ?? []);
      setCargadas(consumo.fotos?.map(() => true) ?? []);
    }
  }, [consumo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevas = Array.from(e.target.files);
    const restantes = 3 - fotos.length;
    setFotos((prev) => [...prev, ...nuevas.slice(0, restantes)]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
    setCargadas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (fecha && descripcion && costo) {
      if (!descripcion || !fecha) return;
      const nuevasImagenes = fotos.filter((f) => f instanceof File) as File[];
      onConfirm(consumo.id, {
        tipo_gasto: 1, // 1 = combustible
        fecha: format(fecha, 'yyyy-MM-dd'),
        descripcion,
        costo,
        fotos: nuevasImagenes,
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
      <DialogTitle>Editar consumo</DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={3}
          mt={1}
        >
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fecha del consumo
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
            onChange={(e) => setCosto(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />

          <TextField
            label="descripcion"
            multiline
            minRows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
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
                cursor: fotos.length >= 3 ? 'not-allowed' : 'pointer',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                opacity: fotos.length >= 3 ? 0.5 : 1,
                pointerEvents: fotos.length >= 3 ? 'none' : 'auto',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: fotos.length >= 3 ? '#f9f9f9' : '#f0f0f0',
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

            {fotos.length > 0 && (
              <Stack
                direction="row"
                spacing={2}
                mt={2}
              >
                {fotos.map((item, i) => {
                  const src = typeof item === 'string' ? item : URL.createObjectURL(item);
                  return (
                    <Box
                      key={i}
                      sx={{ position: 'relative', width: 80, height: 80 }}
                    >
                      {!cargadas[i] && item instanceof File && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1,
                            border: '1px solid #ccc',
                          }}
                        >
                          <CircularProgress size={24} />
                        </Box>
                      )}
                      <Box
                        component="img"
                        src={src}
                        alt={`preview-${i}`}
                        onLoad={() => {
                          if (item instanceof File) {
                            setCargadas((prev) => {
                              const updated = [...prev];
                              updated[i] = true;
                              return updated;
                            });
                          }
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid #ccc',
                          display: cargadas[i] ? 'block' : 'none',
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
          disabled={!descripcion || !fecha || !costo}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
