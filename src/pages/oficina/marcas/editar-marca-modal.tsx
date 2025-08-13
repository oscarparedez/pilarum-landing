import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Card,
  CardHeader,
  Divider,
} from '@mui/material';
import { FC, useState, useEffect, use, useCallback } from 'react';
import { Marca, NuevaMarca } from 'src/api/types';

interface ModalEditarMarcaProps {
  open: boolean;
  onClose: () => void;
  initialData: Marca;
  onActualizarMarca: (id: number, data: NuevaMarca) => void;
}

export const ModalEditarMarca: FC<ModalEditarMarcaProps> = ({
  open,
  onClose,
  initialData,
  onActualizarMarca,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);

  useEffect(() => {
    if (open) {
      setNombre(initialData.nombre);
    }
  }, [open, initialData]);

  const handleActualizarMarca = useCallback(() => {
    if (nombre.trim()) {
      const updatedMarca: NuevaMarca = { nombre };
      onActualizarMarca(initialData.id, updatedMarca);
      setNombre('');
      onClose();
    }
  }, [nombre, onActualizarMarca, onClose, initialData.id]);

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
          <CardHeader title="Editar marca" />
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
                onClick={handleActualizarMarca}
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
