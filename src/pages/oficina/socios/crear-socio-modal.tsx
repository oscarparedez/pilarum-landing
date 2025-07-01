import {
  Box,
  Button,
  Modal,
  Card,
  CardHeader,
  Divider,
  TextField,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

interface ModalCrearSocioProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { nombre: string; tipo: 'interno' | 'externo' }) => void;
}

export const ModalCrearSocio: FC<ModalCrearSocioProps> = ({ open, onClose, onConfirm }) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'interno' | 'externo'>('interno');

  const handleConfirm = () => {
    if (!nombre.trim()) return;
    onConfirm({ nombre: nombre.trim(), tipo });
    setNombre('');
    setTipo('interno');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: 500,
          p: 2,
        }}
      >
        <Card>
          <CardHeader title="Crear nuevo socio" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre del socio"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1 }}
              >
                Tipo de socio
              </Typography>
              <ToggleButtonGroup
                value={tipo}
                exclusive
                onChange={(_, newTipo) => {
                  if (newTipo) setTipo(newTipo);
                }}
                fullWidth
              >
                <ToggleButton
                  value="interno"
                  sx={{ textTransform: 'none' }}
                >
                  Interno
                </ToggleButton>
                <ToggleButton
                  value="externo"
                  sx={{ textTransform: 'none' }}
                >
                  Externo
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
              >
                Confirmar
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
};
