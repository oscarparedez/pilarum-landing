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
  CircularProgress,
} from '@mui/material';
import { CustomDatePicker } from 'src/components/custom-date-components';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { formatearQuetzales } from 'src/utils/format-currency';
import { FullPageLoader } from '../loader/Loader';
import { Socio, Proyecto, Maquinaria } from 'src/api/types';

export type CostosBaseFilters = {
  empresa?: number | '';
  proyecto?: number | '';
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  tipo_origen?: string | '';
  equipoId?: number | '';
  ordenCompraId?: string | '';
  [key: string]: any; // extras dinámicos
};

export type ExtraFilterOptionCostos = {
  label: string;
  name: string;
  options: { id: number; nombre: string }[];
};

type Props<T> = {
  title: string;
  fetchData: (filters: any) => Promise<T[]>;
  socios: { id: number; nombre: string }[];
  getProyectos: (empresaId: number) => Promise<{ id: number; nombre: string }[]>;
  getEquiposAll?: () => Promise<Maquinaria[]>;
  extraFilters?: ExtraFilterOptionCostos[];
  /** Debe devolver SOLO <Table> (sin Paper/TableContainer). */
  renderTable: (items: T[]) => React.ReactNode;
  /** Cómo obtener el monto de un registro para sumar el total. */
  getMonto?: (item: T) => number;
  /** Botones adicionales en la barra de resultados */
  extraButtons?: (
    items: T[],
    filters: CostosBaseFilters,
    socios: { id: number; nombre: string }[],
    proyectos: { id: number; nombre: string }[]
  ) => React.ReactNode;
};

export function BusquedaFiltradaCostos<T>({
  title,
  fetchData,
  socios,
  getProyectos,
  getEquiposAll,
  extraFilters = [],
  renderTable,
  getMonto,
  extraButtons,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [proyectos, setProyectos] = useState<{ id: number; nombre: string }[]>([]);
  const [equipos, setEquipos] = useState<Maquinaria[]>([]);
  const [loadedEquipos, setLoadedEquipos] = useState(false);

  const [draftFilters, setDraftFilters] = useState<CostosBaseFilters>({
    empresa: '',
    proyecto: '',
    fechaInicio: null,
    fechaFin: null,
    tipo_origen: '',
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

  // Cargar proyectos al cambiar empresa
  useEffect(() => {
    const fetchProyectos = async () => {
      if (draftFilters.empresa && draftFilters.tipo_origen === 'proyecto') {
        try {
          const data = await getProyectos(Number(draftFilters.empresa));
          setProyectos(data);
        } catch {
          toast.error('Error cargando proyectos');
        }
      } else {
        setProyectos([]);
        setDraftFilters((s) => ({ ...s, proyecto: '' }));
      }
    };
    fetchProyectos();
  }, [draftFilters.empresa, draftFilters.tipo_origen, getProyectos]);

  // Reset dependientes y cargar datos específicos al cambiar tipo_origen
  useEffect(() => {
    // Reset campos dependientes
    setDraftFilters((s) => ({ ...s, empresa: '', proyecto: '', equipoId: '', ordenCompraId: '' }));
    setProyectos([]);

    // Cargar equipos si es necesario
    if (
      draftFilters.tipo_origen === 'gasto_maquinaria' ||
      draftFilters.tipo_origen === 'compra_maquinaria'
    ) {
      if (!loadedEquipos && getEquiposAll) {
        getEquiposAll()
          .then((res) => {
            setEquipos(res);
            setLoadedEquipos(true);
          })
          .catch(() => toast.error('Error cargando maquinarias'));
      }
    }
  }, [draftFilters.tipo_origen, loadedEquipos, getEquiposAll]);

  const handleBuscar = () => {
    const q: any = {
      empresa: draftFilters.empresa ? Number(draftFilters.empresa) : undefined,
      proyecto: draftFilters.proyecto ? Number(draftFilters.proyecto) : undefined,
      tipo_origen: draftFilters.tipo_origen || undefined,
      fecha_inicio: draftFilters.fechaInicio
        ? format(draftFilters.fechaInicio, 'dd-MM-yyyy')
        : undefined,
      fecha_fin: draftFilters.fechaFin ? format(draftFilters.fechaFin, 'dd-MM-yyyy') : undefined,
    };

    // Parámetros específicos por tipo de origen
    if (
      draftFilters.tipo_origen === 'gasto_maquinaria' ||
      draftFilters.tipo_origen === 'compra_maquinaria'
    ) {
      q.equipo = draftFilters.equipoId ? Number(draftFilters.equipoId) : undefined;
    }

    if (draftFilters.tipo_origen === 'orden_compra') {
      q.orden_compra = draftFilters.ordenCompraId || undefined;
    }

    extraFilters.forEach((f) => {
      if (draftFilters[f.name]) q[f.name] = Number(draftFilters[f.name]);
    });

    loadData(q);
  };

  const handleLimpiar = () => {
    setDraftFilters({
      empresa: '',
      proyecto: '',
      fechaInicio: null,
      fechaFin: null,
      tipo_origen: '',
      equipoId: '',
      ordenCompraId: '',
    });
    setItems([]); // no fetch; limpia resultados visibles
  };

  const total =
    items.length > 0 && getMonto ? items.reduce((acc, it) => acc + (getMonto(it) || 0), 0) : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header superior simple */}
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
              value={draftFilters.tipo_origen ?? ''}
              onChange={(e) =>
                setDraftFilters((s) => ({
                  ...s,
                  tipo_origen: e.target.value,
                  // Reset dependientes cuando cambia tipo de origen
                  empresa: e.target.value !== 'proyecto' ? '' : s.empresa,
                  proyecto: e.target.value !== 'proyecto' ? '' : s.proyecto,
                }))
              }
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="proyecto">Proyecto</MenuItem>
              <MenuItem value="orden_compra">Orden de compra</MenuItem>
              <MenuItem value="gasto_maquinaria">Gasto de Maquinaria</MenuItem>
              <MenuItem value="compra_maquinaria">Compra de Maquinaria</MenuItem>
            </TextField>

            {/* Socio - solo mostrar si tipo_origen es específicamente "proyecto" */}
            {draftFilters.tipo_origen === 'proyecto' && (
              <TextField
                select
                fullWidth
                label="Socio"
                value={draftFilters.empresa ?? ''}
                onChange={(e) =>
                  setDraftFilters((s) => ({
                    ...s,
                    empresa: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
              >
                <MenuItem value="">Todos</MenuItem>
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

            {/* Proyecto - solo mostrar si tipo_origen es específicamente "proyecto" y hay empresa seleccionada */}
            {draftFilters.tipo_origen === 'proyecto' && (
              <TextField
                select
                fullWidth
                label="Proyecto"
                value={draftFilters.proyecto ?? ''}
                onChange={(e) =>
                  setDraftFilters((s) => ({
                    ...s,
                    proyecto: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
                disabled={!draftFilters.empresa}
              >
                <MenuItem value="">Seleccione proyecto</MenuItem>
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

            {/* Campo específico para Maquinaria/Equipo */}
            {(draftFilters.tipo_origen === 'gasto_maquinaria' ||
              draftFilters.tipo_origen === 'compra_maquinaria') && (
              <TextField
                select
                fullWidth
                label={draftFilters.tipo_origen === 'gasto_maquinaria' ? 'Maquinaria' : 'Equipo'}
                value={draftFilters.equipoId ?? ''}
                onChange={(e) =>
                  setDraftFilters((s) => ({
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

            {/* Campo específico para Orden de Compra */}
            {draftFilters.tipo_origen === 'orden_compra' && (
              <TextField
                fullWidth
                label="Número de factura"
                value={draftFilters.ordenCompraId ?? ''}
                onChange={(e) =>
                  setDraftFilters((s) => ({
                    ...s,
                    ordenCompraId: e.target.value,
                  }))
                }
                placeholder="Ej: 12345"
                autoComplete="off"
              />
            )}

            {/* Fechas */}
            <>
              <CustomDatePicker
                label="Fecha inicio"
                value={draftFilters.fechaInicio}
                onChange={(v) => setDraftFilters((s) => ({ ...s, fechaInicio: v }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <CustomDatePicker
                label="Fecha fin"
                value={draftFilters.fechaFin}
                onChange={(v) => setDraftFilters((s) => ({ ...s, fechaFin: v }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </>

            {/* Extra filters dinámicos */}
            {extraFilters.map((f) => (
              <TextField
                key={f.name}
                select
                fullWidth
                label={f.label}
                value={draftFilters[f.name] ?? ''}
                onChange={(e) =>
                  setDraftFilters((s) => ({
                    ...s,
                    [f.name]: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
              >
                <MenuItem value="">Todos</MenuItem>
                {f.options.map((opt) => (
                  <MenuItem
                    key={opt.id}
                    value={opt.id}
                  >
                    {opt.nombre}
                  </MenuItem>
                ))}
              </TextField>
            ))}
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

      {/* BLOQUE DE RESULTADOS */}
      <Paper variant="outlined">
        {/* ResultsBar pegada a la tabla */}
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
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Chip label={`${items.length} resultados`} />
            {extraButtons &&
              items.length > 0 &&
              extraButtons(items, draftFilters, socios, proyectos)}
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

        {/* Tabla (tú la renderizas) */}
        <Box sx={{ overflowX: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <FullPageLoader />
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
            renderTable(items) // <Table> … </Table>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
