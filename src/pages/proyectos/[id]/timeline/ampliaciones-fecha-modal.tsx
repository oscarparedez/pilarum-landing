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
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarAmpliacionFecha } from './editar-ampliacion-fecha-modal';
import { formatearFecha } from 'src/utils/format-date';

interface Ampliacion {
  fecha: string;
  motivo: string;
  usuario: string;
}

interface ModalAmpliacionesFechaProps {
  open: boolean;
  onClose: () => void;
  ampliaciones: Ampliacion[];
}

export const ModalAmpliacionesFecha: FC<ModalAmpliacionesFechaProps> = ({
  open,
  onClose,
  ampliaciones,
}) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: 900,
            p: 2,
          }}
        >
          <Card>
            <CardHeader title="Historial de ampliaciones de fecha" />
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
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setEditandoIndex(index + (currentPage - 1) * 5);
                                  setEditModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
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

        {editandoIndex !== null && (
          <ModalEditarAmpliacionFecha
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            initialData={ampliaciones[editandoIndex]}
            onConfirm={(data) => {
              const nuevas = [...ampliaciones];
              nuevas[editandoIndex] = data;
              setEditModalOpen(false);
            }}
          />
        )}
      </>
    </Modal>
  );
};
