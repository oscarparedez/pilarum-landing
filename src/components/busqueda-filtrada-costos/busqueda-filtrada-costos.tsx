import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { CustomDatePicker } from 'src/components/custom-date-components';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { formatearQuetzales } from 'src/utils/format-currency';

import { Socio, Proyecto, Maquinaria, OrdenCompra } from 'src/api/types';

export type CostosBaseFilters = {
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  tipo_origen?: '' | 'proyecto' | 'gasto_maquinaria' | 'compra_maquinaria' | 'orden_compra';

  empresa?: number | '';
  proyectoId?: number | '';

  equipoId?: number | '';
  ordenCompraId?: string | '';
};

type Props<T> = {
  title: string;

  fetchData: (filters: any) => Promise<T[]>;

  socios: Socio[];
  getProyectosByEmpresa: (empresaId: number) => Promise<Proyecto[]>;
  getEquiposAll: () => Promise<Maquinaria[]>;
  getOrdenesCompraAll: () => Promise<OrdenCompra[]>;

  renderTable: (items: T[]) => React.ReactNode;
  getMonto?: (item: T) => number;
  extraButtons?: (items: T[], filters: CostosBaseFilters) => React.ReactNode;
};

export function BusquedaFiltradaCostos<T>({
  title,
  fetchData,
  socios,
  getProyectosByEmpresa,
  getEquiposAll,
  getOrdenesCompraAll,
  renderTable,
  getMonto,
  extraButtons,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [equipos, setEquipos] = useState<Maquinaria[]>([]);
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);

  const [loadedEquipos, setLoadedEquipos] = useState(false);
  const [loadedOrdenes, setLoadedOrdenes] = useState(false);

  const [filters, setFilters] = useState<CostosBaseFilters>({
    fechaInicio: null,
    fechaFin: null,
    tipo_origen: '',
    empresa: '',
    proyectoId: '',
    equipoId: '',
    ordenCompraId: '',
  });

  const loadData = useCallback(
    async (q?: any) => {
      setLoading(true);
      try {
        const data = await fetchData(q);
        setItems(data);
      } catch {
        toast.error(`Error cargando ${title.toLowerCase()}`);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, title]
  );

  // Reset dependientes al cambiar tipo_origen
  useEffect(() => {
    setFilters((s) => ({ ...s, empresa: '', proyectoId: '' }));

    setProyectos([]);

    if (filters.tipo_origen === 'gasto_maquinaria' || filters.tipo_origen === 'compra_maquinaria') {
      if (!loadedEquipos) {
        getEquiposAll()
          .then((res) => {
            setEquipos(res);
            setLoadedEquipos(true);
          })
          .catch(() => toast.error('Error cargando maquinarias'));
      }
    }

    if (filters.tipo_origen === 'orden_compra') {
      if (!loadedOrdenes) {
        getOrdenesCompraAll()
          .then((res) => {
            setOrdenes(res);
            setLoadedOrdenes(true);
          })
          .catch(() => toast.error('Error cargando órdenes de compra'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.tipo_origen]);

  // Cargar proyectos si empresa cambia
  useEffect(() => {
    if (filters.tipo_origen !== 'proyecto') return;

    const empresaId = Number(filters.empresa);
    if (!empresaId) {
      setProyectos([]);
      setFilters((s) => ({ ...s, proyectoId: '' }));
      return;
    }

    getProyectosByEmpresa(empresaId)
      .then(setProyectos)
      .catch(() => toast.error('Error cargando proyectos'));
  }, [filters.tipo_origen, filters.empresa, getProyectosByEmpresa]);

  // ...
  const handleBuscar = () => {
    const q: any = {
      tipo_origen: filters.tipo_origen || undefined,
      fecha_inicio: filters.fechaInicio ? format(filters.fechaInicio, 'dd-MM-yyyy') : undefined,
      fecha_fin: filters.fechaFin ? format(filters.fechaFin, 'dd-MM-yyyy') : undefined,
    };

    if (filters.tipo_origen === 'proyecto') {
      q.empresa = filters.empresa ? Number(filters.empresa) : undefined;
      q.proyecto = filters.proyectoId ? Number(filters.proyectoId) : undefined;
    }

    if (filters.tipo_origen === 'gasto_maquinaria' || filters.tipo_origen === 'compra_maquinaria') {
      q.equipo = filters.equipoId ? Number(filters.equipoId) : undefined;
    }

    if (filters.tipo_origen === 'orden_compra') {
      q.orden_compra = filters.ordenCompraId || undefined; // string o vacío
    }

    loadData(q);
  };

  const handleLimpiar = () => {
    setFilters({
      fechaInicio: null,
      fechaFin: null,
      tipo_origen: '',
      empresa: '',
      proyectoId: '',
      equipoId: '',
      ordenCompraId: '',
    });
    setItems([]);
    setProyectos([]);
  };

  const total =
    items.length > 0 && getMonto ? items.reduce((acc, it) => acc + (getMonto(it) || 0), 0) : 0;

  const showEmpresa = filters.tipo_origen === 'proyecto';
  const showProyecto = filters.tipo_origen === 'proyecto';
  const showEquipo =
    filters.tipo_origen === 'gasto_maquinaria' || filters.tipo_origen === 'compra_maquinaria';
  const showOrden = filters.tipo_origen === 'orden_compra';

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2 }}
      >
        {title}
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
          >
            {/* Tipo de origen */}
            <TextField
              select
              fullWidth
              label="Tipo de origen"
              value={filters.tipo_origen ?? ''}
              onChange={(e) => setFilters((s) => ({ ...s, tipo_origen: e.target.value as any }))}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="proyecto">Proyecto</MenuItem>
              <MenuItem value="gasto_maquinaria">Gasto de Maquinaria</MenuItem>
              <MenuItem value="compra_maquinaria">Compra de Maquinaria</MenuItem>
              <MenuItem value="orden_compra">Orden de compra</MenuItem>
            </TextField>

            {showEmpresa && (
              <TextField
                select
                fullWidth
                label="Socio"
                value={filters.empresa ?? ''}
                onChange={(e) =>
                  setFilters((s) => ({
                    ...s,
                    empresa: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
              >
                <MenuItem value="">Todas</MenuItem>
                {socios.map((s) => (
                  <MenuItem
                    key={s.id}
                    value={s.id}
                  >
                    {s.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {showProyecto && (
              <TextField
                select
                fullWidth
                label="Proyecto"
                value={filters.proyectoId ?? ''}
                onChange={(e) =>
                  setFilters((s) => ({
                    ...s,
                    proyectoId: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
                disabled={!filters.empresa}
              >
                <MenuItem value="">Todos</MenuItem>
                {proyectos.map((p) => (
                  <MenuItem
                    key={p.id}
                    value={p.id}
                  >
                    {p.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {showEquipo && (
              <TextField
                select
                fullWidth
                label="Maquinaria / Equipo"
                value={filters.equipoId ?? ''}
                onChange={(e) =>
                  setFilters((s) => ({
                    ...s,
                    equipoId: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
              >
                <MenuItem value="">Todos</MenuItem>
                {equipos.map((eq) => (
                  <MenuItem
                    key={eq.id}
                    value={eq.id}
                  >
                    {eq.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {showOrden && (
              <TextField
                fullWidth
                label="Número de factura"
                value={filters.ordenCompraId ?? ''}
                onChange={(e) =>
                  setFilters((s) => ({
                    ...s,
                    ordenCompraId: e.target.value,
                  }))
                }
                placeholder="Ej: 12345"
                autoComplete="off"
              />
            )}

            <>
              <CustomDatePicker
                label="Fecha inicio"
                value={filters.fechaInicio}
                onChange={(v) => setFilters((s) => ({ ...s, fechaInicio: v }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <CustomDatePicker
                label="Fecha fin"
                value={filters.fechaFin}
                onChange={(v) => setFilters((s) => ({ ...s, fechaFin: v }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              onClick={handleLimpiar}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              onClick={handleBuscar}
            >
              Buscar
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Paper variant="outlined">
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'background.default',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={`${items.length} resultados`} />
            {extraButtons && items.length > 0 && extraButtons(items, filters)}
          </Stack>
          <Stack
            spacing={0}
            alignItems="flex-end"
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Total
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
            >
              {formatearQuetzales(total)}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Typography>Cargando…</Typography>
            </Box>
          ) : items.length === 0 ? (
            <Box
              sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography>Sin resultados</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total: <b>{formatearQuetzales(0)}</b>
              </Typography>
            </Box>
          ) : (
            renderTable(items)
          )}
        </Box>
      </Paper>
    </Box>
  );
}
