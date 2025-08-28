import { NextPage } from 'next';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useIngresosGeneralesApi } from 'src/api/ingresosGenerales/useIngresosGeneralesApi';
import { useSociosApi } from 'src/api/socios/useSociosApi';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';
import { useTiposIngresoApi } from 'src/api/tipoIngresos/useTipoIngresosApi';
import { useEffect, useState } from 'react';
import { IngresoGeneral, Socio, TipoIngreso } from 'src/api/types';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import {
  BusquedaFiltrada,
  ExtraFilterOption,
} from 'src/components/busqueda-filtrada-ingresos/busqueda-filtrada-ingresos';

const Page: NextPage = () => {
  const { getIngresosGenerales } = useIngresosGeneralesApi();
  const { getSociosInternos } = useSociosApi();
  const { getProyectos } = useProyectosApi();
  const { getTiposIngreso } = useTiposIngresoApi();
  const [ loading, setLoading ] = useState(true);

  const [socios, setSocios] = useState<Socio[]>([]);
  const [tiposIngreso, setTiposIngreso] = useState<TipoIngreso[]>([]);

  useEffect(() => {
    setLoading(true);
    try {
      Promise.all([getSociosInternos(), getTiposIngreso()]).then(([s, t]) => {
        setSocios(s);
        setTiposIngreso(t);
      });
    } catch (error) {
      console.error('Hubo un error cargando los socios o tipos de ingreso');
    } finally {
      setLoading(false);
    }
  }, [getSociosInternos, getTiposIngreso]);

  const extraFilters: ExtraFilterOption[] = [
    { label: 'Tipo de ingreso', name: 'tipo_ingreso', options: tiposIngreso },
  ];

  return (
    <BusquedaFiltrada<IngresoGeneral>
      title="Ingresos Generales"
      socios={socios}
      fetchData={(filters) => getIngresosGenerales(filters)}
      getProyectos={(empresaId) => getProyectos({ socio: empresaId })}
      extraFilters={extraFilters}
      getMonto={(ing) => Number(ing.monto_total || 0)}
      renderTable={(ingresos) => (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Fecha de creación</TableCell>
                <TableCell>Fecha de ingreso</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell>Socio</TableCell>
                <TableCell>Tipo de ingreso</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Anotaciones</TableCell>
                <TableCell>Monto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingresos.map((ing, index) => (
                <TableRow key={ing.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatearFecha(ing.fecha_creacion)}</TableCell>
                  <TableCell>{formatearFecha(ing.fecha_ingreso)}</TableCell>
                  <TableCell>{ing.proyecto?.nombre ?? '—'}</TableCell>
                  <TableCell>{ing.proyecto?.socio_asignado?.nombre ?? 'Sin socio'}</TableCell>
                  <TableCell>
                    <Chip
                      label={ing.tipo_ingreso?.nombre ?? '—'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {ing.usuario_creador?.first_name} {ing.usuario_creador?.last_name}
                  </TableCell>
                  <TableCell>{ing.tipo_documento}</TableCell>
                  <TableCell>{ing.anotaciones}</TableCell>
                  <TableCell>
                    <b>{formatearQuetzales(Number(ing.monto_total))}</b>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
