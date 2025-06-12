import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Revision } from '../index.d';

interface ModalEditarRevisionProps {
  open: boolean;
  revision: Revision | null;
  onClose: () => void;
  onConfirm: (data: Revision & { nuevasImagenes: File[] }) => void;
}

export const ModalEditarRevision: FC<ModalEditarRevisionProps> = ({
  open,
  revision,
  onClose,
  onConfirm,
}) => {
  const [responsable, setResponsable] = useState('');
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [anotaciones, setAnotaciones] = useState('');
  const [imagenes, setImagenes] = useState<(string | File)[]>([]);

  useEffect(() => {
    if (revision) {
      setResponsable(revision.responsable);
      setFecha(new Date(revision.fecha));
      setAnotaciones(revision.anotaciones);
      setImagenes(revision.imagenes);
    }
  }, [revision]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevos = Array.from(e.target.files);
    const restantes = 3 - imagenes.length;
    const nuevosLimitados = nuevos.slice(0, restantes);
    setImagenes((prev) => [...prev, ...nuevosLimitados]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (!revision || !fecha || !responsable) return;
    const nuevasImagenes = imagenes.filter((img) => img instanceof File) as File[];
    onConfirm({
      ...revision,
      responsable,
      fecha: fecha.toISOString().split('T')[0],
      anotaciones,
      nuevasImagenes,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Editar revisión</DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={3}
          mt={1}
        >
          <TextField
            label="Responsable"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            fullWidth
          />

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fecha de la revisión
            </Typography>
            <DateCalendar
              value={fecha}
              onChange={setFecha}
            />
          </Box>

          <TextField
            label="Anotaciones"
            multiline
            minRows={3}
            value={anotaciones}
            onChange={(e) => setAnotaciones(e.target.value)}
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
          disabled={!responsable || !fecha}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
