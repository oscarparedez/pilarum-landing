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

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Usuario) => void;
}

const ROLES = ['Ingeniero', 'Arquitecto', 'Supervisor'];
const ROL_GRUPO_MAP: Record<string, number> = {
  Ingeniero: 1,
  Arquitecto: 2,
  Supervisor: 3,
};

export const ModalRegistrarPersona: FC<Props> = ({ open, onClose, onConfirm }) => {
  const [form, setForm] = useState<Omit<Usuario, 'groups'>>({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    telefono: '',
    rol: '',
    estado: 'Activo',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = () => {
    const groups = form.rol ? [ROL_GRUPO_MAP[form.rol]] : [];
    const data: Usuario = {
      ...form,
      groups,
    };
    onConfirm(data);
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
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
        />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={
            !form.username ||
            !form.password ||
            !form.first_name ||
            !form.last_name ||
            !form.telefono ||
            !form.rol
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
