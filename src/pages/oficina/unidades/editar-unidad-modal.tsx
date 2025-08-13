import { Box, Button, Modal, Stack, TextField, Card, CardHeader, Divider } from '@mui/material';
import { FC, useState, useEffect, use, useCallback } from 'react';
import { NuevaUnidad, Unidad } from 'src/api/types';

interface ModalEditarUnidadProps {
  open: boolean;
  onClose: () => void;
  initialData: Unidad
  onActualizarUnidad: (id: number, data: NuevaUnidad) => void;
}

export const ModalEditarUnidad: FC<ModalEditarUnidadProps> = ({
  open,
  onClose,
  initialData,
  onActualizarUnidad,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);

  useEffect(() => {
    setNombre(initialData.nombre);
  }, [initialData]);

  const handleActualizarUnidad = useCallback(() => {
    if (nombre.trim()) {
      const unidadActualizada: NuevaUnidad = { nombre };
      onActualizarUnidad(initialData.id, unidadActualizada);
      setNombre('');
      onClose();
    }
  }, [nombre, initialData.id, onActualizarUnidad, onClose]);

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
          <CardHeader title="Editar unidad" />
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
                onClick={handleActualizarUnidad}
                disabled={!nombre.trim()}
              >
                Guardar cambios
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
};
