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

import { ModalEditarCosto } from './editar-costo-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { Costo } from '../index.d';
import { ModalEliminar } from 'src/components/eliminar-modal';

interface ModalListaCostosProps {
  open: boolean;
  onClose: () => void;
  costos: Costo[];
  fetchCostos: (filtros: {
    search: string;
    fechaInicio: Date | null;
    fechaFin: Date | null;
  }) => void;
}

export const ModalListaCostos: FC<ModalListaCostosProps> = ({ open, onClose, costos, fetchCostos }) => {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [costoAEliminar, setCostoAEliminar] = useState<Costo | null>(null);

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
            <CardHeader title="Historial de costos" />
            <Divider />

            <TablaPaginadaConFiltros
              onFiltrar={({ search, fechaInicio, fechaFin }) => {
                fetchCostos({
                  search,
                  fechaInicio: fechaInicio ?? null,
                  fechaFin: fechaFin ?? null,
                });
              }}
              totalItems={costos.length}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {costos.slice((currentPage - 1) * 5, currentPage * 5).map((costo, index) => {
                      const globalIndex = index + (currentPage - 1) * 5;
                      return (
                        <TableRow key={costo.id_pago || index}>
                          <TableCell width={100}>
                            <Box sx={{ p: 1 }}>
                              <Typography
                                align="center"
                                color="text.secondary"
                                variant="subtitle2"
                              >
                                {formatearFecha(costo.fecha_pago)}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2">{costo.usuario_registro}</Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              {costo.tipo_pago} - {costo.tipo_documento}
                            </Typography>
                            {costo.anotaciones && (
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {costo.anotaciones}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <Typography
                              color="success.main"
                              variant="subtitle2"
                            >
                              {formatearQuetzales(Number(costo.monto_total))}
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
                                  setCostoAEliminar(costo);
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
        <ModalEditarCosto
          open={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          initialData={costos[editandoIndex]}
          onConfirm={(data) => {
            console.log('Costo editado:', data);
            setModalEditarAbierto(false);
          }}
        />
      )}

      <ModalEliminar
        type="costo"
        open={!!costoAEliminar}
        onClose={() => setCostoAEliminar(null)}
        onConfirm={() => {
          console.log('Costo eliminado');
          setCostoAEliminar(null);
        }}
      />
    </>
  );
};