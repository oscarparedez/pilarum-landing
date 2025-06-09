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
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import type { Consumo } from '../index.d';
import { ModalRegistrarConsumo } from './registrar-consumo-modal';
import { ConsumoImagenesModal } from './consumo-imagenes-modal';

interface Props {
  consumos: Consumo[];
}

export const HistorialConsumos: FC<Props> = ({ consumos }) => {
  const [modalOpen, setModalOpen] = useState(false);
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
          <Typography variant="h5">Historial de consumos</Typography>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
          >
            Registrar consumo
          </Button>
        </Stack>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Reportado por</TableCell>
                <TableCell>Anotaciones</TableCell>
                <TableCell>Costo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consumos.map((c, i) => (
                <TableRow key={i} hover>
                  <TableCell>{c.tipo}</TableCell>
                  <TableCell>{c.fecha}</TableCell>
                  <TableCell>{c.cantidad} {c.unidad}</TableCell>
                  <TableCell>{c.reportadoPor}</TableCell>
                  <TableCell>{c.anotaciones}</TableCell>
                  <TableCell>Q{c.costo.toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setFotosVisor(c.fotos);
                        setVisorAbierto(true);
                      }}
                      disabled={c.fotos.length === 0}
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

      <ModalRegistrarConsumo
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(data) => {
          console.log('Nuevo consumo registrado:', data);
          setModalOpen(false);
        }}
      />

      <ConsumoImagenesModal
        open={visorAbierto}
        onClose={() => setVisorAbierto(false)}
        images={fotosVisor}
      />
    </Box>
  );
};
