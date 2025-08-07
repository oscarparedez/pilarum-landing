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
import { NuevaMarca } from 'src/api/types';

interface ModalCrearMarcaProps {
  open: boolean;
  onClose: () => void;
  onCrearMarca: (data: NuevaMarca) => void;
}

export const ModalCrearMarca: FC<ModalCrearMarcaProps> = ({ open, onClose, onCrearMarca }) => {
  const [nombre, setNombre] = useState('');

  const handleCrearMarca = useCallback(() => {
    if (nombre.trim()) {
      const nuevaMarca: NuevaMarca = { nombre };
      onCrearMarca(nuevaMarca);
      setNombre('');
    }
  }, [nombre, onCrearMarca]);

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
                onClick={handleCrearMarca}
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
