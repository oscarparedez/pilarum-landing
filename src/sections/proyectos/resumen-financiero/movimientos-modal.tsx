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
  Stack,
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
            {(currentPage) => {
              // Página actual
              const pageItems = movimientosFiltrados.slice((currentPage - 1) * 5, currentPage * 5);

              // Agrupar por tipo dentro de la página
              const ingresos = pageItems.filter((m) => m.tipo === 'Ingreso');
              const costos = pageItems.filter((m) => m.tipo === 'Costo');

              const totalIngresos = ingresos.reduce((s, m) => s + Math.abs(m.data.monto_total), 0);
              const totalCostos = costos.reduce((s, m) => s + Math.abs(m.data.monto_total), 0);

              const renderGrupo = (titulo: 'Ingresos' | 'Costos', items: Movimiento[]) => {
                if (!items.length) return null;
                const esIngreso = titulo === 'Ingresos';
                return (
                  <>
                    {/* Encabezado de grupo */}
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{ py: 1.5, backgroundColor: 'action.hover' }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="subtitle2">
                            {esIngreso ? '📈 Ingresos' : '📉 Costos'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color={esIngreso ? 'success.main' : 'error.main'}
                          >
                            {esIngreso ? '+' : '-'}{' '}
                            {formatearQuetzales(esIngreso ? totalIngresos : totalCostos)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    {/* Filas del grupo */}
                    {items.map((item, idx) => {
                      const fechaFormatted = formatearFecha(item.data.fecha);
                      const usuario = item.data.usuario_registro;
                      const esIng = item.tipo === 'Ingreso';
                      return (
                        <TableRow key={`${titulo}-${idx}`}>
                          {/* Fecha */}
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

                          {/* Detalles con emojis */}
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography variant="subtitle2">
                                👤 <b>Usuario creador:</b> {usuario.first_name} {usuario.last_name}
                              </Typography>
                              {item.data.correlativo && (
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  🧾 <b>Correlativo:</b> {item.data.correlativo}
                                </Typography>
                              )}
                              {item.data.anotaciones && (
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  📝 <b>Anotaciones:</b> {item.data.anotaciones}
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>

                          {/* Monto */}
                          <TableCell align="right">
                            <Typography
                              variant="subtitle2"
                              color={esIng ? 'success.main' : 'error.main'}
                            >
                              {esIng ? '+' : '-'}{' '}
                              {formatearQuetzales(Math.abs(item.data.monto_total))}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                );
              };

              return (
                <Table>
                  <TableBody>
                    {movimientosFiltrados
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, index) => {
                        const fechaFormatted = formatearFecha(item.data.fecha);
                        const usuario = item.data.usuario_registro;
                        const esIngreso = item.tipo === 'Ingreso';

                        return (
                          <TableRow key={index}>
                            {/* Fecha */}
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

                            {/* Detalles */}
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="subtitle2">
                                  👤 <b>Usuario creador:</b> {usuario.first_name}{' '}
                                  {usuario.last_name}
                                </Typography>
                                {item.data.correlativo && (
                                  <Typography
                                    color="text.secondary"
                                    variant="body2"
                                  >
                                    🧾 <b>Correlativo:</b> {item.data.correlativo}
                                  </Typography>
                                )}
                                {item.data.anotaciones && (
                                  <Typography
                                    color="text.secondary"
                                    variant="body2"
                                  >
                                    📝 <b>Anotaciones:</b> {item.data.anotaciones}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            {/* Monto */}
                            <TableCell
                              width={150}
                              align="center"
                            >
                              <Typography
                                variant="subtitle2"
                                color={esIngreso ? 'success.main' : 'error.main'}
                              >
                                {esIngreso ? '+' : '-'}{' '}
                                {formatearQuetzales(Math.abs(item.data.monto_total))}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              );
            }}
          </TablaPaginadaConFiltros>
        </Card>
      </Box>
    </Modal>
  );
};
