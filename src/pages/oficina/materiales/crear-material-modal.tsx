import {
  Box,
  Button,
  Modal,
  Card,
  CardHeader,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { FC, useState } from 'react';

const UNIDADES_MOCK = ['sacos', 'barras', 'm3', 'kg', 'litros'];
const MARCAS_MOCK = ['Cemex', 'Holcim', 'Argos', 'Corona', 'Forsa'];

interface ModalCrearMaterialProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { nombre: string; unidad: string; marca: string }) => void;
}

export const ModalCrearMaterial: FC<ModalCrearMaterialProps> = ({ open, onClose, onConfirm }) => {
  const [nombre, setNombre] = useState('');
  const [unidad, setUnidad] = useState(UNIDADES_MOCK[0]);
  const [marca, setMarca] = useState(MARCAS_MOCK[0]);

  const handleConfirm = () => {
    if (!nombre.trim()) return;
    onConfirm({ nombre: nombre.trim(), unidad, marca });
    setNombre('');
    setUnidad(UNIDADES_MOCK[0]);
    setMarca(MARCAS_MOCK[0]);
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
          <CardHeader title="Crear nuevo material" />
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
              <Button
                variant="outlined"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
              >
                Confirmar
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
};
