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

interface Filtros {
  search?: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

interface TablaPaginadaConFiltrosProps {
  onFiltrar: (filtros: Filtros) => void;
  totalItems: number;
  filtrosSearch?: boolean;
  filtrosFecha?: boolean;
  filtrosEstado?: boolean;
  children: (currentPage: number, estado?: string | undefined) => ReactNode;
}

export const TablaPaginadaConFiltros: FC<TablaPaginadaConFiltrosProps> = ({
  onFiltrar,
  totalItems,
  filtrosSearch = true,
  filtrosFecha = true,
  filtrosEstado = false,
  children,
}) => {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const debouncedFiltrar = useMemo(
    () =>
      debounce((searchValue: string, inicio: Date | null, fin: Date | null) => {
        onFiltrar({ search: searchValue, fechaInicio: inicio, fechaFin: fin });
      }, 500),
    [onFiltrar]
  );

  useEffect(() => {
    debouncedFiltrar(search, fechaInicio, fechaFin);
    return () => debouncedFiltrar.cancel();
  }, [search, fechaInicio, fechaFin]);

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
                sx={{
                  height: 54, // mismo alto que el OutlinedInput
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
      </Box>

      <Box sx={{ px: 2, pt: 3 }}>{children(page, filtrosEstado ? estado : undefined)}</Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};
