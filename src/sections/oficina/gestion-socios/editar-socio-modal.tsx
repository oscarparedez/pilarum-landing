import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Card,
  CardHeader,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { NuevoSocio, Socio } from 'src/api/types';

interface ModalEditarSocioProps {
  open: boolean;
  onClose: () => void;
  initialData: Socio;
  onConfirm: (id: number, data: NuevoSocio) => void;
}

export const ModalEditarSocio: FC<ModalEditarSocioProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);
  const [tipo, setTipo] = useState<'interno' | 'externo'>(initialData.tipo);

  useEffect(() => {
    if (open) {
      setNombre(initialData.nombre);
      setTipo(initialData.tipo);
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onConfirm(initialData.id, { nombre, tipo });
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
          <CardHeader title="Editar socio" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre del socio"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            {/* <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1 }}
              >
                Tipo de socio
              </Typography>
              <ToggleButtonGroup
                value={tipo}
                exclusive
                onChange={(_, newTipo) => {
                  if (newTipo) setTipo(newTipo);
                }}
                fullWidth
              >
                <ToggleButton
                  value="interno"
                  sx={{ textTransform: 'none' }}
                >
                  Interno
                </ToggleButton>
                <ToggleButton
                  value="externo"
                  sx={{ textTransform: 'none' }}
                >
                  Externo
                </ToggleButton>
              </ToggleButtonGroup>
            </Box> */}

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
