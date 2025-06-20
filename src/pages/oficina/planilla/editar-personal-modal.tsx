import { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import { Personal } from './index.d';
import { ModalCambiarContrasena } from './cambiar-contrasena-modal';

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: Personal;
  onConfirm: (persona: Personal) => void;
}

const ROLES = ['Ingeniero', 'Arquitecto', 'Supervisor'];

export const ModalEditarPersona: FC<Props> = ({ open, onClose, initialData, onConfirm }) => {
  const [form, setForm] = useState<Personal>(initialData);
  const [modalContrasenaAbierto, setModalContrasenaAbierto] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    onConfirm(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar persona</DialogTitle>
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
            <MenuItem key={rol} value={rol}>
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
        <Button
          variant="text"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setModalContrasenaAbierto(true)}
        >
          Cambiar contraseña
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar}>
          Guardar cambios
        </Button>
      </DialogActions>

      <ModalCambiarContrasena
        open={modalContrasenaAbierto}
        onClose={() => setModalContrasenaAbierto(false)}
        onConfirm={(nueva) => {
          console.log(`Contraseña nueva para ${form.nombre}: ${nueva}`);
          setModalContrasenaAbierto(false);
        }}
      />
    </Dialog>
  );
};