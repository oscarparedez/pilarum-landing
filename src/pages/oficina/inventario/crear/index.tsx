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
  MenuItem,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { NextPage } from 'next';
import { useMaterialesApi } from 'src/api/materiales/useMaterialesApi';
import { Material, NuevaCompraMaterialForm, Proveedor, TipoDocumento } from 'src/api/types';
import { FullPageLoader } from 'src/components/loader/Loader';
import { useProveedoresApi } from 'src/api/proveedores/useProveedoresApi';
import { useOrdenesCompraApi } from 'src/api/ordenesCompra/useOrdenesCompraApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const Page: NextPage = () => {
  const router = useRouter();
  const { getMateriales } = useMaterialesApi();
  const { getProveedores } = useProveedoresApi();
  const { crearOrdenCompra } = useOrdenesCompraApi();

  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [fechaFactura, setFechaFactura] = useState<Date>(new Date());
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('cheque');
  const [anotaciones, setAnotaciones] = useState('');

  const [compras, setCompras] = useState<NuevaCompraMaterialForm[]>([]);

  // Fetch inicial
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prov, mats] = await Promise.all([getProveedores(), getMateriales()]);
      setProveedores(prov);
      setMateriales(mats);
    } catch (error) {
      console.error('Error cargando datos iniciales', error);
    } finally {
      setLoading(false);
    }
  }, [getProveedores, getMateriales]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ultimoItemIncompleto = useCallback(() => {
    if (compras.length === 0) return false;
    const ultimo = compras[compras.length - 1];
    return !ultimo.material || !ultimo.cantidad || !ultimo.precio_unitario;
  }, [compras]);

  const puedeAgregarCompra = useMemo(
    () => compras.length === 0 || !ultimoItemIncompleto(),
    [compras, ultimoItemIncompleto]
  );

  const agregarCompra = useCallback(() => {
    if (!puedeAgregarCompra) return;
    setCompras((prev) => [...prev, { material: null, cantidad: '', precio_unitario: '' }]);
  }, [puedeAgregarCompra]);

  const eliminarCompra = useCallback((index: number) => {
    setCompras((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const actualizarCompra = useCallback(
    (index: number, campo: keyof (typeof compras)[number], valor: any) => {
      setCompras((prev) => {
        const nuevos = [...prev];
        nuevos[index][campo] = valor;
        return nuevos;
      });
    },
    []
  );

  const calcularTotal = useMemo(
    () => compras.reduce((total, item) => total + (+item.cantidad * +item.precio_unitario || 0), 0),
    [compras]
  );

  const formularioValido = useMemo(
    () =>
      proveedor &&
      numeroFactura.trim() &&
      fechaFactura &&
      tipoDocumento &&
      compras.length > 0 &&
      compras.every((c) => c.material && c.cantidad && c.precio_unitario),
    [proveedor, numeroFactura, fechaFactura, compras, tipoDocumento]
  );

  const guardarOrdenCompra = useCallback(async () => {
    if (!formularioValido) return;
    setLoading(true);
    try {
      const body = {
        fecha_factura: fechaFactura?.toISOString(),
        proveedor: proveedor!.id,
        numero_factura: numeroFactura,
        tipo_documento: tipoDocumento,
        anotaciones,
        compras: compras.map((c) => ({
          material: c.material!.id,
          cantidad: c.cantidad,
          precio_unitario: c.precio_unitario,
        })),
      };

      await crearOrdenCompra(body);
      toast.success('Orden de compra creada correctamente');
      // Reset form
      setProveedor(null);
      setNumeroFactura('');
      setFechaFactura(new Date());
      setCompras([]);
      setTipoDocumento('cheque');
      setAnotaciones('');
      router.push('/oficina/inventario');
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la orden de compra');
    } finally {
      setLoading(false);
    }
  }, [
    formularioValido,
    fechaFactura,
    proveedor,
    numeroFactura,
    compras,
    router,
    anotaciones,
    tipoDocumento,
    crearOrdenCompra,
  ]);

  return (
    <Box sx={{ p: 3 }}>
      {loading && <FullPageLoader />}

      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Nueva orden de compra</Typography>
          <Tooltip
            title={
              puedeAgregarCompra ? 'Agregar nuevo material' : 'Debes completar el último registro'
            }
            arrow
          >
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={agregarCompra}
                disabled={!puedeAgregarCompra}
              >
                Agregar material
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Proveedor y Tipo de documento */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Autocomplete
            options={proveedores}
            getOptionLabel={(option) => option.nombre}
            value={proveedor}
            onChange={(_, newValue) => setProveedor(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proveedor"
                fullWidth
              />
            )}
            sx={{ flex: 1 }}
          />

          <TextField
            label="Tipo de documento"
            select
            fullWidth
            required
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
            sx={{ flex: 1 }}
          >
            <MenuItem value="cheque">Cheque</MenuItem>
            <MenuItem value="efectivo">Efectivo</MenuItem>
            <MenuItem value="transferencia">Transferencia</MenuItem>
          </TextField>
        </Stack>

        {/* Número de factura y Anotaciones */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            label="Número de factura"
            value={numeroFactura}
            onChange={(e) => setNumeroFactura(e.target.value)}
            fullWidth
            sx={{ flex: 1 }}
          />

          <TextField
            label="Anotaciones"
            value={anotaciones}
            onChange={(e) => setAnotaciones(e.target.value)}
            fullWidth
            sx={{ flex: 1 }}
            multiline
            minRows={1}
            maxRows={4}
          />
        </Stack>

        {/* Fecha factura */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Fecha de factura</Typography>
          <DateCalendar
            value={fechaFactura}
            onChange={(d) => setFechaFactura(d as Date)}
          />
        </Box>

        {/* Tabla de compras */}
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
                <TableCell sx={{ width: '20%' }}>Precio Unitario (Q)</TableCell>
                <TableCell sx={{ width: '15%' }}>Subtotal</TableCell>
                <TableCell
                  align="center"
                  sx={{ width: '10%' }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compras.map((item, index) => {
                const subtotal = +item.cantidad * +item.precio_unitario || 0;
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        options={materiales}
                        getOptionLabel={(option) => option.nombre}
                        value={item.material}
                        onChange={(_, newValue) => actualizarCompra(index, 'material', newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Material"
                            fullWidth
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography>{item.material?.unidad.nombre || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => actualizarCompra(index, 'cantidad', e.target.value)}
                        inputProps={{ min: 0 }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.precio_unitario}
                        onChange={(e) => actualizarCompra(index, 'precio_unitario', e.target.value)}
                        inputProps={{ min: 0 }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">Q{subtotal.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => eliminarCompra(index)}
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
          <Typography variant="h6">Total: Q{calcularTotal.toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={!formularioValido}
            onClick={guardarOrdenCompra}
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
