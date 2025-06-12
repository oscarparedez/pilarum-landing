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
import { FC, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import { RevisionImagenesModal } from './revision-imagenes-modal';
import { Stack } from '@mui/system';
import { ModalAgregarRevision } from './agregar-revision-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Revision } from '../index.d';
import { ModalEditarRevision } from './editar-revision-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';

export const Revisiones: FC<{ revisiones: Revision[] }> = ({ revisiones }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarRevision, setEditarRevisino] = useState<Revision | null>(null);
  const [revisionAEliminar, setRevisionAEliminar] = useState<Revision | null>(null);

  const abrirModal = (imgs: string[]) => {
    setImagenes(imgs);
    setIndex(0);
    setModalOpen(true);
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

          <TablaPaginadaConFiltros
            totalItems={revisiones.length}
            onFiltrar={() => {}}
            filtrosFecha={false}
            filtrosEstado={false}
            filtrosSearch={false}
          >
            {(currentPage) => (
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
                  {revisiones.slice((currentPage - 1) * 5, currentPage * 5).map((rev) => (
                    <TableRow
                      hover
                      key={rev.id}
                    >
                      <TableCell>{rev.fecha}</TableCell>
                      <TableCell>{rev.responsable}</TableCell>
                      <TableCell>{rev.anotaciones}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            abrirModal(rev.imagenes);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => setEditarRevisino(rev)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => setRevisionAEliminar(rev)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TablaPaginadaConFiltros>
        </CardContent>
      </Card>
      <ModalAgregarRevision
        open={agregarModalOpen}
        onClose={() => setAgregarModalOpen(false)}
        onConfirm={(data) => {
          console.log('Nueva revisión:', data);
        }}
      />

      <ModalEditarRevision
        open={!!editarRevision}
        revision={editarRevision}
        onClose={() => setEditarRevisino(null)}
        onConfirm={(data) => {
          console.log('Servicio editado:', data);
          setEditarRevisino(null);
        }}
      />

      <ModalEliminar
        type="revisión"
        open={!!revisionAEliminar}
        onClose={() => setRevisionAEliminar(null)}
        onConfirm={() => {
          console.log('Eliminando:', revisionAEliminar);
          setRevisionAEliminar(null);
        }}
      />

      <RevisionImagenesModal
        open={modalOpen}
        onClose={cerrarModal}
        images={imagenes}
      />
    </Box>
  );
};
