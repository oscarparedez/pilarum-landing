import { FC, useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Stack, MenuItem } from '@mui/material';
import { TipoMaquinaria } from './index.d';

interface EditarDatosBasicosModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    tipo: TipoMaquinaria;
    nombre: string;
    identificador?: string;
    costo: number;
  };
  onConfirm: (data: {
    tipo: TipoMaquinaria;
    nombre: string;
    identificador?: string;
    costo: number;
  }) => void;
}

export const EditarDatosBasicosModal: FC<EditarDatosBasicosModalProps> = ({
  open,
  onClose,
  initialData,
  onConfirm,
}) => {
  const [tipo, setTipo] = useState<TipoMaquinaria>(initialData.tipo);
  const [nombre, setNombre] = useState(initialData.nombre);
  const [identificador, setIdentificador] = useState(initialData.identificador || '');
  const [costo, setCosto] = useState(initialData.costo.toString());

  useEffect(() => {
    if (open) {
      setTipo(initialData.tipo);
      setNombre(initialData.nombre);
      setIdentificador(initialData.identificador || '');
      setCosto(initialData.costo.toString());
    }
  }, [open, initialData]);

  const handleConfirm = () => {
    if (!nombre.trim() || !costo) return;
    onConfirm({
      tipo,
      nombre: nombre.trim(),
      ...(identificador.trim() && { identificador: identificador.trim() }),
      costo: parseFloat(costo),
    });
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
          Editar recurso
        </Typography>

        <Stack spacing={3}>
          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoMaquinaria)}
            fullWidth
          >
            <MenuItem value="maquinaria">Maquinaria</MenuItem>
            <MenuItem value="herramienta">Herramienta</MenuItem>
          </TextField>

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

          <TextField
            label="Costo (Q)"
            type="number"
            fullWidth
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
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
