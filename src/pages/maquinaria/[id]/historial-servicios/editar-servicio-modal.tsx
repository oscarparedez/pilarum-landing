import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ActualizarGastoOperativo, GastoOperativo, TipoDocumento } from 'src/api/types';
import { format } from 'date-fns';

interface ModalEditarServicioProps {
  open: boolean;
  servicio: GastoOperativo;
  onClose: () => void;
  onConfirm: (id: number, data: ActualizarGastoOperativo) => Promise<void> | void;
}

type FotoExistente = { id: number; url: string };
type FotoNueva = { file: File; preview: string; loaded: boolean };

export const ModalEditarServicio: FC<ModalEditarServicioProps> = ({
  open,
  servicio,
  onClose,
  onConfirm,
}) => {
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState<number>(0);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento | ''>('');

  // imágenes separadas
  const [existentes, setExistentes] = useState<FotoExistente[]>([]);
  const [nuevas, setNuevas] = useState<FotoNueva[]>([]);

  const mantenerIds = useMemo(() => existentes.map((f) => f.id), [existentes]);
  const maxFotos = 3;
  const totalFotos = existentes.length + nuevas.length;

  useEffect(() => {
    if (!servicio) return;
    setFecha(servicio.fecha_gasto ? new Date(servicio.fecha_gasto) : null);
    setDescripcion(servicio.descripcion || '');
    setCosto(servicio.costo || 0);
    setTipoDocumento(servicio.tipo_documento || '');

    const ex: FotoExistente[] = (servicio.fotos || []).map((f: any) => ({
      id: f.id,
      url: f.imagen,
    }));
    setExistentes(ex);
    setNuevas([]);
  }, [servicio]);

  useEffect(() => {
    return () => {
      nuevas.forEach((n) => URL.revokeObjectURL(n.preview));
    };
  }, [nuevas]);

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

  const handleRemove = (indexGlobal: number) => {
    // grid: primero existentes, luego nuevas
    if (indexGlobal < existentes.length) {
      setExistentes((prev) => prev.filter((_, i) => i !== indexGlobal)); // saca del mantener_ids
    } else {
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
    if (!fecha || !descripcion || !costo || !tipoDocumento) return;

    const payload: ActualizarGastoOperativo = {
      descripcion,
      fecha: format(fecha, 'yyyy-MM-dd'),
      costo,
      tipo_gasto: 2,
      tipo_documento: tipoDocumento as TipoDocumento,
      mantener_ids: mantenerIds,
      fotos: nuevas.map((n) => n.file),
    };

    console.log("mantener ids on submit:", payload.mantener_ids);

    try {
      await onConfirm(servicio.id, payload);
    } catch (e) {
      console.error('Error actualizando servicio:', e);
    } finally {
      // cerrar SIEMPRE
      onClose();
      // liberar previews
      nuevas.forEach((n) => URL.revokeObjectURL(n.preview));
    }
  };

  const gridItems = useMemo(
    () => [
      ...existentes.map((f) => ({ kind: 'existente' as const, src: f.url })),
      ...nuevas.map((f) => ({ kind: 'nueva' as const, src: f.preview })),
    ],
    [existentes, nuevas]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar servicio</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Fecha del servicio
            </Typography>
            <DateCalendar value={fecha} onChange={(v) => setFecha(v)} />
          </Box>

          <TextField
            label="Tipo de documento"
            select
            fullWidth
            required
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
          >
            <MenuItem value="cheque">Cheque</MenuItem>
            <MenuItem value="efectivo">Efectivo</MenuItem>
            <MenuItem value="transferencia">Transferencia</MenuItem>
          </TextField>

          <TextField
            label="Costo (Q)"
            type="number"
            value={costo}
            onChange={(e) => setCosto(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />

          <TextField
            label="Descripción"
            multiline
            minRows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Subir imágenes (máximo 3)
            </Typography>
            <Box
              component="label"
              htmlFor="upload-input-servicio"
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
                '&:hover': { backgroundColor: totalFotos >= maxFotos ? '#f9f9f9' : '#f0f0f0' },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Typography color="text.secondary">Arrastra o haz clic para subir imágenes</Typography>
              <Typography variant="caption" color="text.secondary">
                Máximo 3 archivos (.jpg, .png, .heic)
              </Typography>
              <input
                id="upload-input-servicio"
                type="file"
                accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Box>

            {gridItems.length > 0 && (
              <Stack direction="row" spacing={2} mt={2}>
                {gridItems.map((item, i) => (
                  <Box key={i} sx={{ position: 'relative', width: 80, height: 80 }}>
                    {item.kind === 'nueva' && !nuevas[i - existentes.length]?.loaded && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
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
                              if (copy[idxNueva]) copy[idxNueva] = { ...copy[idxNueva], loaded: true };
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

                    <IconButton
                      size="small"
                      onClick={() => handleRemove(i)}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        p: '2px',
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
          disabled={!descripcion || !fecha || !costo || !tipoDocumento}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
