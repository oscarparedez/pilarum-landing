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
import { FC, useCallback, useEffect, useState } from 'react';
import { Marca, Material, NuevoMaterial, Unidad } from 'src/api/types';

interface ModalEditarMaterialProps {
  unidades: Unidad[];
  marcas: Marca[];
  open: boolean;
  onClose: () => void;
  initialData: Material;
  onActualizarMaterial: (id: number, data: NuevoMaterial) => void;
}

export const ModalEditarMaterial: FC<ModalEditarMaterialProps> = ({
  unidades,
  marcas,
  open,
  onClose,
  initialData,
  onActualizarMaterial,
}) => {
  const [nombre, setNombre] = useState('');
  const [unidad, setUnidad] = useState<number | null>(null);
  const [marca, setMarca] = useState<number | null>(null);

  useEffect(() => {
    if (open && initialData) {
      setNombre(initialData.nombre);
      setUnidad(initialData.unidad.id);
      setMarca(initialData.marca.id);
    }
  }, [open, initialData]);

  const handleActualizarMaterial = useCallback(() => {
    if (nombre.trim() === '' || unidad === null || marca === null) {
      return;
    }
    onActualizarMaterial(initialData.id, {
      nombre,
      unidad,
      marca,
    });
    onClose();
  }, [nombre, unidad, marca, initialData.id, onActualizarMaterial, onClose]);

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
              <InputLabel shrink>Unidad</InputLabel>
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
              <InputLabel shrink>Marca</InputLabel>
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
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={handleActualizarMaterial}
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
