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
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearFecha } from 'src/utils/format-date';
import { MovimientoBodega } from './index.d';

interface ModalMovimientosBodegaProps {
  open: boolean;
  onClose: () => void;
  producto: string;
  unidad: string;
  movimientos: MovimientoBodega[];
}

export const ModalMovimientosBodega: FC<ModalMovimientosBodegaProps> = ({
  open,
  onClose,
  producto,
  unidad,
  movimientos,
}) => {
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
          maxWidth: 900,
          p: 2,
        }}
      >
        <Card>
          <CardHeader title={`Historial de movimientos: ${producto}`} />
          <Divider />

          <TablaPaginadaConFiltros
            totalItems={movimientos.length}
            onFiltrar={() => {}}
            filtrosFecha={false}
            filtrosEstado={false}
          >
            {(currentPage) => (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Origen y destino</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {movimientos.slice((currentPage - 1) * 5, currentPage * 5).map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                        >
                          {formatearFecha(mov.fecha)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{mov.usuario}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color={mov.tipo === 'entrada' ? 'success.main' : 'error.main'}
                        >
                          {mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {mov.tipo === 'entrada'
                            ? `${mov.origen ?? 'desconocido'} → Bodega central`
                            : `Bodega central → ${mov.destino ?? 'desconocido'}`}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="subtitle2"
                          color={mov.tipo === 'entrada' ? 'success.main' : 'error.main'}
                        >
                          {mov.tipo === 'entrada' ? '+' : '-'} {mov.cantidad} {unidad}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TablaPaginadaConFiltros>
        </Card>
      </Box>
    </Modal>
  );
};
