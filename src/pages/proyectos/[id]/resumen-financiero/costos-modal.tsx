import { FC, useCallback, useMemo, useState } from 'react';
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
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { Costo } from '../index.d';
import { ModalEliminar } from 'src/components/eliminar-modal';

interface ModalListaCostosProps {
  open: boolean;
  onClose: () => void;
  costos: Costo[];
  tiposPago: { id: number; nombre: string }[];
  onActualizarCosto: (
    id: number,
    data: {
      fecha_pago: string;
      tipo_pago: number;
      tipo_documento: string;
      anotaciones?: string;
      correlativo?: string;
      monto_total: number;
      usuario_registro: string;
    }
  ) => Promise<void>;
  onEliminarCosto: (id_pago: number) => Promise<void>;
}

const formatTipoDocumento = (tipo: string) => {
  if (!tipo) return '';
  return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
};

export const ModalListaCostos: FC<ModalListaCostosProps> = ({
  open,
  onClose,
  costos,
  tiposPago,
  onActualizarCosto,
  onEliminarCosto,
}) => {
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({ search: '' });

  const [costoEditando, setCostoEditando] = useState<Costo | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [costoAEliminar, setCostoAEliminar] = useState<Costo | null>(null);

  const costosFiltrados = useMemo(() => {
    return aplicarFiltros(costos, filtros, {
      camposTexto: [
        'usuario_registro.first_name',
        'usuario_registro.last_name',
        'tipo_pago.nombre',
        'tipo_documento',
        'anotaciones',
      ],
      campoFecha: 'fecha_pago',
    });
  }, [costos, filtros]);

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const handleActualizarCosto = useCallback(
    async (
      id: number,
      data: {
        fecha_pago: string;
        tipo_pago: number;
        tipo_documento: string;
        anotaciones?: string;
        correlativo?: string;
        monto_total: number;
        usuario_registro: string;
      }
    ) => {
      if (costoEditando) {
        await onActualizarCosto(id, data);
        setCostoEditando(null);
        setModalEditarAbierto(false);
      }
    },
    [costoEditando, onActualizarCosto]
  );

  const handleEliminarCosto = useCallback(() => {
    if (costoAEliminar?.id_pago) {
      onEliminarCosto(costoAEliminar.id_pago);
      setCostoAEliminar(null);
    }
  }, [costoAEliminar, onEliminarCosto]);

  const handleCloseEditar = useCallback(() => {
    setModalEditarAbierto(false);
  }, []);

  const handleCloseEliminar = useCallback(() => {
    setCostoAEliminar(null);
  }, []);

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
            width: { xs: '95%', sm: '90%', md: 900 },
            maxHeight: '90vh',
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Card>
            <CardHeader title="Historial de costos" />
            <Divider />

            <TablaPaginadaConFiltros
              totalItems={costosFiltrados.length}
              onFiltrar={handleFiltrar}
            >
              {(currentPage) => (
                <Table>
                  <TableBody>
                    {costosFiltrados.slice((currentPage - 1) * 5, currentPage * 5).map((costo) => (
                      <TableRow key={costo.id_pago}>
                        <TableCell width={100}>
                          <Typography
                            align="center"
                            color="text.secondary"
                            variant="subtitle2"
                          >
                            {formatearFecha(costo.fecha_pago)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2">
                            {costo.usuario_registro.first_name} {costo.usuario_registro.last_name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            {costo.tipo_pago.nombre} – {formatTipoDocumento(costo.tipo_documento)}
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
                                setCostoEditando(costo);
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
                    ))}
                  </TableBody>
                </Table>
              )}
            </TablaPaginadaConFiltros>
          </Card>
        </Box>
      </Modal>

      {costoEditando && (
        <ModalEditarCosto
          open={modalEditarAbierto}
          onClose={handleCloseEditar}
          initialData={costoEditando}
          tiposPago={tiposPago}
          onConfirm={handleActualizarCosto}
        />
      )}

      <ModalEliminar
        type="costo"
        open={!!costoAEliminar}
        onClose={handleCloseEliminar}
        onConfirm={handleEliminarCosto}
      />
    </>
  );
};
