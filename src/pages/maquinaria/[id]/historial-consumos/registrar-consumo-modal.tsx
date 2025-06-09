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
import { FC, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

interface ModalRegistrarConsumoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    tipo: string;
    fecha: string;
    cantidad: string;
    unidad: string;
    reportadoPor: string;
    anotaciones: string;
    costo: number;
    imagenes: File[];
  }) => void;
}

export const ModalRegistrarConsumo: FC<ModalRegistrarConsumoProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [tipo, setTipo] = useState('Diesel');
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('galones');
  const [reportadoPor, setReportadoPor] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [costo, setCosto] = useState('');
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [cargadas, setCargadas] = useState<boolean[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const nuevas = selected.slice(0, 3 - imagenes.length);
    setImagenes((prev) => [...prev, ...nuevas]);
    setCargadas((prev) => [...prev, ...Array(nuevas.length).fill(false)]);
    e.target.value = '';
  };

  const handleClose = () => {
    setTipo('Diesel');
    setFecha(new Date());
    setCantidad('');
    setUnidad('galones');
    setReportadoPor('');
    setAnotaciones('');
    setCosto('');
    setImagenes([]);
    setCargadas([]);
    onClose();
  };

  const handleConfirm = () => {
    if (tipo && fecha && cantidad && unidad && reportadoPor && costo) {
      onConfirm({
        tipo,
        fecha: fecha.toISOString().split('T')[0],
        cantidad,
        unidad,
        reportadoPor,
        anotaciones,
        costo: parseFloat(costo),
        imagenes,
      });
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Registrar consumo</DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={3}
          mt={1}
        >
          <TextField
            label="Tipo de consumo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />

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

          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              label="Cantidad"
              type="text"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Unidad"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              fullWidth
            >
              <MenuItem value="galones">galones</MenuItem>
              <MenuItem value="litros">litros</MenuItem>
            </TextField>
          </Stack>

          <TextField
            label="Reportado por"
            value={reportadoPor}
            onChange={(e) => setReportadoPor(e.target.value)}
            fullWidth
          />

          <TextField
            label="Costo (Q)"
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            inputProps={{ min: 0 }}
            fullWidth
          />

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
                {imagenes.map((file, i) => {
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
                          setImagenes((prev) => prev.filter((_, idx) => idx !== i));
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
          disabled={!tipo || !fecha || !cantidad || !unidad || !reportadoPor || !costo}
        >
          Guardar consumo
        </Button>
      </DialogActions>
    </Dialog>
  );
};
