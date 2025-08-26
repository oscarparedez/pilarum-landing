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
import { FC, useCallback, useState } from 'react';
import { NuevoProveedor } from 'src/api/types';

interface ModalCrearProveedorProps {
  open: boolean;
  onClose: () => void;
  onCrearProveedor: (data: NuevoProveedor) => void;
}

export const ModalCrearProveedor: FC<ModalCrearProveedorProps> = ({ open, onClose, onCrearProveedor }) => {
  const [nombre, setNombre] = useState('');

  const handleCrearProveedor = useCallback(() => {
    if (nombre.trim()) {
      const nuevaProveedor: NuevoProveedor = { nombre };
      onCrearProveedor(nuevaProveedor);
      setNombre('');
    }
  }, [nombre, onCrearProveedor]);

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
          <CardHeader title="Crear nueva proveedor" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre del proveedor"
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
                onClick={handleCrearProveedor}
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
