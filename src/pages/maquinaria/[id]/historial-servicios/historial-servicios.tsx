import { FC, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Servicio } from '../index.d';
import { ModalRegistrarServicio } from './registrar-servicio-modal';
import { ServicioImagenesModal } from './servicio-imagenes-modal';

interface Props {
  servicios: Servicio[];
}

export const HistorialServicios: FC<Props> = ({ servicios }) => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [fotosVisor, setFotosVisor] = useState<string[]>([]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Historial de servicios</Typography>
          <Button
            variant="contained"
            onClick={() => setAgregarModalOpen(true)}
          >
            Registrar servicio
          </Button>
        </Stack>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Solicitado por</TableCell>
                <TableCell>Costo</TableCell>
                <TableCell>Anotaciones</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicios.map((s, i) => (
                <TableRow key={i} hover>
                  <TableCell>{s.tipo}</TableCell>
                  <TableCell>{s.fecha}</TableCell>
                  <TableCell>{s.solicitadoPor}</TableCell>
                  <TableCell>Q{s.costo.toLocaleString()}</TableCell>
                  <TableCell>{s.anotaciones}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setFotosVisor(s.fotos);
                        setVisorAbierto(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <ModalRegistrarServicio
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={(data) => {
          console.log('Nuevo servicio registrado:', data);
          setAgregarModalOpen(false);
        }}
      />

      <ServicioImagenesModal
        open={visorAbierto}
        onClose={() => setVisorAbierto(false)}
        images={fotosVisor}
      />
    </Box>
  );
};
