import { FC, useEffect, useMemo, useState } from 'react';
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
import { ActualizarRevision, Revision } from 'src/api/types';
import { format } from 'date-fns';

interface ModalEditarRevisionProps {
  open: boolean;
  revision: Revision;
  onClose: () => void;
  onConfirm: (id: number, data: ActualizarRevision) => Promise<void>;
}

type FotoExistente = { id: number; url: string };
type FotoNueva = { file: File; preview: string; loaded: boolean };

export const ModalEditarRevision: FC<ModalEditarRevisionProps> = ({
  open,
  revision,
  onClose,
  onConfirm,
}) => {
  const [titulo, setTitulo] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [fecha, setFecha] = useState<Date | null>(new Date());

  // Separar estado entre existentes y nuevas
  const [existentes, setExistentes] = useState<FotoExistente[]>([]);
  const [nuevas, setNuevas] = useState<FotoNueva[]>([]);

  // mantener_ids = ids de las existentes visibles
  const mantenerIds = useMemo(() => existentes.map((f) => f.id), [existentes]);

  // Cargar datos iniciales desde la revisión
  useEffect(() => {
    if (!revision) return;
    setTitulo(revision.titulo || '');
    setAnotaciones(revision.anotaciones || '');
    setFecha(revision.fecha_review ? new Date(revision.fecha_review) : null);

    // Asumimos que revision.fotos = [{ id, imagen }]
    const existentesIniciales: FotoExistente[] = (revision.fotos || []).map((f: any) => ({
      id: f.id,
      url: f.imagen,
    }));
    setExistentes(existentesIniciales);
    setNuevas([]); // limpiar nuevas al abrir
  }, [revision]);

  // Limpiar object URLs al desmontar o al cambiar nuevas
  useEffect(() => {
    return () => {
      nuevas.forEach((n) => URL.revokeObjectURL(n.preview));
    };
  }, [nuevas]);

  const totalFotos = existentes.length + nuevas.length;
  const maxFotos = 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const archivos = Array.from(e.target.files);
    const restantes = Math.max(0, maxFotos - totalFotos);
    const aAgregar = archivos.slice(0, restantes);

    const nuevasFotos: FotoNueva[] = aAgregar.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      loaded: false,
    }));

    setNuevas((prev) => [...prev, ...nuevasFotos]);
    e.target.value = '';
  };

  /** Quitar foto por índice del "grid combinado" */
  const handleRemove = (indexGlobal: number) => {
    // El grid muestra primero las existentes y luego las nuevas.
    if (indexGlobal < existentes.length) {
      // Eliminar existente (afecta mantener_ids)
      setExistentes((prev) => prev.filter((_, i) => i !== indexGlobal));
    } else {
      // Eliminar nueva
      const idxNueva = indexGlobal - existentes.length;
      setNuevas((prev) => {
        const copy = [...prev];
        const [removed] = copy.splice(idxNueva, 1);
        if (removed) URL.revokeObjectURL(removed.preview);
        return copy;
      });
    }
  };

  const handleConfirm = async () => {
    if (!titulo || !anotaciones || !fecha) return;

    const payload: ActualizarRevision = {
      titulo,
      anotaciones,
      fecha_review: format(fecha, 'yyyy-MM-dd'),
      mantener_ids: mantenerIds,
      fotos: nuevas.map((n) => n.file),
    };

    onClose();
    await onConfirm(revision.id, payload);
  };

  // Construir arreglo combinado para pintar (existentes primero)
  const gridItems = useMemo(
    () => [
      ...existentes.map((f) => ({ kind: 'existente' as const, src: f.url })),
      ...nuevas.map((f) => ({ kind: 'nueva' as const, src: f.preview })),
    ],
    [existentes, nuevas]
  );

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
            <DateCalendar
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
                cursor: totalFotos >= maxFotos ? 'not-allowed' : 'pointer',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                opacity: totalFotos >= maxFotos ? 0.5 : 1,
                pointerEvents: totalFotos >= maxFotos ? 'none' : 'auto',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: totalFotos >= maxFotos ? '#f9f9f9' : '#f0f0f0',
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

            {gridItems.length > 0 && (
              <Stack
                direction="row"
                spacing={2}
                mt={2}
              >
                {gridItems.map((item, i) => (
                  <Box
                    key={i}
                    sx={{ position: 'relative', width: 80, height: 80 }}
                  >
                    {/* Loader solo para nuevas mientras cargan */}
                    {item.kind === 'nueva' && !nuevas[i - existentes.length]?.loaded && (
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
                      src={item.src}
                      alt={`preview-${i}`}
                      onLoad={() => {
                        if (item.kind === 'nueva') {
                          const idxNueva = i - existentes.length;
                          if (idxNueva >= 0) {
                            setNuevas((prev) => {
                              const copy = [...prev];
                              if (copy[idxNueva])
                                copy[idxNueva] = { ...copy[idxNueva], loaded: true };
                              return copy;
                            });
                          }
                        }
                      }}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #ccc',
                        display:
                          item.kind === 'nueva'
                            ? nuevas[i - existentes.length]?.loaded
                              ? 'block'
                              : 'none'
                            : 'block',
                      }}
                    />

                    {/* Botón X: elimina y, si era existente, también la saca de mantener_ids */}
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
                        '&:hover': { backgroundColor: '#eee' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
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
