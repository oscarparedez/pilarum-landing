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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { CustomDateCalendar } from 'src/components/custom-date-components';
import { NuevaRevision } from 'src/api/types';
import { format } from 'date-fns';

interface ModalAgregarRevisionProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevaRevision) => void;
}

export const ModalAgregarRevision: FC<ModalAgregarRevisionProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [titulo, setTitulo] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [fotos, setFotos] = useState<File[]>([]);
  const [cargadas, setCargadas] = useState<boolean[]>([]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const nuevas = selected.slice(0, 3 - fotos.length);
    setFotos((prev) => [...prev, ...nuevas]);
    setCargadas((prev) => [...prev, ...Array(nuevas.length).fill(false)]);
    e.target.value = '';
  };

  const handleClose = () => {
    setTitulo('');
    setAnotaciones('');
    setFecha(new Date());
    setFotos([]);
    setCargadas([]);
    onClose();
  };

  const handleConfirm = () => {
    if (titulo && anotaciones && fecha && fotos.length > 0) {
      const data: NuevaRevision = {
        titulo,
        anotaciones,
        fecha_review: format(fecha, 'yyyy-MM-dd'),
        fotos,
      };
      onConfirm(data);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      keepMounted
    >
      <DialogTitle>Agregar revisión</DialogTitle>
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
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fecha de la revisión
            </Typography>
            <CustomDateCalendar
              value={fecha}
              onChange={(newValue) => setFecha(newValue)}
            />
          </Box>

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
                Máximo 3 archivos (.jpg, .png, .heic)
              </Typography>
              <input
                id="upload-input"
                type="file"
                accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
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
                {fotos.map((file, i) => {
                  const src = URL.createObjectURL(file);
                  return (
                    <Box
                      key={i}
                      sx={{ position: 'relative', width: 80, height: 80 }}
                    >
                      {!cargadas[i] && (
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
                          setCargadas((prev) => {
                            const updated = [...prev];
                            updated[i] = true;
                            return updated;
                          });
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
                        onClick={() => {
                          setFotos((prev) => prev.filter((_, idx) => idx !== i));
                          setCargadas((prev) => prev.filter((_, idx) => idx !== i));
                        }}
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
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!titulo || !anotaciones || !fecha || fotos.length === 0}
        >
          Guardar revisión
        </Button>
      </DialogActions>
    </Dialog>
  );
};
