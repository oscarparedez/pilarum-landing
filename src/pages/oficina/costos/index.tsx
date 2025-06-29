import { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { formatearQuetzales } from 'src/utils/format-currency';

interface Costo {
  id_pago: string;
  proyecto: {
    id: string;
    nombre: string;
  };
  monto_total: number;
  fecha_pago: string;
  tipo_pago: 'Pago a maestro de obra' | 'Pago a socio';
  tipo_documento: 'Transferencia' | 'Cheque' | 'Efectivo';
  anotaciones: string;
  usuario_registro: string;
  empresa: string;
}

const mockCostos: Costo[] = [
  {
    id_pago: 'pag-101',
    proyecto: {
      id: 'proy-001',
      nombre: 'Residencial La Cumbre',
    },
    monto_total: 20000,
    fecha_pago: '2025-05-01',
    tipo_pago: 'Pago a maestro de obra',
    tipo_documento: 'Efectivo',
    anotaciones: 'Pago semanal',
    usuario_registro: 'Karla S.',
    empresa: 'Constructora Alfa',
  },
  {
    id_pago: 'pag-102',
    proyecto: {
      id: 'proy-002',
      nombre: 'Torre Roble',
    },
    monto_total: 50000,
    fecha_pago: '2025-05-03',
    tipo_pago: 'Pago a socio',
    tipo_documento: 'Transferencia',
    anotaciones: 'Distribución de utilidad',
    usuario_registro: 'Luis G.',
    empresa: 'Inversiones Roble',
  },
];

const Page: NextPage = () => {
  const router = useRouter();
  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
    empresa?: string;
  }>({
    search: '',
    fechaInicio: null,
    fechaFin: null,
    empresa: '',
  });

  const costosFiltrados = mockCostos.filter((c) => {
    const matchSearch = filtros.search
      ? c.anotaciones.toLowerCase().includes(filtros.search.toLowerCase()) ||
        c.empresa.toLowerCase().includes(filtros.search.toLowerCase())
      : true;

    const fecha = new Date(c.fecha_pago);
    const matchInicio = filtros.fechaInicio ? fecha >= filtros.fechaInicio : true;
    const matchFin = filtros.fechaFin ? fecha <= filtros.fechaFin : true;
    const matchEmpresa = filtros.empresa ? c.empresa === filtros.empresa : true;

    return matchSearch && matchInicio && matchFin && matchEmpresa;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 3, py: 3 }}
          >
            <Typography variant="h5">Costos Generales</Typography>
            <Button
              variant="contained"
              onClick={() => {
                // lógica para abrir modal de nuevo costo
              }}
            >
              Registrar costo
            </Button>
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={costosFiltrados.length}
            onFiltrar={setFiltros}
            filtrosEstado={false}
            filtrosRol={false}
            filtrosEmpresa={true}
          >
            {(currentPage) => (
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 600 }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Proyecto</TableCell>
                      <TableCell>Empresa</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Tipo de costo</TableCell>
                      <TableCell>Documento</TableCell>
                      <TableCell>Anotaciones</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {costosFiltrados.slice((currentPage - 1) * 5, currentPage * 5).map((costo) => (
                      <TableRow
                        key={costo.id_pago}
                        hover
                      >
                        <TableCell>
                          {new Date(costo.fecha_pago).toLocaleDateString('es-GT')}
                        </TableCell>
                        <TableCell>{costo.proyecto.nombre}</TableCell>
                        <TableCell>{costo.empresa}</TableCell>
                        <TableCell>{formatearQuetzales(costo.monto_total)}</TableCell>
                        <TableCell>{costo.tipo_pago}</TableCell>
                        <TableCell>{costo.tipo_documento}</TableCell>
                        <TableCell>{costo.anotaciones}</TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => router.push(`/proyectos/${costo.proyecto.id}`)}
                            >
                              Ver
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TablaPaginadaConFiltros>
        </CardContent>
      </Card>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
