import { Box, Button, Card, Divider, Stack, TextField, Typography, Tooltip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import { useInventarioApi } from 'src/api/inventario/useInventarioApi';
import { useMovimientosInventarioApi } from 'src/api/movimientos/useMovimientosInventarioApi';
import type { Inventario, NuevaOrdenMovimientoInventario } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';

import {
  TablaLineasInventario,
  useLineasInventario,
  LineaInventarioUI,
} from 'src/sections/oficina/inventario/components/tabla-lineas-inventario';

const Page: NextPage = () => {
  const router = useRouter();
  const proyectoIdParam = router.query.id;
  const proyectoId = typeof proyectoIdParam === 'string' ? Number(proyectoIdParam) : NaN;

  const { getInventarioPorProyecto } = useInventarioApi();
  const { crearOrdenMovimientoInventario } = useMovimientosInventarioApi();

  const [loading, setLoading] = useState(false);
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [fecha, setFecha] = useState<Date>(new Date());
  const { lineas, setLineas } = useLineasInventario();

  const inventarioConStock = useMemo(
    () => inventario.filter((inv) => (inv.cantidad ?? 0) > 0),
    [inventario]
  );

  const fetchData = useCallback(async () => {
    if (!Number.isFinite(proyectoId)) return;
    setLoading(true);
    try {
      const data = await getInventarioPorProyecto(proyectoId);
      const { inventarios } = data
      setInventario(inventarios ?? []);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando inventario del proyecto');
    } finally {
      setLoading(false);
    }
  }, [getInventarioPorProyecto, proyectoId]);

  useEffect(() => {
    if (!router.isReady) return;
    fetchData();
  }, [fetchData, router.isReady]);

  const formValido = useMemo(() => {
    if (!fecha || lineas.length === 0) return false;
    return lineas.every((l: LineaInventarioUI) => {
      const cant = Number(l.cantidad);
      const stock = l.item?.cantidad ?? 0;
      return l.item && Number.isFinite(cant) && cant > 0 && cant <= stock;
    });
  }, [fecha, lineas]);

  const onGuardar = useCallback(async () => {
    if (!formValido || !Number.isFinite(proyectoId)) return;
    setLoading(true);
    try {
      const body: NuevaOrdenMovimientoInventario = {
        fecha_movimiento: fecha.toISOString().split('T')[0],
        proyecto: proyectoId, // origen del movimiento (proyecto)
        tipo_movimiento: 1, // ENTRADA a bodega
        materiales: lineas.map((l) => ({
          inventario: l.item!.id,
          cantidad: Number(l.cantidad),
        })),
      };

      await crearOrdenMovimientoInventario(body);
      toast.success('Entrada registrada correctamente');
      setFecha(new Date());
      setLineas([]);
      router.push(`/proyectos/${proyectoId}`); // vuelve al detalle del proyecto
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar entrada');
    } finally {
      setLoading(false);
    }
  }, [formValido, proyectoId, fecha, lineas, crearOrdenMovimientoInventario, router, setLineas]);

  return (
    <Box sx={{ p: 3 }}>
      {loading && <FullPageLoader />}
      <Card sx={{ p: 3 }}>
        <Typography variant="h5">Devolver materiales a bodega</Typography>
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Fecha</Typography>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={es}
          >
            <DateCalendar
              value={fecha}
              onChange={(d) => d && setFecha(d)}
              sx={{
                width: '100%',
                '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': {
                  mx: 0,
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        <TablaLineasInventario
          lineas={lineas}
          onChange={setLineas}
          options={inventarioConStock}
          labels={{
            titulo: 'Materiales a devolver',
            columnaCantidad: 'Cantidad a devolver',
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
            title={formValido ? '' : 'Completa fecha y al menos una línea válida'}
            arrow
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                disabled={!formValido}
                onClick={onGuardar}
              >
                Guardar entrada
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
