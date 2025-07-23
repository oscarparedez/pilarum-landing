import { FC, useMemo, useState, useCallback } from 'react';
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
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';

interface Movimiento {
  tipo: 'Ingreso' | 'Costo';
  monto: number;
  fecha: string;
  data: {
    anotaciones?: string;
    monto_total: number;
    fecha: string;
    usuario_registro: {
      first_name: string;
      last_name: string;
    };
    correlativo?: string;
  };
}

interface ModalMovimientosProps {
  open: boolean;
  onClose: () => void;
  movimientos: Movimiento[];
}

export const ModalMovimientos: FC<ModalMovimientosProps> = ({ open, onClose, movimientos }) => {
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const movimientosFiltrados = useMemo(() => {
    return aplicarFiltros(movimientos, filtros, {
      camposTexto: [
        'tipo',
        'data.anotaciones',
        'data.usuario_registro.first_name',
        'data.usuario_registro.last_name',
      ],
      campoFecha: 'data.fecha',
    });
  }, [movimientos, filtros]);

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  return (
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
          maxWidth: 800,
          p: 2,
        }}
      >
        <Card>
          <CardHeader title="Movimientos financieros" />
          <Divider />

          <TablaPaginadaConFiltros
            totalItems={movimientosFiltrados.length}
            onFiltrar={handleFiltrar}
          >
            {(currentPage) => (
              <Table>
                <TableBody>
                  {movimientosFiltrados
                    .slice((currentPage - 1) * 5, currentPage * 5)
                    .map((item, index) => {
                      const fechaFormatted = formatearFecha(item.data.fecha);
                      const isIngreso = item.tipo === 'Ingreso';
                      const usuario = item.data.usuario_registro;

                      return (
                        <TableRow key={index}>
                          <TableCell width={100}>
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
                            <Typography variant="subtitle2">
                              {usuario.first_name} {usuario.last_name}
                            </Typography>
                            {item.data.anotaciones && (
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {item.data.anotaciones}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="subtitle2"
                              color={isIngreso ? 'success.main' : 'error.main'}
                            >
                              {isIngreso ? '+' : '-'}{' '}
                              {formatearQuetzales(Math.abs(item.data.monto_total))}
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
};
