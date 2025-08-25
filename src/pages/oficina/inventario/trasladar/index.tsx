import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  TextField,
  Typography,
  Paper,
  Tooltip,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { useInventarioApi } from 'src/api/inventario/useInventarioApi';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';
import { Proyecto, Inventario, NuevaOrdenMovimientoInventario } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useMovimientosInventarioApi } from 'src/api/movimientos/useMovimientosInventarioApi';

import {
  TablaLineasInventario,
  useLineasInventario,
  LineaInventarioUI,
} from '../components/tabla-lineas-inventario';

const Page: NextPage = () => {
  const router = useRouter();
  const { getInventario } = useInventarioApi();
  const { getProyectos } = useProyectosApi();
  const { crearOrdenMovimientoInventario } = useMovimientosInventarioApi();

  const [loading, setLoading] = useState(false);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [proyectoDestino, setProyectoDestino] = useState<Proyecto | null>(null);
  const [fechaTraslado, setFechaTraslado] = useState<Date>(new Date());

  const { lineas, setLineas } = useLineasInventario();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [proy, inv] = await Promise.all([getProyectos(), getInventario()]);
      setProyectos(proy);
      const { inventarios } = inv
      setInventario(inventarios);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando datos iniciales');
    } finally {
      setLoading(false);
    }
  }, [getProyectos, getInventario]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formValido = useMemo(() => {
    if (!proyectoDestino || !fechaTraslado || lineas.length === 0) return false;
    return lineas.every((l: LineaInventarioUI) => {
      const cant = Number(l.cantidad);
      const stock = l.item?.cantidad ?? 0;
      return l.item && Number.isFinite(cant) && cant > 0 && cant <= stock;
    });
  }, [proyectoDestino, fechaTraslado, lineas]);

  const guardarTraslado = useCallback(async () => {
    if (!formValido) return;
    setLoading(true);
    try {
      const body: NuevaOrdenMovimientoInventario = {
        fecha_movimiento: fechaTraslado.toISOString().split('T')[0],
        proyecto: proyectoDestino!.id,
        tipo_movimiento: 2,
        materiales: lineas.map((l) => ({
          inventario: l.item!.id,
          cantidad: Number(l.cantidad),
        })),
      };

      await crearOrdenMovimientoInventario(body);
      toast.success('Traslado registrado correctamente');
      setProyectoDestino(null);
      setFechaTraslado(new Date());
      setLineas([]); // limpia tabla
      router.push('/oficina/inventario');
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar traslado');
    } finally {
      setLoading(false);
    }
  }, [formValido, fechaTraslado, proyectoDestino, lineas, crearOrdenMovimientoInventario, router, setLineas]);

  return (
    <Box sx={{ p: 3 }}>
      {loading && <FullPageLoader />}
      <Card sx={{ p: 3 }}>
        <Typography variant="h5">Traslado de materiales a proyecto</Typography>
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Autocomplete
            options={proyectos}
            getOptionLabel={(option) => option.nombre}
            value={proyectoDestino}
            onChange={(_, newValue) => setProyectoDestino(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proyecto destino"
                fullWidth
              />
            )}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Fecha de traslado</Typography>
          <DateCalendar
            value={fechaTraslado}
            onChange={(d) => d && setFechaTraslado(d)}
          />
        </Box>

        <TablaLineasInventario
          lineas={lineas}
          onChange={setLineas}
          options={inventario}
          labels={{
            titulo: 'Materiales a trasladar',
            columnaCantidad: 'Cantidad a trasladar',
          }}
          excludeDuplicates
          allowZero={false}
          withToolbar
        />

        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ mt: 4 }}
        >
          <Tooltip
            title={formValido ? '' : 'Completa proyecto, fecha y al menos una línea válida'}
            arrow
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                disabled={!formValido}
                onClick={guardarTraslado}
              >
                Guardar traslado
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Card>
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
