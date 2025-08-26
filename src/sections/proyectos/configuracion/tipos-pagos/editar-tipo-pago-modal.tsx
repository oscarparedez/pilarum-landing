import { Box, Button, Modal, Stack, TextField, Card, CardHeader, Divider } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { NuevoTipoCosto, TipoCosto } from 'src/api/types';

export const ModalEditarTipoPago: FC<{
  open: boolean;
  onClose: () => void;
  initialData: TipoCosto;
  onConfirm: (id: number, data: NuevoTipoCosto) => void;
}> = ({ open, onClose, initialData, onConfirm }) => {
  const [nombre, setNombre] = useState(initialData.nombre);

  useEffect(() => {
    if (open) setNombre(initialData.nombre);
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onConfirm(initialData.id, { nombre: nombre.trim() });
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
          <CardHeader title="Editar tipo de pago" />
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre del tipo de pago"
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
