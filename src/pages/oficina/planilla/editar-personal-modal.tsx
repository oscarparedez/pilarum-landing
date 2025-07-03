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
import { Usuario } from './index.d';
import { ModalCambiarContrasena } from './cambiar-contrasena-modal';

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: Usuario;
  onConfirm: (persona: Usuario) => void;
}

const ROLES = ['Ingeniero', 'Arquitecto', 'Supervisor'];
const ROL_GRUPO_MAP: Record<string, number> = {
  Ingeniero: 1,
  Arquitecto: 2,
  Supervisor: 3,
};

export const ModalEditarPersona: FC<Props> = ({ open, onClose, initialData, onConfirm }) => {
  const [form, setForm] = useState<Usuario>(initialData);
  const [modalContrasenaAbierto, setModalContrasenaAbierto] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'rol') {
        updated.groups = [ROL_GRUPO_MAP[value]];
      }
      return updated;
    });
  };

  const handleGuardar = () => {
    onConfirm(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Editar persona</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre(s)"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Apellido(s)"
          name="last_name"
          value={form.last_name}
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
        <Button
          variant="contained"
          onClick={handleGuardar}
        >
          Guardar cambios
        </Button>
      </DialogActions>

      <ModalCambiarContrasena
        open={modalContrasenaAbierto}
        onClose={() => setModalContrasenaAbierto(false)}
        onConfirm={(nueva) => {
          console.log(`Contraseña nueva para ${form.username}: ${nueva}`);
          setModalContrasenaAbierto(false);
        }}
      />
    </Dialog>
  );
};
