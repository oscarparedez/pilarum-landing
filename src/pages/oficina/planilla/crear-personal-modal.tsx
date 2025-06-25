import { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { Personal } from './index.d';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (persona: Personal) => void;
}

const ROLES = ['Ingeniero', 'Arquitecto', 'Supervisor'];

export const ModalRegistrarPersona: FC<Props> = ({ open, onClose, onConfirm }) => {
  const [form, setForm] = useState<
    Omit<Personal, 'id_usuario' | 'fecha_creacion' | 'usuario_registro'>
  >({
    nombre: '',
    telefono: '',
    rol: '',
    estado: 'Activo',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    const nuevaPersona: Personal = {
      ...form,
      id_usuario: Math.random().toString(36).substring(2, 9),
      fecha_creacion: new Date().toISOString().split('T')[0],
      usuario_registro: 'admin',
    };
    onConfirm(nuevaPersona);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Registrar nueva persona</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre completo"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          select
          fullWidth
          label="Rol / especialidad"
          name="rol"
          value={form.rol}
          onChange={handleChange}
          margin="normal"
        >
          {ROLES.map((rol) => (
            <MenuItem
              key={rol}
              value={rol}
            >
              {rol}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Estado"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="Activo">Activo</MenuItem>
          <MenuItem value="Inactivo">Inactivo</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
