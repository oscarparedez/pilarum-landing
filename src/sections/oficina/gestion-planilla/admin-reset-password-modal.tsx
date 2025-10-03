import { FC, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy, Refresh } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { Usuario } from 'src/api/types';

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: Usuario;
  onConfirm: (password: string) => void;
}

// Función para generar contraseña temporal segura
const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let password = '';

  // Asegurar al menos: 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';

  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Completar hasta 12 caracteres
  for (let i = 4; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  // Mezclar los caracteres
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

export const ModalAdminResetPassword: FC<Props> = ({ open, onClose, usuario, onConfirm }) => {
  const [tempPassword, setTempPassword] = useState(() => generateTempPassword());
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGenerateNew = useCallback(() => {
    setTempPassword(generateTempPassword());
    toast.success('Nueva contraseña temporal generada');
  }, []);

  const handleCopyPassword = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      toast.success('Contraseña copiada al portapapeles');
    } catch (error) {
      toast.error('No se pudo copiar la contraseña');
    }
  }, [tempPassword]);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirm(tempPassword);
      onClose();
      // Generar nueva contraseña para el próximo uso
      setTempPassword(generateTempPassword());
    } catch (error) {
      // El error ya se maneja en el componente padre
    } finally {
      setIsLoading(false);
    }
  }, [tempPassword, onConfirm, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
      // Reset para próximo uso
      setTempPassword(generateTempPassword());
      setShowPassword(false);
    }
  }, [onClose, isLoading]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      keepMounted
    >
      <DialogTitle sx={{ pb: 1 }}>Restablecer contraseña</DialogTitle>

      <DialogContent
        dividers
        sx={{ pt: 2 }}
      >
        <Stack spacing={3}>
          <Alert
            severity="info"
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              Se generará una contraseña temporal para{' '}
              <strong>
                {usuario.first_name} {usuario.last_name}
              </strong>{' '}
              (@{usuario.username}). El usuario podrá iniciar sesión con esta contraseña y después
              cambiarla por una de su elección.
            </Typography>
          </Alert>

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              color="text.secondary"
            >
              Contraseña temporal generada:
            </Typography>

            <TextField
              fullWidth
              value={tempPassword}
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              InputProps={{
                readOnly: true,
                sx: {
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton
                      onClick={handleCopyPassword}
                      edge="end"
                      size="small"
                      title="Copiar contraseña"
                    >
                      <ContentCopy />
                    </IconButton>
                    <IconButton
                      onClick={handleGenerateNew}
                      edge="end"
                      size="small"
                      title="Generar nueva contraseña"
                    >
                      <Refresh />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Importante:</strong>
              <br />• Comparte esta contraseña de forma segura con el usuario • La contraseña es
              temporal y debe cambiarse en el primer inicio de sesión • Guarda o copia la contraseña
              antes de confirmar
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isLoading}
          color="primary"
        >
          {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
