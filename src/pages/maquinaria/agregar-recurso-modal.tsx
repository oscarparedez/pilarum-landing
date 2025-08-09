import { FC, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { NuevaMaquinaria, TipoDocumento, TipoMaquinaria } from 'src/api/types';

interface ModalAgregarRecursoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: NuevaMaquinaria) => void;
}

export const ModalAgregarRecurso: FC<ModalAgregarRecursoProps> = ({ open, onClose, onConfirm }) => {
  const [tipo, setTipo] = useState<TipoMaquinaria>('maquinaria');
  const [nombre, setNombre] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [costo, setCosto] = useState('');
  const [fechaCompra, setFechaCompra] = useState<Date | null>(new Date());
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('cheque');
  const [anotaciones, setAnotaciones] = useState('');

  const handleConfirm = () => {
    if (!nombre || !costo || !fechaCompra || !tipoDocumento || !identificador) return;

    const data: NuevaMaquinaria = {
      tipo,
      nombre: nombre.trim(),
      identificador,
      costo: parseFloat(costo),
      fecha_compra: format(fechaCompra, 'yyyy-MM-dd'),
      tipo_documento: tipoDocumento,
      ...(anotaciones.trim() && { anotaciones: anotaciones.trim() }),
    };

    onConfirm(data);
    onClose();

    // reset
    setNombre('');
    setIdentificador('');
    setCosto('');
    setTipo('maquinaria');
    setFechaCompra(new Date());
    setTipoDocumento('cheque');
    setAnotaciones('');
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
          maxWidth: 500,
          p: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2 }}
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

              {/* Nombre + Identificador */}
              <Stack
                direction="row"
                spacing={2}
              >
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
              </Stack>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  Fecha de compra <span style={{ color: 'red' }}>*</span>
                </Typography>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DateCalendar
                    value={fechaCompra}
                    onChange={setFechaCompra}
                  />
                </LocalizationProvider>
              </Box>

              {/* Tipo de documento + Costo */}
              <Stack
                direction="row"
                spacing={2}
              >
                <TextField
                  label="Tipo de documento"
                  select
                  fullWidth
                  required
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
                >
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="efectivo">Efectivo</MenuItem>
                  <MenuItem value="transferencia">Transferencia</MenuItem>
                </TextField>

                <TextField
                  label="Costo"
                  type="number"
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                  fullWidth
                />
              </Stack>

              <TextField
                label="Anotaciones"
                multiline
                rows={3}
                fullWidth
                value={anotaciones}
                onChange={(e) => setAnotaciones(e.target.value)}
              />
            </Stack>
          </CardContent>

          <Divider />

          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={!nombre || !costo || !fechaCompra || !tipoDocumento || !identificador}
            >
              Guardar recurso
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};
