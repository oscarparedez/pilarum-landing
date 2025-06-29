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
import { FC, useState, useEffect } from 'react';

interface ModalEditarMarcaProps {
  open: boolean;
  onClose: () => void;
  initialData: { id: string; nombre: string };
  onConfirm: (data: { id: string; nombre: string }) => void;
}

export const ModalEditarMarca: FC<ModalEditarMarcaProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);

  useEffect(() => {
    if (open) {
      setNombre(initialData.nombre);
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onConfirm({ id: initialData.id, nombre: nombre.trim() });
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
                onClick={handleSubmit}
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
