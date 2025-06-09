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
  Button
} from '@mui/material';
import { ModalEditarIngreso } from './editar-ingreso-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { Ingreso } from '../index.d';

interface ModalListaIngresosProps {
  open: boolean;
  onClose: () => void;
  ingresos: Ingreso[];
  fetchIngresos: (params: {
    search: string;
    fechaInicio: Date | null;
    fechaFin: Date | null;
  }) => void;
}

export const ModalListaIngresos: FC<ModalListaIngresosProps> = ({ open, onClose, ingresos, fetchIngresos }) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

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
            maxWidth: 900,
            p: 2,
          }}
        >
          <Card>
            <CardHeader title="Historial de ingresos" />
            <Divider />

            <TablaPaginadaConFiltros
              onFiltrar={({ search, fechaInicio, fechaFin }) => {
                fetchIngresos({ search, fechaInicio, fechaFin });
              }}
              totalItems={ingresos.length} 
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {ingresos
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((ingreso, index) => {
                        const fechaFormatted = formatearFecha(ingreso.fecha_ingreso);
                        return (
                          <TableRow key={ingreso.id_ingreso || index}>
                            <TableCell width={100}>
                              <Box sx={{ p: 1 }}>
                                <Typography align="center" color="text.secondary" variant="subtitle2">
                                  {fechaFormatted}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">{ingreso.usuario_registro}</Typography>
                              <Typography color="text.secondary" variant="body2">
                                {ingreso.tipo_ingreso} - {ingreso.tipo_documento}
                              </Typography>
                              {ingreso.anotaciones && (
                                <Typography color="text.secondary" variant="body2">
                                  {ingreso.anotaciones}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Typography color="success.main" variant="subtitle2">{formatearQuetzales(ingreso.monto_total)}</Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ mt: 1 }}
                                onClick={() => {
                                  setEditandoIndex(index + (currentPage - 1) * 5);
                                  setModalEditarAbierto(true);
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

      {editandoIndex !== null && (
        <ModalEditarIngreso
          open={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          initialData={ingresos[editandoIndex]}
          onConfirm={(data) => {
            console.log('Ingreso editado:', data);
            setModalEditarAbierto(false);
          }}
        />
      )}
    </>
  );
};