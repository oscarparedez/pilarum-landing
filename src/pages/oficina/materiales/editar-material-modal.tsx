import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Card,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

const UNIDADES_MOCK = ['sacos', 'barras', 'm3', 'kg', 'litros'];
const MARCAS_MOCK = ['Cemex', 'Holcim', 'Argos', 'Corona', 'Forsa'];

interface ModalEditarMaterialProps {
  open: boolean;
  onClose: () => void;
  initialData: { id: string; nombre: string; unidad: string; marca: string };
  onConfirm: (data: { id: string; nombre: string; unidad: string; marca: string }) => void;
}

export const ModalEditarMaterial: FC<ModalEditarMaterialProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);
  const [unidad, setUnidad] = useState(initialData.unidad);
  const [marca, setMarca] = useState(initialData.marca);

  useEffect(() => {
    if (open) {
      setNombre(initialData.nombre);
      setUnidad(initialData.unidad);
      setMarca(initialData.marca);
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onConfirm({ id: initialData.id, nombre: nombre.trim(), unidad, marca });
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
          <CardHeader title="Editar material" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre del material"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Unidad</InputLabel>
              <Select
                value={unidad}
                label="Unidad"
                onChange={(e) => setUnidad(e.target.value)}
              >
                {UNIDADES_MOCK.map((u) => (
                  <MenuItem
                    key={u}
                    value={u}
                  >
                    {u}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Marca</InputLabel>
              <Select
                value={marca}
                label="Marca"
                onChange={(e) => setMarca(e.target.value)}
              >
                {MARCAS_MOCK.map((m) => (
                  <MenuItem
                    key={m}
                    value={m}
                  >
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
