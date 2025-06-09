import { FC } from 'react';
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
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatDate } from '@fullcalendar/core';

interface Movimiento {
  tipo: 'Ingreso' | 'Pago';
  monto: number;
  fecha: string;
  descripcion: string;
  usuario: string;
}

interface ModalMovimientosProps {
  open: boolean;
  onClose: () => void;
  movimientos: Movimiento[];
  fetchMovimientos: (filtros: {
    search: string;
    fechaInicio: Date | null;
    fechaFin: Date | null;
  }) => void;
}

export const ModalMovimientos: FC<ModalMovimientosProps> = ({ open, onClose, movimientos, fetchMovimientos }) => (
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
        <CardHeader title="Movimientos financieros" />
        <Divider />

        <TablaPaginadaConFiltros
          onFiltrar={({ search, fechaInicio, fechaFin }) => {
            fetchMovimientos({ search, fechaInicio, fechaFin });
          }}
          totalItems={movimientos.length}
        >
          {(currentPage) => (
            <Table>
              <TableBody>
                {movimientos
                  .slice((currentPage - 1) * 5, currentPage * 5)
                  .map((item, index) => {
                    const fechaFormatted = formatDate(item.fecha)
                    const isIngreso = item.tipo === 'Ingreso';
                    return (
                      <TableRow key={index}>
                        <TableCell width={100}>
                          <Box sx={{ p: 1 }}>
                            <Typography align="center" color="text.secondary" variant="subtitle2">
                              {fechaFormatted}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{item.usuario}</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {item.descripcion}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="subtitle2"
                            color={isIngreso ? 'success.main' : 'error.main'}
                          >
                            {isIngreso ? '+' : '-'} {formatearQuetzales(Number(item.monto))}
                          </Typography>
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
);