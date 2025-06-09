import { FC, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  SvgIcon,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import { subDays } from 'date-fns';
import { ModalMovimientos } from './movimientos-material-planificado-modal';
import { ModalEnviarMaterial } from './enviar-material-modal';
import { MaterialItem } from '../index.d';

export const MaterialPlanificado: FC<{ materialPlanificado: MaterialItem[] }> = ({ materialPlanificado }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');

  const [modalEnviarOpen, setModalEnviarOpen] = useState(false);
  const [productoEnviar, setProductoEnviar] = useState<MaterialItem | null>(null);

  const abrirModal = (producto: MaterialItem) => {
    const mockMovimientos = [
      {
        id: 'mov-001',
        cantidad: 20,
        unidad: producto.unidad,
        usuario: 'Carlos Méndez',
        fecha: new Date().getTime(),
        tipo: 'entrada',
      },
      {
        id: 'mov-002',
        cantidad: 10,
        unidad: producto.unidad,
        usuario: 'María López',
        fecha: subDays(new Date(), 1).getTime(),
        tipo: 'salida',
      },
    ];
    setProductoSeleccionado(producto.nombre);
    setMovimientos(mockMovimientos);
    setModalOpen(true);
  };

  const abrirModalEnviar = (producto: MaterialItem) => {
    setProductoEnviar(producto);
    setModalEnviarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Material planificado</Typography>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={materialPlanificado.length}
          onFiltrar={() => {}}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const materialFiltrado = materialPlanificado
              .sort((a, b) =>
                orden === 'asc'
                  ? a.nombre.localeCompare(b.nombre)
                  : b.nombre.localeCompare(a.nombre)
              )
              .slice((currentPage - 1) * 5, currentPage * 5);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Material</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materialFiltrado.map((item) => (
                      <TableRow
                        hover
                        key={item.id}
                      >
                        <TableCell>
                          <Typography variant="subtitle2">{item.nombre}</Typography>
                        </TableCell>
                        <TableCell>{item.tipo}</TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>{item.unidad}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => abrirModal(item)}>
                            <SvgIcon>
                              <VisibilityIcon />
                            </SvgIcon>
                          </IconButton>
                          <IconButton onClick={() => abrirModalEnviar(item)}>
                            <SvgIcon>
                              <SendIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </TablaPaginadaConFiltros>
      </Card>

      <ModalMovimientos
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        movimientos={movimientos}
        producto={productoSeleccionado}
      />

      {productoEnviar && (
        <ModalEnviarMaterial
          open={modalEnviarOpen}
          onClose={() => setModalEnviarOpen(false)}
          producto={productoEnviar.nombre}
          cantidadDisponible={productoEnviar.cantidad}
          unidad={productoEnviar.unidad}
        />
      )}
    </Box>
  );
};
