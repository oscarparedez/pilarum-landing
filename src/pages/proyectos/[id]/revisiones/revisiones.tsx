import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { RevisionImagenesModal } from './revision-imagenes-modal';
import { Stack } from '@mui/system';
import { ModalAgregarRevision } from './agregar-revision-modal';

interface Revision {
  id: string;
  fecha: string;
  responsable: string;
  anotaciones: string;
  imagenes: string[];
}

interface RevisionesProps {
  revisiones: Revision[];
}

export const Revisiones = ({ revisiones }: RevisionesProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);

  const abrirModal = (imgs: string[]) => {
    setImagenes(imgs);
    setIndex(0);
    setModalOpen(true); // este es el que realmente controla el modal
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setIndex(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 3, py: 3 }}
          >
            <Typography variant="h5">Revisiones</Typography>
            <Button
              size="large"
              variant="contained"
              onClick={() => setAgregarModalOpen(true)}
            >
              Agregar revisión
            </Button>
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell>Anotaciones</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revisiones.map((rev) => (
                <TableRow
                  hover
                  key={rev.id}
                >
                  <TableCell>{rev.fecha}</TableCell>
                  <TableCell>{rev.responsable}</TableCell>
                  <TableCell>{rev.anotaciones}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => abrirModal(rev.imagenes)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <RevisionImagenesModal
        open={modalOpen}
        onClose={cerrarModal}
        images={imagenes}
      />
      <ModalAgregarRevision
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={(data) => {
          console.log('Nueva revisión:', data);
          // Aquí puedes subir a backend o agregar al estado
        }}
      />
    </Box>
  );
};
