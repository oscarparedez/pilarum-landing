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
import { FC, useCallback, useMemo, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import { RevisionImagenesModal } from './revision-imagenes-modal';
import { Stack } from '@mui/system';
import { ModalAgregarRevision } from './agregar-revision-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarRevision } from './editar-revision-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { NuevaRevision, Revision } from 'src/api/types';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { formatearFecha } from 'src/utils/format-date';

interface RevisionesProps {
  revisiones: Revision[];
  handleCrearRevision: (data: NuevaRevision) => Promise<void>;
  handleActualizarRevision: (id: number, data: NuevaRevision) => Promise<void>;
  handleEliminarRevision: (id: number) => Promise<void>;
}

export const Revisiones: FC<RevisionesProps> = ({
  revisiones,
  handleCrearRevision,
  handleActualizarRevision,
  handleEliminarRevision,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarRevision, setEditarRevision] = useState<Revision | null>(null);
  const [revisionAEliminar, setRevisionAEliminar] = useState<Revision | null>(null);

  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const revisionesFiltradas = useMemo(() => {
    return aplicarFiltros(revisiones, filtros, {
      camposTexto: [
        'usuario_creador.first_name',
        'usuario_creador.last_name',
        'titulo',
        'anotaciones',
      ],
      campoFecha: 'fecha_review',
    });
  }, [revisiones, filtros]);

  const abrirModal = (imgs: string[]) => {
    setImagenes(imgs);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const onCrearRevision = useCallback(
    async (data: NuevaRevision) => {
      await handleCrearRevision(data);
      setAgregarModalOpen(false);
    },
    [handleCrearRevision]
  );

  const onActualizarRevision = useCallback(
    async (id: number, data: NuevaRevision) => {
      await handleActualizarRevision(id, data);
      setEditarRevision(null);
    },
    [handleActualizarRevision]
  );

  const onEliminarRevision = useCallback(async () => {
    if (revisionAEliminar) {
      await handleEliminarRevision(revisionAEliminar.id);
      setRevisionAEliminar(null);
    }
  }, [revisionAEliminar, handleEliminarRevision]);

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
            totalItems={revisionesFiltradas.length}
            onFiltrar={handleFiltrar}
          >
            {(currentPage) => (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha creación</TableCell>
                    <TableCell>Fecha revisión</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revisionesFiltradas.slice((currentPage - 1) * 5, currentPage * 5).map((rev) => (
                    <TableRow
                      key={rev.id}
                      hover
                    >
                      <TableCell>{formatearFecha(rev.fecha_creacion)}</TableCell>
                      <TableCell>{formatearFecha(rev.fecha_review)}</TableCell>
                      <TableCell>
                        {rev.usuario_creador.first_name} {rev.usuario_creador.last_name}
                      </TableCell>
                      <TableCell>{rev.titulo}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => abrirModal(rev.fotos.map((f) => f.imagen))}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => setEditarRevision(rev)}>
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
        onConfirm={onCrearRevision}
      />

      {editarRevision && (
        <ModalEditarRevision
          open={!!editarRevision}
          revision={editarRevision}
          onClose={() => setEditarRevision(null)}
          onConfirm={onActualizarRevision}
        />
      )}

      <ModalEliminar
        type="revisión"
        open={!!revisionAEliminar}
        onClose={() => setRevisionAEliminar(null)}
        onConfirm={onEliminarRevision}
      />

      <RevisionImagenesModal
        open={modalOpen}
        onClose={cerrarModal}
        images={imagenes}
      />
    </Box>
  );
};
