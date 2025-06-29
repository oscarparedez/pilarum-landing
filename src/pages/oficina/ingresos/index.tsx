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

interface Ingreso {
  id_pago: string;
  proyecto: {
    id: string;
    nombre: string;
  };
  monto_total: number;
  fecha_pago: string;
  tipo_ingreso: string;
  tipo_documento: 'Transferencia' | 'Cheque' | 'Efectivo';
  anotaciones: string;
  usuario_registro: string;
  empresa: string;
}

const mockIngresos: Ingreso[] = [
  {
    id_pago: 'pag-001',
    proyecto: {
      id: '1',
      nombre: 'Residencial La Cumbre',
    },
    monto_total: 35000,
    fecha_pago: '2025-04-10',
    tipo_ingreso: 'Avance de obra',
    tipo_documento: 'Efectivo',
    anotaciones: 'Anticipo para iniciar fase #1',
    usuario_registro: 'Carlos M.',
    empresa: 'Constructora Alfa',
  },
  {
    id_pago: '2',
    proyecto: {
      id: 'proy-002',
      nombre: 'Torre Roble',
    },
    monto_total: 80000,
    fecha_pago: '2025-04-15',
    tipo_ingreso: 'Pago final',
    tipo_documento: 'Transferencia',
    anotaciones: 'Finalización de obra',
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

  const ingresosFiltrados = mockIngresos.filter((i) => {
    const matchSearch = filtros.search
      ? i.anotaciones.toLowerCase().includes(filtros.search.toLowerCase()) ||
        i.empresa.toLowerCase().includes(filtros.search.toLowerCase())
      : true;

    const fecha = new Date(i.fecha_pago);
    const matchInicio = filtros.fechaInicio ? fecha >= filtros.fechaInicio : true;
    const matchFin = filtros.fechaFin ? fecha <= filtros.fechaFin : true;

    return matchSearch && matchInicio && matchFin;
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
            <Typography variant="h5">Ingresos Generales</Typography>
            <Button
              variant="contained"
              onClick={() => {
                // lógica para abrir modal de nuevo ingreso
              }}
            >
              Agregar ingreso
            </Button>
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={ingresosFiltrados.length}
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
                      <TableCell>Tipo de ingreso</TableCell>
                      <TableCell>Documento</TableCell>
                      <TableCell>Anotaciones</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ingresosFiltrados
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((ingreso) => (
                        <TableRow
                          key={ingreso.id_pago}
                          hover
                        >
                          <TableCell>
                            {new Date(ingreso.fecha_pago).toLocaleDateString('es-GT')}
                          </TableCell>
                          <TableCell>{ingreso.proyecto.nombre}</TableCell>
                          <TableCell>{ingreso.empresa}</TableCell>
                          <TableCell>{formatearQuetzales(ingreso.monto_total)}</TableCell>
                          <TableCell>{ingreso.tipo_ingreso}</TableCell>
                          <TableCell>{ingreso.tipo_documento}</TableCell>
                          <TableCell>{ingreso.anotaciones}</TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => router.push(`/proyectos/${ingreso.proyecto.id}`)}
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
