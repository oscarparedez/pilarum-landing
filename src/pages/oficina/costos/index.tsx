import { NextPage } from 'next';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useCostosGeneralesApi } from 'src/api/costosGenerales/useCostosGeneralesApi';
import { useSociosApi } from 'src/api/socios/useSociosApi';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';
import { useOrdenesCompraApi } from 'src/api/ordenesCompra/useOrdenesCompraApi';
import { useEffect, useState } from 'react';
import { CostoGeneral, Socio } from 'src/api/types';
import { Table, TableHead, TableBody, TableRow, TableCell, Chip, Stack, Button } from '@mui/material';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useMaquinariasApi } from 'src/api/maquinaria/useMaquinariaApi';
import { BusquedaFiltradaCostos } from 'src/components/busqueda-filtrada-costos/busqueda-filtrada-costos';
import { CostosChartsModal } from 'src/components/costos-charts-modal';

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

const chipColorPorOrigen = (tipo: string) => {
  const t = (tipo || '').toLowerCase();
  if (t === 'proyecto') return 'primary';
  if (t === 'compra_maquinaria') return 'warning';
  if (t === 'gasto_maquinaria') return 'info';
  if (t === 'orden_compra') return 'success';
  return 'default';
};

const Page: NextPage = () => {
  const { getCostosGenerales } = useCostosGeneralesApi();
  const { getSociosInternos } = useSociosApi();
  const { getProyectos } = useProyectosApi();
  const { getMaquinarias } = useMaquinariasApi();
  const { getOrdenesCompra } = useOrdenesCompraApi();

  const [socios, setSocios] = useState<Socio[]>([]);
  const [chartsModalOpen, setChartsModalOpen] = useState(false);
  const [currentCostos, setCurrentCostos] = useState<CostoGeneral[]>([]);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  // Estados para filtros individuales
  const [tipoOrigenFiltrado, setTipoOrigenFiltrado] = useState<string | undefined>();
  const [empresaFiltrada, setEmpresaFiltrada] = useState<string | undefined>();
  const [proyectoFiltrado, setProyectoFiltrado] = useState<string | undefined>();
  const [equipoFiltrado, setEquipoFiltrado] = useState<string | undefined>();
  const [ordenCompraFiltrada, setOrdenCompraFiltrada] = useState<string | undefined>();
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  useEffect(() => {
    getSociosInternos().then(setSocios);
  }, [getSociosInternos]);

  return (
    <>
      <BusquedaFiltradaCostos<CostoGeneral>
        title="Costos Generales"
        fetchData={(filters) => {
          setCurrentFilters(filters);
          
          // Guardar filtros individuales para el modal
          setTipoOrigenFiltrado(filters.tipo_origen);
          
          // Encontrar nombres de empresa y proyecto
          if (filters.empresa) {
            const empresa = socios.find(s => s.id === filters.empresa);
            setEmpresaFiltrada(empresa?.nombre);
          } else {
            setEmpresaFiltrada(undefined);
          }
          
          // Para proyecto, necesitamos hacer una llamada para obtener el nombre
          if (filters.proyecto) {
            getProyectos({ socio: filters.empresa }).then(proyectos => {
              const proyecto = proyectos.find(p => p.id === filters.proyecto);
              setProyectoFiltrado(proyecto?.nombre);
            });
          } else {
            setProyectoFiltrado(undefined);
          }
          
          // Para equipo
          if (filters.equipo) {
            getMaquinarias().then(equipos => {
              const equipo = equipos.find(e => e.id === filters.equipo);
              setEquipoFiltrado(equipo?.nombre);
            });
          } else {
            setEquipoFiltrado(undefined);
          }
          
          // Para orden de compra (es string, no necesita lookup)
          setOrdenCompraFiltrada(filters.orden_compra);
          
          // Procesar fechas
          if (filters.fecha_inicio) {
            const [day, month, year] = filters.fecha_inicio.split('-');
            setFechaInicio(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
          } else {
            setFechaInicio(null);
          }
          
          if (filters.fecha_fin) {
            const [day, month, year] = filters.fecha_fin.split('-');
            setFechaFin(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
          } else {
            setFechaFin(null);
          }
          
          return getCostosGenerales(filters).then(data => {
            setCurrentCostos(data);
            return data;
          });
        }}
        socios={socios}
        getProyectosByEmpresa={(empresaId) => getProyectos({ socio: empresaId })}
        getEquiposAll={() => getMaquinarias()}
        getOrdenesCompraAll={() => getOrdenesCompra()}
        getMonto={(c) => Number(c.monto || 0)}
        extraButtons={(costos) => (
          <Button
            variant="outlined"
            size="small"
            startIcon={<BarChartIcon />}
            onClick={() => setChartsModalOpen(true)}
            sx={{ ml: 1 }}
          >
            Mostrar Gráficos
          </Button>
        )}
        renderTable={(costos) => (
        <Table sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Fecha de traslado</TableCell>
              <TableCell>Origen</TableCell>
              <TableCell>Tipo origen</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costos.map((c, index) => (
              <TableRow key={`${c.tipo_origen}-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{formatearFecha(c.fecha_creacion)}</TableCell>
                <TableCell>{formatearFecha(c.fecha)}</TableCell>
                <TableCell>{c.origen}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                      >
                        {iconPorOrigen(String(c.tipo_origen))}
                        <span>{labelTipoOrigen[c.tipo_origen] ?? c.tipo_origen}</span>
                      </Stack>
                    }
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {c.usuario_registro?.first_name} {c.usuario_registro?.last_name}
                </TableCell>
                <TableCell>{c.tipo_pago}</TableCell>
                <TableCell>{c.tipo_documento}</TableCell>
                <TableCell>{c.descripcion}</TableCell>
                <TableCell>
                  <b>{formatearQuetzales(Number(c.monto))}</b>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      />

      <CostosChartsModal
        open={chartsModalOpen}
        onClose={() => setChartsModalOpen(false)}
        costos={currentCostos}
        tipoOrigenFiltrado={tipoOrigenFiltrado}
        empresaFiltrada={empresaFiltrada}
        proyectoFiltrado={proyectoFiltrado}
        equipoFiltrado={equipoFiltrado}
        ordenCompraFiltrada={ordenCompraFiltrada}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
