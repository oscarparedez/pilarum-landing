import { FC, useState, useMemo } from 'react';
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

import { ModalEditarIngreso } from './editar-ingreso-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { Ingreso } from '../index.d';
import { ModalEliminar } from 'src/components/eliminar-modal';

interface ModalListaIngresosProps {
  open: boolean;
  onClose: () => void;
  ingresos: Ingreso[];
  tiposIngreso: { id: number; nombre: string }[];
  onActualizarIngreso: (id: number, data: {
  monto_total: number;
  tipo_ingreso: number;
  tipo_documento: string;
  fecha_ingreso: string;
  anotaciones: string;
}) => Promise<void>;
  onEliminarIngreso: (ingreso_id: number) => Promise<void>;
}

const formatTipoDocumento = (tipo: string) => {
  if (!tipo) return '';
  return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
};

export const ModalListaIngresos: FC<ModalListaIngresosProps> = ({
  open,
  onClose,
  ingresos,
  tiposIngreso,
  onActualizarIngreso,
  onEliminarIngreso,
}) => {
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const [ingresoEditando, setIngresoEditando] = useState<Ingreso | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [ingresoAEliminar, setIngresoAEliminar] = useState<Ingreso | null>(null);

  const ingresosFiltrados = useMemo(() => {
    return aplicarFiltros(ingresos, filtros, {
      camposTexto: [
        'usuario_registro.first_name',
        'usuario_registro.last_name',
        'tipo_ingreso.nombre',
        'tipo_documento',
        'anotaciones',
      ],
      campoFecha: 'fecha_ingreso',
    });
  }, [ingresos, filtros]);

    const handleEliminarIngreso = () => {
    if (ingresoAEliminar) {
      onEliminarIngreso(ingresoAEliminar.id_ingreso);
      setIngresoAEliminar(null);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-lista-ingresos"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: 900 },
            maxHeight: '90vh',
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Card>
            <CardHeader title="Historial de ingresos" />
            <Divider />

            <TablaPaginadaConFiltros
              totalItems={ingresosFiltrados.length}
              onFiltrar={(f) => setFiltros(f)}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {ingresosFiltrados
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((ingreso) => (
                        <TableRow key={ingreso.id_ingreso}>
                          <TableCell width={100}>
                            <Typography
                              align="center"
                              color="text.secondary"
                              variant="subtitle2"
                            >
                              {formatearFecha(ingreso.fecha_ingreso)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2">
                              {ingreso.usuario_registro.first_name}{' '}
                              {ingreso.usuario_registro.last_name}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              {ingreso.tipo_ingreso.nombre} –{' '}
                              {formatTipoDocumento(ingreso.tipo_documento)}
                            </Typography>
                            {ingreso.anotaciones && (
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {ingreso.anotaciones}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <Typography
                              color="success.main"
                              variant="subtitle2"
                            >
                              {formatearQuetzales(ingreso.monto_total)}
                            </Typography>

                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                            >
                              <IconButton
                                onClick={() => {
                                  setIngresoEditando(ingreso);
                                  setModalEditarAbierto(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  setIngresoAEliminar(ingreso);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
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

      {ingresoEditando && (
        <ModalEditarIngreso
          open={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          initialData={ingresoEditando}
          tiposIngreso={tiposIngreso}
          onConfirm={onActualizarIngreso}
        />
      )}

      <ModalEliminar
        type="ingreso"
        open={!!ingresoAEliminar}
        onClose={() => setIngresoAEliminar(null)}
        onConfirm={handleEliminarIngreso}
      />
    </>
  );
};
