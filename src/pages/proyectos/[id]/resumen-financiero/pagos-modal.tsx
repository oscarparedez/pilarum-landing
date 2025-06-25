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
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';

import { ModalEditarPago } from './editar-pago-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { Pago } from '../index.d';
import { ModalEliminar } from 'src/components/eliminar-modal';

interface ModalListaPagosProps {
  open: boolean;
  onClose: () => void;
  pagos: Pago[];
  fetchPagos: (filtros: {
    search: string;
    fechaInicio: Date | null;
    fechaFin: Date | null;
  }) => void;
}

export const ModalListaPagos: FC<ModalListaPagosProps> = ({ open, onClose, pagos, fetchPagos }) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [pagoAEliminar, setPagoAEliminar] = useState<Pago | null>(null);

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
            p: 2,
          }}
        >
          <Card>
            <CardHeader title="Historial de pagos" />
            <Divider />

            <TablaPaginadaConFiltros
              onFiltrar={({ search, fechaInicio, fechaFin }) => {
                fetchPagos({
                  search,
                  fechaInicio: fechaInicio ?? null,
                  fechaFin: fechaFin ?? null,
                });
              }}
              totalItems={pagos.length}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {pagos.slice((currentPage - 1) * 5, currentPage * 5).map((pago, index) => {
                      const globalIndex = index + (currentPage - 1) * 5;
                      return (
                        <TableRow key={pago.id_pago || index}>
                          <TableCell width={100}>
                            <Box sx={{ p: 1 }}>
                              <Typography
                                align="center"
                                color="text.secondary"
                                variant="subtitle2"
                              >
                                {formatearFecha(pago.fecha_pago)}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2">{pago.usuario_registro}</Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              {pago.tipo_pago} - {pago.tipo_documento}
                            </Typography>
                            {pago.anotaciones && (
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {pago.anotaciones}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <Typography
                              color="success.main"
                              variant="subtitle2"
                            >
                              {formatearQuetzales(Number(pago.monto_total))}
                            </Typography>

                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                            >
                              <IconButton
                                onClick={() => {
                                  setEditandoIndex(globalIndex);
                                  setModalEditarAbierto(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  setPagoAEliminar(pago);
                                }}
                              >
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
        <ModalEditarPago
          open={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          initialData={pagos[editandoIndex]}
          onConfirm={(data) => {
            console.log('Pago editado:', data);
            setModalEditarAbierto(false);
          }}
        />
      )}

      <ModalEliminar
        type="pago"
        open={!!pagoAEliminar}
        onClose={() => setPagoAEliminar(null)}
        onConfirm={() => {
          console.log('Pago eliminado');
          setPagoAEliminar(null);
        }}
      />
    </>
  );
};
