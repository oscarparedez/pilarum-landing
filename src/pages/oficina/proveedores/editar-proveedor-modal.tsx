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
import { Proveedor, NuevoProveedor } from 'src/api/types';

interface ModalEditarProveedorProps {
  open: boolean;
  onClose: () => void;
  initialData: Proveedor;
  onActualizarProveedor: (id: number, data: NuevoProveedor) => void;
}

export const ModalEditarProveedor: FC<ModalEditarProveedorProps> = ({
  open,
  onClose,
  initialData,
  onActualizarProveedor,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);

  useEffect(() => {
    if (open) {
      setNombre(initialData.nombre);
    }
  }, [open, initialData]);

  const handleActualizarProveedor = useCallback(() => {
    if (nombre.trim()) {
      const updatedProveedor: NuevoProveedor = { nombre };
      onActualizarProveedor(initialData.id, updatedProveedor);
      setNombre('');
      onClose();
    }
  }, [nombre, onActualizarProveedor, onClose]);

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
          <CardHeader title="Editar proveedor" />
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
                onClick={handleActualizarProveedor}
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
