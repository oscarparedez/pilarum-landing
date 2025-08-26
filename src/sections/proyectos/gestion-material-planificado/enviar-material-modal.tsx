import { FC, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Modal,
  Typography,
  Button,
  Slider,
  Stack,
  Divider,
} from '@mui/material';

interface ModalEnviarMaterialProps {
  open: boolean;
  onClose: () => void;
  producto: string;
  cantidadDisponible: number;
  unidad: string;
}

export const ModalEnviarMaterial: FC<ModalEnviarMaterialProps> = ({
  open,
  onClose,
  producto,
  cantidadDisponible,
  unidad,
}) => {
  const [cantidad, setCantidad] = useState(1);

  const onEnviar = (cantidad: number) => {
    // Aquí podrías enviar la cantidad al API o manejar el envío
    console.log(`Enviando ${cantidad} ${unidad} de ${producto}`);
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
          width: '90%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Card elevation={0}>
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
            >
              Enviar material a bodega
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              gutterBottom
            >
              Selecciona la cantidad que deseas trasladar desde el proyecto.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle2"
              gutterBottom
            >
              <strong>{producto}</strong>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
            >
              Disponible: {cantidadDisponible} {unidad}
            </Typography>

            <Box sx={{ px: 2, pt: 4 }}>
              <Slider
                value={cantidad}
                onChange={(_, value) => setCantidad(value as number)}
                min={1}
                max={cantidadDisponible}
                step={1}
                marks
                valueLabelDisplay="on"
              />
            </Box>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              mt={4}
            >
              <Button
                onClick={onClose}
                color="inherit"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  onEnviar(cantidad);
                  onClose();
                }}
              >
                Enviar {cantidad} {unidad}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};
