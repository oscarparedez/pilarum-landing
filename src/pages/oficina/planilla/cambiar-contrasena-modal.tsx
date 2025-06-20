import { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (nuevaContrasena: string) => void;
}

export const ModalCambiarContrasena: FC<Props> = ({ open, onClose, onConfirm }) => {
  const [contrasena, setContrasena] = useState('');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cambiar contraseña</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nueva contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(contrasena)}
          disabled={!contrasena.trim()}
        >
          Guardar contraseña
        </Button>
      </DialogActions>
    </Dialog>
  );
};