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
import { on } from 'events';
import { FC, use, useCallback, useState } from 'react';
import { Marca, Material, NuevoMaterial, Unidad } from 'src/api/types';

interface ModalCrearMaterialProps {
  unidades: Unidad[];
  marcas: Marca[];
  open: boolean;
  onClose: () => void;
  onCrearMaterial: (data: NuevoMaterial[]) => void;
}

export const ModalCrearMaterial: FC<ModalCrearMaterialProps> = ({ unidades, marcas, open, onClose, onCrearMaterial }) => {
  const [nombre, setNombre] = useState<string | null>(null);
  const [unidad, setUnidad] = useState<string | null>(null);
  const [marca, setMarca] = useState<string | null>(null);

  const handleCrearMaterial = useCallback(() => {
     onCrearMaterial({
      nombre,
      unidad,
      marca,
    });
    setNombre('');
    setUnidad(null);
    setMarca(null);
    onClose();
  }, [nombre, unidad, marca, onCrearMaterial, onClose]);

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
                {unidades.map((u) => (
                  <MenuItem
                    key={u.id}
                    value={u.id}
                  >
                    {u.nombre}
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
                {marcas.map((m) => (
                  <MenuItem
                    key={m.id}
                    value={m.id}
                  >
                    {m.nombre}
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
                onClick={handleCrearMaterial}
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
