import React, { FC, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Typography,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import type { Inventario } from 'src/api/types';
import { AutocompleteMaterial } from './autocomplete-material';

/**
 * UI line shape unificada (para Rebaja y Traslado)
 */
export interface LineaInventarioUI {
  item: Inventario | null; // inventario seleccionado
  cantidad: string;        // string para TextField numérico
}

type Labels = {
  titulo?: string;
  columnaMaterial?: string;
  columnaUnidad?: string;
  columnaStock?: string;
  columnaCantidad?: string;
  botonAgregar?: string;
  tooltipAgregar?: string;
  tooltipCompletar?: string;
};

export type TablaLineasInventarioProps = {
  lineas: LineaInventarioUI[];
  onChange: (nuevas: LineaInventarioUI[]) => void;
  options: Inventario[]; // inventario disponible
  /**
   * Evitar seleccionar el mismo inventario en múltiples filas (default: true)
   */
  excludeDuplicates?: boolean;
  /**
   * Permitir 0 como cantidad (default: false)
   */
  allowZero?: boolean;
  /**
   * Mostrar/ajustar etiquetas
   */
  labels?: Labels;
  /**
   * Renderiza toolbar con botón "+ Agregar material" (default: true)
   */
  withToolbar?: boolean;
};

/**
 * Componente de tabla reutilizable para seleccionar materiales del inventario y definir cantidades.
 * - Valida que cantidad <= stock disponible
 * - Evita duplicados (configurable)
 * - Expone la lista controlada via `lineas` + `onChange`
 */
export const TablaLineasInventario: FC<TablaLineasInventarioProps> = ({
  lineas,
  onChange,
  options,
  excludeDuplicates = true,
  allowZero = false,
  labels,
  withToolbar = true,
}) => {
  const idsSeleccionados = useMemo(() =>
    lineas.map((l) => l.item?.id).filter((id): id is number => id !== undefined),
  [lineas]);

  const ultimoIncompleto = useMemo(() => {
    if (lineas.length === 0) return false;
    const last = lineas[lineas.length - 1];
    const cant = Number(last.cantidad);
    const hasCantidad = allowZero ? last.cantidad !== '' : cant > 0;
    return !last.item || !hasCantidad;
  }, [lineas, allowZero]);

  const puedeAgregar = useMemo(() => lineas.length === 0 || !ultimoIncompleto, [lineas, ultimoIncompleto]);

  const setLinea = useCallback((idx: number, patch: Partial<LineaInventarioUI>) => {
    const n = [...lineas];
    n[idx] = { ...n[idx], ...patch };
    onChange(n);
  }, [lineas, onChange]);

  const agregar = useCallback(() => {
    if (!puedeAgregar) return;
    onChange([...lineas, { item: null, cantidad: '' }]);
  }, [lineas, onChange, puedeAgregar]);

  const eliminar = useCallback((idx: number) => {
    const n = lineas.filter((_, i) => i !== idx);
    onChange(n);
  }, [lineas, onChange]);

  const getOptionsForRow = useCallback((rowIndex: number) => {
    if (!excludeDuplicates) return options;
    const idsUsados = new Set(idsSeleccionados.filter((_, i) => i !== rowIndex));
    return options.filter((opt) => !idsUsados.has(opt.id));
  }, [options, idsSeleccionados, excludeDuplicates]);

  const t = {
    titulo: labels?.titulo ?? 'Materiales',
    columnaMaterial: labels?.columnaMaterial ?? 'Material',
    columnaUnidad: labels?.columnaUnidad ?? 'Unidad',
    columnaStock: labels?.columnaStock ?? 'Stock disponible',
    columnaCantidad: labels?.columnaCantidad ?? 'Cantidad',
    botonAgregar: labels?.botonAgregar ?? 'Agregar material',
    tooltipAgregar: labels?.tooltipAgregar ?? 'Agregar nuevo material',
    tooltipCompletar: labels?.tooltipCompletar ?? 'Debes completar el último registro',
  };

  return (
    <TableContainer component={Paper}>
      {withToolbar && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
          <Typography variant="h6">{t.titulo}</Typography>
          <Tooltip title={puedeAgregar ? t.tooltipAgregar : t.tooltipCompletar} arrow>
            <span>
              <Button variant="contained" startIcon={<AddIcon />} onClick={agregar} disabled={!puedeAgregar}>
                {t.botonAgregar}
              </Button>
            </span>
          </Tooltip>
        </div>
      )}

      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '45%' }}>{t.columnaMaterial}</TableCell>
            <TableCell style={{ width: 120 }}>{t.columnaUnidad}</TableCell>
            <TableCell style={{ width: 140 }}>{t.columnaStock}</TableCell>
            <TableCell style={{ width: 160 }}>{t.columnaCantidad}</TableCell>
            <TableCell align="center" style={{ width: 64 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {lineas.map((row, idx) => {
            const stock = row.item?.cantidad ?? 0;
            const unidad = row.item?.material.unidad.nombre ?? '—';
            const optionsForRow = getOptionsForRow(idx);

            return (
              <TableRow key={idx}>
                <TableCell>
                  <AutocompleteMaterial
                    value={row.item}
                    onChange={(val) => setLinea(idx, { item: val })}
                    options={optionsForRow}
                    excluirIds={excludeDuplicates ? idsSeleccionados.filter((id) => id !== row.item?.id) : []}
                  />
                </TableCell>
                <TableCell>
                  <Typography>{unidad}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{stock}</Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.cantidad}
                    onChange={(e) => {
                      let v = e.target.value;
                      // Normaliza valores negativos
                      if (v === '-') v = '';
                      if (v.startsWith('0') && v !== '0' && !v.startsWith('0.')) {
                        v = String(Number(v));
                      }
                      // No permitir sobrepasar stock
                      const asNum = Number(v);
                      if (!Number.isNaN(asNum) && asNum > stock) {
                        v = String(stock);
                      }
                      // No permitir 0 si allowZero = false
                      if (!allowZero && asNum === 0) {
                        v = '';
                      }
                      setLinea(idx, { cantidad: v });
                    }}
                    inputProps={{ min: allowZero ? 0 : 1, step: 'any', max: stock }}
                    placeholder={allowZero ? '0' : '1'}
                    fullWidth
                    helperText={`máx. ${stock}`}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => eliminar(idx)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/**
 * Hook pequeño para reutilizar la lógica en las páginas (opcional)
 */
export const useLineasInventario = (initial: LineaInventarioUI[] = []) => {
  const [lineas, setLineas] = React.useState<LineaInventarioUI[]>(initial);

  const ultimoIncompleto = React.useMemo(() => {
    if (lineas.length === 0) return false;
    const last = lineas[lineas.length - 1];
    const cant = Number(last.cantidad);
    return !last.item || !(cant > 0);
  }, [lineas]);

  const puedeAgregar = React.useMemo(() => lineas.length === 0 || !ultimoIncompleto, [lineas, ultimoIncompleto]);

  const agregarLinea = React.useCallback(() => {
    if (!puedeAgregar) return;
    setLineas((p) => [...p, { item: null, cantidad: '' }]);
  }, [puedeAgregar]);

  const eliminarLinea = React.useCallback((idx: number) => {
    setLineas((p) => p.filter((_, i) => i !== idx));
  }, []);

  const actualizarLinea = React.useCallback((idx: number, patch: Partial<LineaInventarioUI>) => {
    setLineas((prev) => {
      const n = [...prev];
      n[idx] = { ...n[idx], ...patch };
      return n;
    });
  }, []);

  return { lineas, setLineas, puedeAgregar, agregarLinea, eliminarLinea, actualizarLinea };
};