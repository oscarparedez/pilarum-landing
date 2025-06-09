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
import { ModalEditarPago } from './editar-pago-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { Pago } from '../index.d';

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
  const [editando, setEditando] = useState<Pago | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: 800,
            p: 2,
          }}
        >
          <Card>
            <CardHeader title="Historial de pagos" />
            <Divider />

            <TablaPaginadaConFiltros
              onFiltrar={({ search, fechaInicio, fechaFin }) => {
                fetchPagos({ search, fechaInicio, fechaFin });
              }}
              totalItems={pagos.length}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {pagos
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((pago, index) => {
                        const fechaFormatted = formatearFecha(pago.fecha_pago);
                        return (
                          <TableRow key={pago.id_pago || index}>
                            <TableCell width={100}>
                              <Box sx={{ p: 1 }}>
                                <Typography align="center" color="text.secondary" variant="subtitle2">
                                  {fechaFormatted}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">{pago.usuario_registro}</Typography>
                              <Typography color="text.secondary" variant="body2">
                                {pago.tipo_pago} - {pago.tipo_documento}
                              </Typography>
                              {pago.anotaciones && (
                                <Typography color="text.secondary" variant="body2">
                                  {pago.anotaciones}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Typography color="success.main" variant="subtitle2">
                                {formatearQuetzales(Number(pago.monto_total))}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setEditando(pago);
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
      </Modal>

      {editando && (
        <ModalEditarPago
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={editando}
          onConfirm={(data) => {
            console.log('Datos editados:', data);
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};
