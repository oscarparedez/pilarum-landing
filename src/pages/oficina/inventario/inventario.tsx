import {
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
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { useState } from 'react';
import { ModalMovimientosBodega } from './movimientos-bodega-modal';
import { useRouter } from 'next/router';

const INVENTARIO_MOCK = [
  {
    id: 'mat-001',
    nombre: 'Saco de cemento 20 kg',
    tipo: 'Construcción',
    cantidad: 50,
    unidad: 'sacos',
    movimientos: [
      {
        id: 'mov-001',
        tipo: 'entrada',
        cantidad: 30,
        usuario: 'Luis Gómez',
        fecha: '2025-05-12T08:00:00',
        origen: 'Proveedor XYZ',
      },
      {
        id: 'mov-002',
        tipo: 'salida',
        cantidad: 10,
        usuario: 'Ana Pérez',
        fecha: '2025-06-20T08:00:00',
        destino: 'Proyecto Oasis',
      },
    ],
  },
];

export const Inventario = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);
  const router = useRouter();

  const abrirModal = (producto: any) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  return (
    <>
      <Card sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Inventario en bodega central</Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              onClick={() => router.push('/oficina/inventario/rebajar')}
            >
              Rebajar inventario
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push('/oficina/inventario/crear')}
            >
              Crear orden de compra
            </Button>
          </Stack>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={INVENTARIO_MOCK.length}
          onFiltrar={() => {}}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = INVENTARIO_MOCK.slice((currentPage - 1) * 5, currentPage * 5);
            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Material</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow
                        key={item.id}
                        hover
                      >
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>{item.unidad}</TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModal(item)}>
                            <SvgIcon>
                              <VisibilityIcon />
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

      {productoSeleccionado && (
        <ModalMovimientosBodega
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          producto={productoSeleccionado.nombre}
          unidad={productoSeleccionado.unidad}
          movimientos={productoSeleccionado.movimientos}
        />
      )}
    </>
  );
};
