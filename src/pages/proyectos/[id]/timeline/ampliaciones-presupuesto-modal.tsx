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
  Stack,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalEditarAmpliacionPresupuesto } from './editar-ampliacion-presupuesto-modal';
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

  return (
    <Modal open={open} onClose={onClose}>
      <>
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
                        return (
                          <TableRow key={index}>
                            <TableCell width={120}>
                              <Box sx={{ p: 1 }}>
                                <Typography align="center" color="text.secondary" variant="subtitle2">
                                  {fechaFormatted}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">{item.usuario}</Typography>
                              <Typography color="text.secondary" variant="body2">
                                {item.motivo}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Stack spacing={0.5} alignItems="flex-end">
                                {item.monto && (
                                  <Typography variant="subtitle2" color="success.main">
                                    +{formatearQuetzales(Number(item.monto))}
                                  </Typography>
                                )}
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

        {editandoIndex !== null && (
          <ModalEditarAmpliacionPresupuesto
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            initialData={ampliaciones[editandoIndex]}
            onConfirm={(data) => {
              // Aquí deberías levantar el estado o hacer refetch como mencionaste
              setEditModalOpen(false);
            }}
          />
        )}
      </>
    </Modal>
  );
};
