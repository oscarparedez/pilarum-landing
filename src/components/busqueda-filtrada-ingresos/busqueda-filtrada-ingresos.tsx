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

export type BaseFilters = {
  empresa?: number | '';
  proyecto?: number | '';
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  [key: string]: any; // extras dinámicos
};

export type ExtraFilterOption = {
  label: string;
  name: string;
  options: { id: number; nombre: string }[];
};

type Props<T> = {
  title: string;
  fetchData: (filters: any) => Promise<T[]>;
  socios: { id: number; nombre: string }[];
  getProyectos: (empresaId: number) => Promise<{ id: number; nombre: string }[]>;
  extraFilters?: ExtraFilterOption[];
  /** Debe devolver SOLO <Table> (sin Paper/TableContainer). */
  renderTable: (items: T[]) => React.ReactNode;
  /** Cómo obtener el monto de un registro para sumar el total. */
  getMonto?: (item: T) => number;
  /** Botones adicionales en la barra de resultados */
  extraButtons?: (
    items: T[],
    filters: BaseFilters,
    socios: { id: number; nombre: string }[],
    proyectos: { id: number; nombre: string }[]
  ) => React.ReactNode;
};

export function BusquedaFiltrada<T>({
  title,
  fetchData,
  socios,
  getProyectos,
  extraFilters = [],
  renderTable,
  getMonto,
  extraButtons,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [proyectos, setProyectos] = useState<{ id: number; nombre: string }[]>([]);

  const [draftFilters, setDraftFilters] = useState<BaseFilters>({
    empresa: '',
    proyecto: '',
    fechaInicio: null,
    fechaFin: null,
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
      if (draftFilters.empresa) {
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
  }, [draftFilters.empresa, getProyectos]);

  const handleBuscar = () => {
    const q: any = {
      empresa: draftFilters.empresa ? Number(draftFilters.empresa) : undefined,
      proyecto: draftFilters.proyecto ? Number(draftFilters.proyecto) : undefined,
      fecha_inicio: draftFilters.fechaInicio
        ? format(draftFilters.fechaInicio, 'dd-MM-yyyy')
        : undefined,
      fecha_fin: draftFilters.fechaFin ? format(draftFilters.fechaFin, 'dd-MM-yyyy') : undefined,
    };

    extraFilters.forEach((f) => {
      if (draftFilters[f.name]) q[f.name] = Number(draftFilters[f.name]);
    });

    loadData(q);
  };

  const handleLimpiar = () => {
    setDraftFilters({ empresa: '', proyecto: '', fechaInicio: null, fechaFin: null });
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
            {/* Socio */}
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

            {/* Proyecto */}
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
