import { FC, useEffect, useMemo, useState } from 'react';
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
import { useIngresosGeneralesApi } from 'src/api/ingresosGenerales/useIngresosGeneralesApi';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { formatearFecha } from 'src/utils/format-date';
import { IngresoGeneral, Socio, TipoIngreso } from 'src/api/types';
import { useSociosApi } from 'src/api/socios/useSociosApi';
import toast from 'react-hot-toast';
import { useTiposIngresoApi } from 'src/api/tipoIngresos/useTipoIngresosApi';

const Page: NextPage = () => {
  const router = useRouter();
  const { getSociosInternos } = useSociosApi();
  const { getIngresosGenerales } = useIngresosGeneralesApi();
  const { getTiposIngreso } = useTiposIngresoApi();

  const [ingresos, setIngresos] = useState<IngresoGeneral[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [tiposIngreso, setTiposIngreso] = useState<TipoIngreso[]>([]);

  const [filtros, setFiltros] = useState<{
    search: string;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
    empresa?: string;
    tipoIngresoId?: number;
  }>({
    search: '',
    fechaInicio: null,
    fechaFin: null,
    empresa: '',
    tipoIngresoId: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingresosData, sociosData, tipoIngresosData] = await Promise.all([
          getIngresosGenerales(),
          getSociosInternos(),
          getTiposIngreso(),
        ]);
        setIngresos(ingresosData);
        setSocios(sociosData);
        setTiposIngreso(tipoIngresosData);
      } catch (err) {
        toast.error('Error al cargar ingresos generales, socios o tipos de ingreso');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getIngresosGenerales, getSociosInternos, getTiposIngreso]);

  const ingresosFiltrados = useMemo(() => {
    return aplicarFiltros(ingresos, filtros, {
      camposTexto: [
        'anotaciones',
        'proyecto.nombre',
        'proyecto.socio_asignado.nombre',
        'tipo_ingreso.nombre',
        'tipo_documento',
        'usuario_creador.first_name',
        'usuario_creador.last_name',
      ],
      campoFecha: 'fecha_ingreso',
      campoEmpresa: 'proyecto.socio_asignado.nombre',
      campoTipoIngresoId: 'tipo_ingreso.id',
    });
  }, [ingresos, filtros]);

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
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={ingresosFiltrados.length}
            onFiltrar={setFiltros}
            filtrosEstado={false}
            filtrosRol={false}
            filtrosEmpresa={true}
            empresas={socios}
            filtrosTipoIngreso={true}
            tiposIngreso={tiposIngreso}
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
                      <TableCell>Socio Asignado</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Monto</TableCell>
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
                          key={ingreso.id}
                          hover
                        >
                          <TableCell>{formatearFecha(ingreso.fecha_ingreso)}</TableCell>
                          <TableCell>{ingreso.proyecto.nombre}</TableCell>
                          <TableCell>{ingreso.proyecto.socio_asignado.nombre}</TableCell>
                          <TableCell>
                            {ingreso.usuario_creador.first_name} {ingreso.usuario_creador.last_name}
                          </TableCell>
                          <TableCell>{formatearQuetzales(Number(ingreso.monto_total))}</TableCell>
                          <TableCell>{ingreso.tipo_ingreso.nombre}</TableCell>
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
