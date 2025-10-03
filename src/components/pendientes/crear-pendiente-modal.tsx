import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePendientesApi } from 'src/api/pendientes/usePendientesApi';
import { usePlanillaApi } from 'src/api/planilla/usePlanillaApi';
import { NuevoPendiente, Usuario } from 'src/api/types';
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
  const { getUsuarios } = usePlanillaApi();
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState<NuevoPendiente>({
    titulo: '',
    descripcion: '',
    categoria: tipo,
    referencia_id: tipo === 'proyecto' ? Number(id) || null : null,
    estado: 'no_iniciado',
    usuario_asignado: null,
  });
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (tipo === 'proyecto' && id) {
      setForm((prev) => ({
        ...prev,
        referencia_id: Number(id) || 0,
      }));
    }
  }, [id, tipo]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (open) {
        try {
          const data = await getUsuarios();
          setUsuarios(data);
        } catch (error) {
          console.error('Error fetching usuarios:', error);
        }
      }
    };
    fetchUsuarios();
  }, [open, getUsuarios]);

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
        usuario_asignado: null,
      });
      toast.success('Pendiente creado correctamente');
    } catch (error) {
      toast.error('Error al crear el pendiente');
      setLoading(false);
    }
  }, [id, form, tipo, crearPendiente, onCreated, onClose]);

  const mostrarSelectorCategoria = useMemo(() => !['oficina', 'proyecto'].includes(tipo), [tipo]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      keepMounted
    >
      <DialogTitle
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1 
        }}
      >
        Nueva tarea
        <IconButton
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
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
              
              <TextField
                label="Asignar a"
                value={form.usuario_asignado || ''}
                onChange={(e) => handleChange('usuario_asignado', e.target.value ? Number(e.target.value) : null)}
                select
                fullWidth
              >
                <MenuItem value="">Sin selección</MenuItem>
                {usuarios.map((usuario) => (
                  <MenuItem
                    key={usuario.id}
                    value={usuario.id}
                  >
                    {usuario.first_name} {usuario.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
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
      </DialogActions>
    </Dialog>
  );
};
