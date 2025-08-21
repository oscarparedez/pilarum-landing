import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Stack,
  OutlinedInput,
  InputAdornment,
  SvgIcon,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import debounce from 'lodash.debounce';
import { Rol, TipoIngreso } from 'src/api/types';
import CloseIcon from '@mui/icons-material/Close';

const labelTipoOrigen: Record<string, string> = {
  orden_compra: 'Orden de compra',
  proyecto: 'Proyecto',
  gasto_maquinaria: 'Gasto de Maquinaria',
  compra_maquinaria: 'Compra de Maquinaria',
};

interface Filtros {
  search: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  empresa?: string;
  rol?: string;
  tipoIngresoId?: number;
  tipoOrigen?: string;
}

interface TablaPaginadaConFiltrosProps {
  onFiltrar: (filtros: Filtros) => void;
  onPageChange?: (page: number) => void;
  totalItems: number;
  filtrosSearch?: boolean;
  filtrosFecha?: boolean;
  filtrosEstado?: boolean;
  filtrosRol?: boolean;
  filtrosEmpresa?: boolean;
  filtrosTipoIngreso?: boolean;
  empresas?: { id: number; nombre: string }[];
  roles?: Rol[];
  tiposIngreso?: TipoIngreso[];
  filtrosTipoOrigen?: boolean;
  opcionesTipoOrigen?: ['proyecto', 'orden_compra', 'gasto_maquinaria', 'compra_maquinaria'];
  children: (
    currentPage: number,
    estadoFiltro?: string,
    rolFiltro?: string,
    search?: string,
    empresa?: string
  ) => ReactNode;
}

export const TablaPaginadaConFiltros: FC<TablaPaginadaConFiltrosProps> = ({
  onFiltrar,
  onPageChange,
  totalItems,
  filtrosSearch = true,
  filtrosFecha = true,
  filtrosEstado = false,
  filtrosRol = false,
  filtrosEmpresa = false,
  filtrosTipoIngreso = false,
  empresas,
  roles,
  tiposIngreso,
  filtrosTipoOrigen = false,
  opcionesTipoOrigen = ['proyecto', 'orden_compra', 'gasto_maquinaria', 'compra_maquinaria'],
  children,
}) => {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [estado, setEstado] = useState('');
  const [rol, setRol] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [tipoIngresoId, setTipoIngresoId] = useState<number | undefined>(undefined);
  const [tipoOrigen, setTipoOrigen] = useState<string>('');

  const [page, setPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const debouncedFiltrar = useMemo(
    () =>
      debounce(
        (
          searchValue: string,
          inicio: Date | null,
          fin: Date | null,
          empresaValue: string,
          rolValue: string,
          tipoIdValue: number | undefined,
          tipoOrigenValue: string
        ) => {
          onFiltrar({
            search: searchValue ?? '',
            fechaInicio: inicio ?? null,
            fechaFin: fin ?? null,
            empresa: empresaValue || undefined,
            rol: rolValue || undefined, // <- importante
            tipoIngresoId: tipoIdValue ? Number(tipoIdValue) : undefined,
            tipoOrigen: tipoOrigenValue || undefined,
          });
        },
        200
      ),
    [onFiltrar]
  );

  useEffect(() => {
    debouncedFiltrar(search, fechaInicio, fechaFin, empresa, rol, tipoIngresoId, tipoOrigen);
    return () => debouncedFiltrar.cancel();
  }, [search, fechaInicio, fechaFin, empresa, rol, debouncedFiltrar, tipoIngresoId, tipoOrigen]);

  const renderedChildren = useMemo(() => {
    return children(
      page,
      filtrosEstado ? estado : undefined,
      filtrosRol ? rol : undefined,
      search,
      empresa || undefined
    );
  }, [page, filtrosEstado, estado, filtrosRol, rol, search, empresa, children]);

  const handleClearFilters = () => {
    setSearch('');
    setFechaInicio(null);
    setFechaFin(null);
    setEstado('');
    setRol('');
    setEmpresa('');
    setPage(1);
  };

  const hayFiltrosActivos = search || fechaInicio || fechaFin || estado || rol || empresa;

  return (
    <Box>
      <Box sx={{ px: 2, pt: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          flexWrap="wrap"
          alignItems="flex-start"
        >
          {filtrosSearch && (
            <OutlinedInput
              placeholder="Buscar"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon>
                    <SearchMdIcon />
                  </SvgIcon>
                </InputAdornment>
              }
              sx={{ width: { xs: '100%', sm: 300 } }}
            />
          )}

          {filtrosFecha && (
            <>
              <DatePicker
                label="Fecha inicio"
                value={fechaInicio}
                onChange={(date) => {
                  setPage(1);
                  setFechaInicio(date);
                }}
                slotProps={{ textField: { sx: { width: 180 } } }}
              />

              <DatePicker
                label="Fecha fin"
                value={fechaFin}
                onChange={(date) => {
                  setPage(1);
                  setFechaFin(date);
                }}
                slotProps={{ textField: { sx: { width: 180 } } }}
              />
            </>
          )}

          {filtrosEstado && (
            <FormControl
              sx={{ minWidth: 190 }}
              size="medium"
            >
              <InputLabel>Estado</InputLabel>
              <Select
                value={estado}
                label="Estado"
                onChange={(e) => {
                  setPage(1);
                  setEstado(e.target.value);
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          )}

          {roles && filtrosRol && (
            <FormControl
              sx={{ minWidth: 190 }}
              size="medium"
            >
              <InputLabel>Rol</InputLabel>
              <Select
                value={rol}
                label="rol"
                onChange={(e) => {
                  setPage(1);
                  setRol(e.target.value);
                }}
              >
                <MenuItem value="">Todas</MenuItem>
                {(roles ?? []).map((rol) => (
                  <MenuItem
                    key={rol.id}
                    value={rol.name}
                  >
                    {rol.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {empresas && filtrosEmpresa && (
            <FormControl
              sx={{ minWidth: 190 }}
              size="medium"
            >
              <InputLabel>Empresa</InputLabel>
              <Select
                value={empresa}
                label="Empresa"
                onChange={(e) => {
                  setPage(1);
                  setEmpresa(e.target.value);
                }}
              >
                <MenuItem value="">Todas</MenuItem>
                {(empresas ?? []).map((empresa) => (
                  <MenuItem
                    key={empresa.id}
                    value={empresa.nombre}
                  >
                    {empresa.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {tiposIngreso && filtrosTipoIngreso && (
            <FormControl
              sx={{ minWidth: 190 }}
              size="medium"
            >
              <InputLabel>Tipo de ingreso</InputLabel>
              <Select
                value={tipoIngresoId}
                label="Tipo de ingreso"
                onChange={(e) => {
                  setPage(1);
                  setTipoIngresoId(Number(e.target.value));
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {(tiposIngreso ?? []).map((t) => (
                  <MenuItem
                    key={t.id}
                    value={String(t.id)}
                  >
                    {t.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {filtrosTipoOrigen && (
            <FormControl
              sx={{ minWidth: 200 }}
              size="medium"
            >
              <InputLabel>Tipo de origen</InputLabel>
              <Select
                value={tipoOrigen}
                label="Tipo de origen"
                onChange={(e) => {
                  setPage(1);
                  setTipoOrigen(String(e.target.value));
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {opcionesTipoOrigen!.map((opt) => (
                  <MenuItem
                    key={opt}
                    value={opt}
                  >
                    {labelTipoOrigen[opt] ?? opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {hayFiltrosActivos && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CloseIcon />}
              onClick={handleClearFilters}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 500,
                px: 2.5,
                py: 0.8,
                alignSelf: { xs: 'flex-start', sm: 'center' },
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </Stack>
      </Box>

      <Box sx={{ px: 2, pt: 3 }}>{renderedChildren}</Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => {
            setPage(value);
            onPageChange?.(value);
          }}
          color="primary"
        />
      </Box>
    </Box>
  );
};
