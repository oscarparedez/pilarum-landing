import { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { new_password: string; old_password: string }) => void;
}

export const ModalCambiarContrasena: FC<Props> = ({ open, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGuardar = () => {
    onConfirm({ new_password: password, old_password: oldPassword });
    setPassword('');
    setOldPassword('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
      keepMounted
    >
      <DialogTitle>Cambiar contraseña</DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
        <TextField
          fullWidth
          label="Contraseña actual"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Nueva contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={!password.trim() || (!oldPassword.trim())}
        >
          Guardar contraseña
        </Button>
      </DialogActions>
    </Dialog>
  );
};
