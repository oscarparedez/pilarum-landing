import { Box, Button, Card, Divider, Stack, TextField, Typography, Tooltip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { NextPage } from 'next';
import { useInventarioApi } from 'src/api/inventario/useInventarioApi';
import { useRebajasInventarioApi } from 'src/api/rebajas/useRebajasApi';
import type { Inventario, NuevaRebaja } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

import {
  TablaLineasInventario,
  useLineasInventario,
  LineaInventarioUI,
} from 'src/sections/oficina/inventario/components/tabla-lineas-inventario';

const Page: NextPage = () => {
  const router = useRouter();
  const { getInventario } = useInventarioApi();
  const { crearRebaja } = useRebajasInventarioApi();

  const [loading, setLoading] = useState(false);
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [fechaRebaja, setFechaRebaja] = useState<Date>(new Date());
  const [motivo, setMotivo] = useState('');

  const { lineas, setLineas } = useLineasInventario();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInventario();
      const { inventarios } = data
      setInventario(inventarios ?? []);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando inventario');
    } finally {
      setLoading(false);
    }
  }, [getInventario]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formValido = useMemo(() => {
    if (!motivo.trim() || !fechaRebaja || lineas.length === 0) return false;
    return lineas.every((l: LineaInventarioUI) => {
      const cant = Number(l.cantidad);
      const stock = l.item?.cantidad ?? 0;
      return l.item && Number.isFinite(cant) && cant > 0 && cant <= stock;
    });
  }, [motivo, fechaRebaja, lineas]);

  const guardarRebaja = useCallback(async () => {
    if (!formValido) return;
    setLoading(true);
    try {
      const payload: NuevaRebaja = {
        fecha_rebaja: fechaRebaja.toISOString().split('T')[0],
        motivo: motivo.trim(),
        materiales: lineas.map((l) => ({
          inventario: l.item!.id,
          cantidad: Number(l.cantidad),
        })),
      };

      await crearRebaja(payload);
      toast.success('Rebaja registrada correctamente');
      setMotivo('');
      setFechaRebaja(new Date());
      setLineas([]);
      router.push('/oficina/inventario');
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar rebaja');
    } finally {
      setLoading(false);
    }
  }, [formValido, fechaRebaja, motivo, lineas, crearRebaja, router, setLineas]);

  return (
    <Box sx={{ p: 3 }}>
      {loading && <FullPageLoader />}
      <Card sx={{ p: 3 }}>
        <Typography variant="h5">Rebaja de inventario</Typography>
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo de la rebaja"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Fecha de rebaja</Typography>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={es}
          >
            <DateCalendar
              value={fechaRebaja}
              onChange={(d) => d && setFechaRebaja(d)}
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
          options={inventario}
          labels={{
            titulo: 'Materiales a rebajar',
            columnaCantidad: 'Cantidad a rebajar',
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
            title={formValido ? '' : 'Completa motivo, fecha y al menos una línea válida'}
            arrow
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                disabled={!formValido}
                onClick={guardarRebaja}
              >
                Guardar rebaja
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
