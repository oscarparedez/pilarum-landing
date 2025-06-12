import { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
  useTheme,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface Props {
  type: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalEliminar: FC<Props> = ({ type = '', open, onClose, onConfirm }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 3,
          width: 420,
          textAlign: 'center',
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <WarningAmberRoundedIcon sx={{ fontSize: 48, color: theme.palette.warning.main, mb: 1 }} />
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem', pb: 1 }}>
          ¿ Eliminar {type} ?
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ mt: 2, justifyContent: 'center' }}>
          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              color="error"
              sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Confirmar
            </Button>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
