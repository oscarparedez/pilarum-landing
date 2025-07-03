import { FC, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Stack, MenuItem } from '@mui/material';

interface ModalAgregarRecursoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    tipo: 'maquinaria' | 'herramienta';
    nombre: string;
    identificador?: string;
    costo: number;
  }) => void;
}

export const ModalAgregarRecurso: FC<ModalAgregarRecursoProps> = ({ open, onClose, onConfirm }) => {
  const [tipo, setTipo] = useState<'maquinaria' | 'herramienta'>('maquinaria');
  const [nombre, setNombre] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [costo, setCosto] = useState('');

  const handleConfirm = () => {
    if (!nombre || !costo) return;
    const data = {
      tipo,
      nombre,
      ...(identificador ? { identificador } : {}),
      costo: parseFloat(costo),
    };
    onConfirm(data);
    onClose();
    setNombre('');
    setIdentificador('');
    setCosto('');
    setTipo('maquinaria');
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
          width: 400,
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
          Agregar nuevo recurso
        </Typography>
        <Stack spacing={2}>
          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'maquinaria' | 'herramienta')}
            fullWidth
          >
            <MenuItem value="maquinaria">Maquinaria</MenuItem>
            <MenuItem value="herramienta">Herramienta</MenuItem>
          </TextField>

          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
          />

          <TextField
            label="Identificador"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            fullWidth
          />

          <TextField
            label="Costo"
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            fullWidth
          />

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            mt={2}
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
