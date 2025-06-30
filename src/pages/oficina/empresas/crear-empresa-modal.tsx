import {
  Box,
  Button,
  Modal,
  Card,
  CardHeader,
  Divider,
  TextField,
  Stack,
} from '@mui/material';
import { FC, useState } from 'react';

interface ModalCrearEmpresaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { nombre: string }) => void;
}

export const ModalCrearEmpresa: FC<ModalCrearEmpresaProps> = ({ open, onClose, onConfirm }) => {
  const [nombre, setNombre] = useState('');

  const handleConfirm = () => {
    if (!nombre.trim()) return;
    onConfirm({ nombre: nombre.trim() });
    setNombre('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          <CardHeader title="Crear nueva empresa" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre de la empresa"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onClose}>Cancelar</Button>
              <Button variant="contained" onClick={handleConfirm}>Confirmar</Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
};
