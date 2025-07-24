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
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { NuevaRevision, Revision } from 'src/api/types';

interface ModalEditarRevisionProps {
  open: boolean;
  revision: Revision;
  onClose: () => void;
  onConfirm: (id: number, data: NuevaRevision) => Promise<void>;
}

export const ModalEditarRevision: FC<ModalEditarRevisionProps> = ({
  open,
  revision,
  onClose,
  onConfirm,
}) => {
  const [titulo, setTitulo] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [fotos, setFotos] = useState<(string | File)[]>([]);
  const [cargadas, setCargadas] = useState<boolean[]>([]);

  useEffect(() => {
    if (revision) {
      setTitulo(revision.titulo);
      setAnotaciones(revision.anotaciones);
      setFecha(revision.fecha_review ? new Date(revision.fecha_review + 'T12:00:00') : null);
      setFotos(revision.fotos.map((f) => f.imagen));
      setCargadas(revision.fotos.map(() => true));
    }
  }, [revision]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevos = Array.from(e.target.files);
    const restantes = 3 - fotos.length;
    const nuevosLimitados = nuevos.slice(0, restantes);
    setFotos((prev) => [...prev, ...nuevosLimitados]);
    setCargadas((prev) => [...prev, ...Array(nuevosLimitados.length).fill(false)]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
    setCargadas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (!titulo || !anotaciones || !fecha) return;

    const nuevasImagenes = fotos.filter((f) => f instanceof File) as File[];

    onConfirm(revision.id, {
      titulo,
      anotaciones,
      fecha_review: fecha.toISOString().split('T')[0],
      fotos: nuevasImagenes,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar revisión</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <TextField
            fullWidth
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <TextField
            fullWidth
            label="Anotaciones"
            multiline
            minRows={3}
            value={anotaciones}
            onChange={(e) => setAnotaciones(e.target.value)}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Fecha de la revisión
            </Typography>
            <DateCalendar value={fecha} onChange={(newValue) => setFecha(newValue)} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
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
              <Typography variant="caption" color="text.secondary">
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
              <Stack direction="row" spacing={2} mt={2}>
                {fotos.map((item, i) => {
                  const src = typeof item === 'string' ? item : URL.createObjectURL(item);
                  return (
                    <Box key={i} sx={{ position: 'relative', width: 80, height: 80 }}>
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
          disabled={!titulo || !anotaciones || !fecha}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
