import { Box, Button, Modal, Stack, TextField, Card, CardHeader, Divider } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import { NuevaUnidad } from 'src/api/types';

interface ModalCrearUnidadProps {
  open: boolean;
  onClose: () => void;
  onCrearUnidad: (data: NuevaUnidad) => void;
}

export const ModalCrearUnidad: FC<ModalCrearUnidadProps> = ({ open, onClose, onCrearUnidad }) => {
  const [nombre, setNombre] = useState('');

  const handleCrearUnidad = useCallback(() => {
    if (nombre.trim()) {
      const nuevaUnidad: NuevaUnidad = { nombre };
      onCrearUnidad(nuevaUnidad);
      setNombre('');
      onClose();
    }
  }, [nombre, onCrearUnidad, onClose]);

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
          <CardHeader title="Crear nueva unidad" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre de la unidad"
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
                onClick={handleCrearUnidad}
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
