import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Card,
  CardHeader,
  Divider,
} from '@mui/material';
import { FC, useState } from 'react';

interface ModalCrearMarcaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { nombre: string }) => void;
}

export const ModalCrearMarca: FC<ModalCrearMarcaProps> = ({ open, onClose, onConfirm }) => {
  const [nombre, setNombre] = useState('');

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onConfirm({ nombre: nombre.trim() });
    setNombre('');
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
          <CardHeader title="Crear nueva marca" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre de la marca"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
            >
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!nombre.trim()}
              >
                Crear
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
};
