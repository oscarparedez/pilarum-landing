import { NextPage } from 'next';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useCostosGeneralesApi } from 'src/api/costosGenerales/useCostosGeneralesApi';
import { useSociosApi } from 'src/api/socios/useSociosApi';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';
import { useOrdenesCompraApi } from 'src/api/ordenesCompra/useOrdenesCompraApi';
import { useEffect, useState } from 'react';
import { CostoGeneral, Socio } from 'src/api/types';
import { Table, TableHead, TableBody, TableRow, TableCell, Chip, Stack } from '@mui/material';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { useMaquinariasApi } from 'src/api/maquinaria/useMaquinariaApi';
import { BusquedaFiltradaCostos } from 'src/components/busqueda-filtrada-costos/busqueda-filtrada-costos';

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
  useEffect(() => {
    getSociosInternos().then(setSocios);
  }, [getSociosInternos]);

  return (
    <BusquedaFiltradaCostos<CostoGeneral>
      title="Costos Generales"
      fetchData={(filters) => getCostosGenerales(filters)}
      socios={socios}
      getProyectosByEmpresa={(empresaId) => getProyectos({ socio: empresaId })}
      getEquiposAll={() => getMaquinarias()}
      getOrdenesCompraAll={() => getOrdenesCompra()}
      getMonto={(c) => Number(c.monto || 0)}
      renderTable={(costos) => (
        <Table sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Fecha de movimiento</TableCell>
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
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
