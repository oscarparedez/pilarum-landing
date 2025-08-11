import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Stack,
  Card,
  CardHeader,
  Divider,
  CardContent,
  CardActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePendientesApi } from 'src/api/pendientes/usePendientesApi';
import { NuevoPendiente } from 'src/api/types';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  tipo: 'oficina' | 'proyecto';
  onCreated?: () => Promise<void>;
}

const categorias = [
  { value: 'proyecto', label: 'Proyecto' },
  { value: 'maquinaria', label: 'Maquinaria' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'otro', label: 'Otro' },
];

export const ModalCrearPendiente: FC<Props> = ({ open, onClose, tipo, onCreated }) => {
  const { crearPendiente } = usePendientesApi();
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState<NuevoPendiente>({
    titulo: '',
    descripcion: '',
    categoria: tipo,
    referencia_id: tipo === 'proyecto' ? Number(id) || null : null,
    estado: 'no_iniciado',
  });

  useEffect(() => {
    if (tipo === 'proyecto' && id) {
      setForm((prev) => ({
        ...prev,
        referencia_id: Number(id) || 0,
      }));
    }
  }, [id, tipo]);

  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((field: keyof NuevoPendiente, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.titulo.trim()) {
      toast.error('Por favor, completa el título.');
      return;
    }
    try {
      setLoading(true);
      await crearPendiente(form);
      setLoading(false);
      if (onCreated) await onCreated();
      onClose();
      setForm({
        titulo: '',
        descripcion: '',
        categoria: tipo,
        referencia_id: tipo === 'proyecto' ? Number(id) || null : null,
        estado: 'no_iniciado',
      });
      toast.success('Pendiente creado correctamente');
    } catch (error) {
      toast.error('Error al crear el pendiente');
      setLoading(false);
    }
  }, [form, crearPendiente, onCreated, onClose]);

  const mostrarSelectorCategoria = useMemo(() => !['oficina', 'proyecto'].includes(tipo), [tipo]);

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: 500,
        }}
      >
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardHeader
            title="Nueva tarea"
            action={
              <IconButton
                onClick={onClose}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            }
            sx={{ pb: 1 }}
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Descripción"
                value={form.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />

              {mostrarSelectorCategoria && (
                <TextField
                  label="Categoría"
                  value={form.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                  select
                  fullWidth
                  required
                >
                  {categorias.map((c) => (
                    <MenuItem
                      key={c.value}
                      value={c.value}
                    >
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
            <Button
              onClick={onClose}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear'}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
