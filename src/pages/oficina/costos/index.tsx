import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { formatearFecha } from 'src/utils/format-date';
import { useCostosGeneralesApi } from 'src/api/costosGenerales/useCostosGeneralesApi';
import { useSociosApi } from 'src/api/socios/useSociosApi';
import { CostoGeneral, Socio } from 'src/api/types';
import toast from 'react-hot-toast';

const rutasPorTipo: Record<
  string,
  { pagos?: string[]; ruta: (id: number) => string }[]
> = {
  proyecto: [
    { ruta: (id) => `/proyectos/${id}` }
  ],
  maquinaria: [
    {
      pagos: ['Combustible de recurso', 'Mantenimiento de recurso'],
      ruta: (id) => `/maquinaria/${id}`
    }
  ],
  equipo: [
    {
      pagos: ['Compra de maquinaria', 'Compra de herramienta'],
      ruta: (id) => `/maquinaria/${id}`
    }
  ]
};

const Page: NextPage = () => {
  const router = useRouter();
  const { getSociosInternos } = useSociosApi();
  const { getCostosGenerales } = useCostosGeneralesApi();

  const [costos, setCostos] = useState<CostoGeneral[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
  }>({
    search: '',
    fechaInicio: null,
    fechaFin: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [costosData, sociosData] = await Promise.all([
          getCostosGenerales(),
          getSociosInternos(),
        ]);
        setCostos(costosData);
        setSocios(sociosData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getCostosGenerales, getSociosInternos]);

  const costosFiltrados = useMemo(() => {
    return aplicarFiltros(costos, filtros, {
      camposTexto: [
        'origen',
        'tipo_pago',
        'tipo_documento',
        'descripcion',
        'usuario_registro.first_name',
        'usuario_registro.last_name',
      ],
      campoFecha: 'fecha',
    });
  }, [costos, filtros]);

  const handleVerDetalle = useCallback((costo: CostoGeneral) => {
  const reglas = rutasPorTipo[costo.tipo_origen];

  if (!reglas) {
    toast.error('No hay una vista asignada para este tipo de origen');
    return;
  }

  const regla = reglas.find(
    (r) => !r.pagos || r.pagos.includes(String(costo.tipo_pago))
  );

  if (regla) {
    router.push(regla.ruta(costo.origen_id));
  } else {
    toast.error('No hay una vista asignada para este tipo de origen');
  }
}, [router]);


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
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={costosFiltrados.length}
            onFiltrar={setFiltros}
            filtrosEstado={false}
            filtrosRol={false}
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
                      <TableCell>Origen</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Motivo</TableCell>
                      <TableCell>Documento</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {costosFiltrados
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((costo, index) => (
                        <TableRow
                          key={index}
                          hover
                        >
                          <TableCell>{formatearFecha(costo.fecha)}</TableCell>
                          <TableCell>{costo.origen}</TableCell>
                          <TableCell>
                            {costo.usuario_registro.first_name} {costo.usuario_registro.last_name}
                          </TableCell>
                          <TableCell>{formatearQuetzales(costo.monto)}</TableCell>
                          <TableCell>{String(costo.tipo_pago)}</TableCell>
                          <TableCell>{costo.tipo_documento}</TableCell>
                          <TableCell>{costo.descripcion}</TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleVerDetalle(costo)}
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
