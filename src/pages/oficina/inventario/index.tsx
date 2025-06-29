import { useState } from 'react';
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
  Button,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalMovimientosBodega } from './movimientos-bodega-modal';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { HistorialOrdenesDeCompra } from './historial-ordenes-de-compra';
import { Inventario } from './inventario';
import { HistorialRebajasInventario } from './historial-rebajas-de-inventario';

const INVENTARIO_MOCK = [
  {
    id: 'mat-001',
    nombre: 'Saco de cemento 20 kg',
    tipo: 'Construcción',
    cantidad: 50,
    unidad: 'sacos',
    movimientos: [],
  },
];

const ORDENES_MOCK = [
  {
    id: '1',
    factura: 'FAC-00123',
    total: 1450,
    materiales: [
      { nombre: 'Saco de cemento 20 kg', unidad: 'sacos', cantidad: 30, costoUnitario: 25 },
      { nombre: 'Arena fina', unidad: 'm³', cantidad: 5, costoUnitario: 50 },
    ],
  },
  {
    id: '2',
    factura: 'FAC-00124',
    total: 850,
    materiales: [
      { nombre: 'Vigas de hierro', unidad: 'barras', cantidad: 10, costoUnitario: 85 },
    ],
  },
];

const Page: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);
  const router = useRouter();

  const abrirModal = (producto: any) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* INVENTARIO */}
      <Inventario />

      {/* HISTORIAL ORDENES DE COMPRA */}
      <HistorialOrdenesDeCompra />

      {/* HISTORIAL REBAJAS DE INVENTARIO */}
      <HistorialRebajasInventario />

      {/* Modal */}
      {productoSeleccionado && (
        <ModalMovimientosBodega
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          producto={productoSeleccionado.nombre}
          unidad={productoSeleccionado.unidad}
          movimientos={productoSeleccionado.movimientos}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
