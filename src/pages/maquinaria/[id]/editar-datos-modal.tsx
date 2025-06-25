import { FC, useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Stack } from '@mui/material';

interface EditarDatosBasicosModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    nombre: string;
    identificador?: string;
    esMaquina?: boolean;
  };
  onConfirm: (data: { nombre: string; identificador?: string }) => void;
}

export const EditarDatosBasicosModal: FC<EditarDatosBasicosModalProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [nombre, setNombre] = useState(initialData.nombre);
  const [identificador, setIdentificador] = useState(initialData.identificador || '');

  useEffect(() => {
    if (open) {
      setNombre(initialData.nombre);
      setIdentificador(initialData.identificador || '');
    }
  }, [open, initialData]);

  const handleConfirm = () => {
    if (nombre.trim()) {
      onConfirm({
        nombre: nombre.trim(),
        ...(identificador.trim() && { identificador: identificador.trim() }),
      });
      onClose();
    }
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
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          mb={2}
        >
          Editar {initialData.esMaquina ? 'maquinaria' : 'herramienta'}
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Nombre"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <TextField
            label="Identificador"
            fullWidth
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          />

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
          >
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
            >
              Guardar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
