import { FC, use, useCallback, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { NuevoUsuarioConPassword, Rol, Usuario } from 'src/api/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevoUsuarioConPassword) => Promise<void>;
  roles: Rol[];
}

export const ModalRegistrarPersona: FC<Props> = ({ open, roles, onClose, onConfirm }) => {
  const [form, setForm] = useState<NuevoUsuarioConPassword>({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    telefono: '',
    groups: [],
    is_active: true,
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: name === 'groups' ? [Number(value)] : value,
      }));
    },
    [setForm]
  );

  const handleGuardar = useCallback(async () => {
    await onConfirm(form);
    setForm({
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      telefono: '',
      groups: [],
      is_active: true,
    });
  }, [form, onConfirm]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      keepMounted
    >
      <DialogTitle>Registrar nuevo usuario</DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
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
          label="Rol"
          name="groups"
          value={form.groups[0]}
          onChange={handleChange}
          margin="normal"
        >
          {roles.map((rol) => (
            <MenuItem
              key={rol.id}
              value={rol.id}
            >
              {rol.name}
            </MenuItem>
          ))}
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
            !form.groups.length
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
