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
  Chip,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Tooltip from '@mui/material/Tooltip';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // orden_compra
import ApartmentIcon from '@mui/icons-material/Apartment'; // proyecto
import BuildCircleIcon from '@mui/icons-material/BuildCircle'; // gasto_maquinaria
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'; // compra_maquinaria
import { formatearQuetzales } from 'src/utils/format-currency';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { formatearFecha } from 'src/utils/format-date';
import { useCostosGeneralesApi } from 'src/api/costosGenerales/useCostosGeneralesApi';
import { useSociosApi } from 'src/api/socios/useSociosApi';
import { CostoGeneral, Socio } from 'src/api/types';
import toast from 'react-hot-toast';

const labelTipoOrigen: Record<string, string> = {
  proyecto: 'Proyecto',
  orden_compra: 'Orden de compra',
  gasto_maquinaria: 'Gasto de Maquinaria',
  compra_maquinaria: 'Compra de Maquinaria',
};

const iconPorOrigen = (tipo: string) => {
  const t = (tipo || '').toLowerCase();
  if (t === 'orden_compra') return <Inventory2Icon fontSize="small" />;
  if (t === 'proyecto') return <ApartmentIcon fontSize="small" />;
  if (t === 'gasto_maquinaria') return <BuildCircleIcon fontSize="small" />;
  if (t === 'compra_maquinaria') return <PrecisionManufacturingIcon fontSize="small" />;
  return null;
};

const rutasPorTipo: Record<string, { pagos?: string[]; ruta: (id: number) => string }[]> = {
  proyecto: [{ ruta: (id) => `/proyectos/${id}` }],
  gasto_maquinaria: [
    {
      pagos: ['Combustible de recurso', 'Mantenimiento de recurso'],
      ruta: (id) => `/maquinaria/${id}`,
    },
  ],
  compra_maquinaria: [
    {
      pagos: ['Compra de maquinaria', 'Compra de herramienta'],
      ruta: (id) => `/maquinaria/${id}`,
    },
  ],
  orden_compra: [
    {
      pagos: ['Orden de compra'],
      ruta: (id) => `/oficina/inventario/orden-de-compra/${id}`,
    },
  ],
};

const normalizarTipoPago = (tp: string | number) => {
  if (typeof tp === 'number') {
    if (tp === 1) return 'Combustible de recurso';
    if (tp === 2) return 'Mantenimiento de recurso';
    return `Tipo ${tp}`;
  }
  return tp;
};

const chipColorPorOrigen = (tipo: string) => {
  const t = (tipo || '').toLowerCase();
  if (t === 'proyecto') return 'primary';
  if (t === 'compra_maquinaria') return 'warning';
  if (t === 'gasto_maquinaria') return 'info';
  if (t === 'orden_compra') return 'success';
  return 'default';
};
// ---------------------------

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
    tipoOrigen?: string;
  }>({
    search: '',
    fechaInicio: null,
    fechaFin: null,
    tipoOrigen: '',
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

  const opcionesTipoOrigen = useMemo(
    () => ['proyecto', 'orden_compra', 'gasto_maquinaria', 'compra_maquinaria'],
    []
  );

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
      campoTipoOrigen: 'tipo_origen',
    });
  }, [costos, filtros]);

  const handleVerDetalle = useCallback(
    (costo: CostoGeneral) => {
      console.log('costo tipo origen:', costo.tipo_origen);
      const reglas = rutasPorTipo[costo.tipo_origen];
      if (!reglas) {
        toast.error('No hay una vista asignada para este tipo de origen');
        return;
      }

      const tipoPagoNormalizado = normalizarTipoPago(costo.tipo_pago);
      const regla = reglas.find((r) => !r.pagos || r.pagos.includes(tipoPagoNormalizado));

      if (regla) {
        router.push(regla.ruta(costo.origen_id));
      } else {
        toast.error('No hay una vista asignada para este tipo de origen');
      }
    },
    [router]
  );

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
            filtrosTipoOrigen
          >
            {(currentPage) => (
              <TableContainer
                component={Paper}
                sx={{ overflowX: 'auto' }}
              >
                <Table sx={{ minWidth: 1100 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Tipo origen</TableCell>
                      <TableCell>Origen</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Motivo</TableCell>
                      <TableCell>Documento</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Usuario creador</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {costosFiltrados
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((costo, index) => {
                        const tp = normalizarTipoPago(costo.tipo_pago);
                        return (
                          <TableRow
                            key={index}
                            hover
                          >
                            <TableCell>{formatearFecha(costo.fecha)}</TableCell>

                            <TableCell>
                              <Chip
                                label={
                                  <Stack
                                    direction="row"
                                    spacing={0.75}
                                    alignItems="center"
                                  >
                                    {iconPorOrigen(String(costo.tipo_origen))}
                                    <span>
                                      {labelTipoOrigen[String(costo.tipo_origen)] ??
                                        costo.tipo_origen}
                                    </span>
                                  </Stack>
                                }
                                color={chipColorPorOrigen(String(costo.tipo_origen)) as any}
                                size="small"
                                variant="outlined"
                                tabIndex={0}
                                role="button"
                              />
                            </TableCell>

                            <TableCell>{costo.origen}</TableCell>

                            <TableCell>
                              {costo.usuario_registro?.first_name}{' '}
                              {costo.usuario_registro?.last_name}
                            </TableCell>

                            <TableCell>{formatearQuetzales(costo.monto)}</TableCell>

                            <TableCell>{tp}</TableCell>

                            <TableCell>{costo.tipo_documento}</TableCell>

                            <TableCell>{costo.descripcion}</TableCell>

                            <TableCell>
                              {costo.usuario_registro.first_name} {costo.usuario_registro.last_name}
                            </TableCell>
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
                        );
                      })}
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
