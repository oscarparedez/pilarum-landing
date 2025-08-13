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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import debounce from 'lodash.debounce';
import { Rol } from 'src/api/types';

interface Filtros {
  search: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  empresa?: string;
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
  empresas?: { id: number; nombre: string }[];
  roles?: Rol[]
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
  empresas,
  roles,
  children,
}) => {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [estado, setEstado] = useState('');
  const [rol, setRol] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [page, setPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const debouncedFiltrar = useMemo(
    () =>
      debounce(
        (searchValue: string, inicio: Date | null, fin: Date | null, empresaValue: string) => {
          onFiltrar({
            search: searchValue ?? '',
            fechaInicio: inicio ?? null,
            fechaFin: fin ?? null,
            empresa: empresaValue || undefined,
          });
        },
        200
      ),
    [onFiltrar]
  );

  useEffect(() => {
    debouncedFiltrar(search, fechaInicio, fechaFin, empresa);
    return () => debouncedFiltrar.cancel();
  }, [search, fechaInicio, fechaFin, empresa, debouncedFiltrar]);

  const renderedChildren = useMemo(() => {
    return children(
      page,
      filtrosEstado ? estado : undefined,
      filtrosRol ? rol : undefined,
      search,
      empresa || undefined
    );
  }, [page, filtrosEstado, estado, filtrosRol, rol, search, empresa, children]);

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
              <InputLabel>Empresa</InputLabel>
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
