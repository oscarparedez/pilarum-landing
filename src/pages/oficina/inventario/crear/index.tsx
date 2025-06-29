import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Tooltip,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { NextPage } from 'next';
import debounce from 'lodash.debounce';

interface Material {
  id: string;
  nombre: string;
  unidad: string;
}

const Page: NextPage = () => {
  const [factura, setFactura] = useState('');
  const [items, setItems] = useState<
    { material: Material | null; cantidad: string; costoUnitario: string }[]
  >([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [materialesFiltrados, setMaterialesFiltrados] = useState<Material[]>([]);

  const fetchMateriales = async (query: string) => {
    setLoading(true);
    try {
      const data = [
        { id: 'mat-001', nombre: 'Saco de cemento 20 kg', unidad: 'sacos' },
        { id: 'mat-002', nombre: 'Vigas de hierro 6 metros', unidad: 'barras' },
        { id: 'mat-003', nombre: 'Arena fina', unidad: 'm³' },
        { id: 'mat-004', nombre: 'Clavos 3"', unidad: 'libras' },
      ].filter((m) => m.nombre.toLowerCase().includes(query.toLowerCase()));

      setMaterialesFiltrados(data);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () => debounce((query: string) => fetchMateriales(query), 400),
    []
  );

  useEffect(() => {
    if (searchTerm.length > 1) {
      debouncedFetch(searchTerm);
    } else {
      setMaterialesFiltrados([]);
    }
  }, [searchTerm, debouncedFetch]);

  const ultimoItemIncompleto = () => {
    if (items.length === 0) return false;
    const ultimo = items[items.length - 1];
    return !ultimo.material || !ultimo.cantidad || !ultimo.costoUnitario;
  };

  const puedeAgregarMaterial = () => {
    return items.length === 0 || !ultimoItemIncompleto();
  };

  const agregarMaterial = () => {
    if (!puedeAgregarMaterial()) return;
    setItems((prev) => [...prev, { material: null, cantidad: '', costoUnitario: '' }]);
  };

  const eliminarItem = (index: number) => {
    const nuevos = [...items];
    nuevos.splice(index, 1);
    setItems(nuevos);
  };

  const actualizarItem = (index: number, campo: keyof (typeof items)[number], valor: any) => {
    const nuevos = [...items];
    nuevos[index][campo] = valor;
    setItems(nuevos);
  };

  const calcularTotal = () =>
    items.reduce((total, item) => total + (+item.cantidad * +item.costoUnitario || 0), 0);

  const formularioValido =
    factura.trim() &&
    items.length > 0 &&
    items.every((item) => item.material && item.cantidad && item.costoUnitario);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Nueva orden de compra</Typography>

          <Tooltip
            title={
              puedeAgregarMaterial()
                ? 'Agregar nuevo material'
                : 'Debes completar el último registro de la orden de compra'
            }
            arrow
          >
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={agregarMaterial}
                disabled={!puedeAgregarMaterial()}
              >
                Agregar material
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <TextField
          label="Número de factura"
          value={factura}
          onChange={(e) => setFactura(e.target.value)}
          placeholder="Ej. FAC-00123"
          fullWidth
          sx={{ mb: 4 }}
        />

        <TableContainer component={Paper}>
          <Table
            size="small"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '40%' }}>Material</TableCell>
                <TableCell sx={{ width: '10%' }}>Unidad</TableCell>
                <TableCell sx={{ width: '15%' }}>Cantidad</TableCell>
                <TableCell sx={{ width: '20%' }}>Costo Unitario (Q)</TableCell>
                <TableCell sx={{ width: '15%' }}>Subtotal</TableCell>
                <TableCell
                  align="center"
                  sx={{ width: '10%' }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => {
                const subtotal = +item.cantidad * +item.costoUnitario || 0;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        options={materialesFiltrados}
                        getOptionLabel={(option) => option.nombre}
                        value={item.material}
                        onInputChange={(_, value) => setSearchTerm(value)}
                        onChange={(_, newValue) => actualizarItem(index, 'material', newValue)}
                        loading={loading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Buscar material"
                            placeholder="Ej. cemento"
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loading ? <CircularProgress size={18} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography>{item.material?.unidad || '—'}</Typography>
                    </TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
                        inputProps={{ min: 0 }}
                        fullWidth
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        value={item.costoUnitario}
                        onChange={(e) => actualizarItem(index, 'costoUnitario', e.target.value)}
                        inputProps={{ min: 0 }}
                        fullWidth
                      />
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight="medium">Q{subtotal.toFixed(2)}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={() => eliminarItem(index)}
                        color="error"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 4 }}
        >
          <Typography variant="h6">Total: Q{calcularTotal().toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={!formularioValido}
          >
            Guardar orden de compra
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
