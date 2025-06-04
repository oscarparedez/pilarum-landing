import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
  } from '@mui/material';
  import { FC, useEffect, useState } from 'react';
  import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
  import { format } from 'date-fns';
  
  interface ModalEditarAmpliacionFechaProps {
    open: boolean;
    onClose: () => void;
    initialData: {
      fecha: string;
      motivo: string;
      usuario: string;
    };
    onConfirm: (data: {
      fecha: string;
      motivo: string;
      usuario: string;
    }) => void;
  }
  
  export const ModalEditarAmpliacionFecha: FC<ModalEditarAmpliacionFechaProps> = ({
    open,
    onClose,
    initialData,
    onConfirm,
  }) => {
    const [fecha, setFecha] = useState<Date | null>(new Date(initialData.fecha));
    const [motivo, setMotivo] = useState(initialData.motivo);
    const [usuario, setUsuario] = useState(initialData.usuario);
  
    useEffect(() => {
      setFecha(new Date(initialData.fecha));
      setMotivo(initialData.motivo);
      setUsuario(initialData.usuario);
    }, [initialData]);
  
    const handleSave = () => {
      if (fecha && motivo && usuario) {
        onConfirm({
          fecha: format(fecha, 'yyyy-MM-dd'),
          motivo,
          usuario,
        });
        onClose();
      }
    };
  
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>Editar ampliación de fecha</Typography>
  
          <Stack spacing={2}>
            <TextField
              label="Motivo"
              fullWidth
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
            <TextField
              label="Usuario"
              fullWidth
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <Box>
              <Typography variant="subtitle2" mb={1}>Nueva fecha</Typography>
              <DateCalendar
                value={fecha}
                onChange={(newDate) => setFecha(newDate)}
              />
            </Box>
          </Stack>
  
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave}>
              Guardar cambios
            </Button>
          </Stack>
        </Box>
      </Modal>
    );
  };
  