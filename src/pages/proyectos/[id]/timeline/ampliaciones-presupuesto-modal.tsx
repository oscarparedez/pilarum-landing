import { FC, useState } from 'react';
import {
  Box,
  Modal,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';

import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarAmpliacionPresupuesto } from './editar-ampliacion-presupuesto-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { formatearFecha } from 'src/utils/format-date';
import { formatearQuetzales } from 'src/utils/format-currency';
import { AmpliacionPresupuesto } from '../index.d';

interface ModalAmpliacionesPresupuestoProps {
  open: boolean;
  onClose: () => void;
  ampliaciones: AmpliacionPresupuesto[];
}

export const ModalAmpliacionesPresupuesto: FC<ModalAmpliacionesPresupuestoProps> = ({
  open,
  onClose,
  ampliaciones,
}) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [eliminando, setEliminando] = useState<AmpliacionPresupuesto | null>(null);

  return (
    <>
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
            width: '95%',
            maxWidth: 900,
            p: 3,
          }}
        >
          <Card>
            <CardHeader title="Historial de ampliaciones de presupuesto" />
            <Divider />

            <TablaPaginadaConFiltros
              onFiltrar={() => {}}
              totalItems={ampliaciones.length}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {ampliaciones
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, index) => {
                        const fechaFormatted = formatearFecha(item.fecha);
                        const globalIndex = index + (currentPage - 1) * 5;

                        return (
                          <TableRow key={index}>
                            <TableCell width={120}>
                              <Box sx={{ p: 1 }}>
                                <Typography
                                  align="center"
                                  color="text.secondary"
                                  variant="subtitle2"
                                >
                                  {fechaFormatted}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">{item.usuario}</Typography>
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {item.motivo}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="subtitle2"
                                color="success.main"
                              >
                                +{formatearQuetzales(Number(item.monto))}
                              </Typography>

                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                              >
                                <IconButton
                                  onClick={() => {
                                    setEditandoIndex(globalIndex);
                                    setEditModalOpen(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => setEliminando(item)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </TablaPaginadaConFiltros>
          </Card>
        </Box>
      </Modal>

      {editandoIndex !== null && (
        <ModalEditarAmpliacionPresupuesto
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={ampliaciones[editandoIndex]}
          onConfirm={(data) => {
            setEditModalOpen(false);
          }}
        />
      )}

      <ModalEliminar
        type="ampliación de presupuesto"
        open={!!eliminando}
        onClose={() => setEliminando(null)}
        onConfirm={() => {
          console.log('Ampliación de presupuesto eliminada');
          setEliminando(null);
        }}
      />
    </>
  );
};
