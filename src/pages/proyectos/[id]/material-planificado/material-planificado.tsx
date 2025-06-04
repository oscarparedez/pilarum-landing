import { FC, useMemo, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Stack,
  TextField,
  OutlinedInput,
  InputAdornment,
  SvgIcon,
} from '@mui/material';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Scrollbar } from 'src/components/scrollbar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import { subDays } from 'date-fns';
import { ModalMovimientos } from './movimientos-material-planificado-modal';
import { ModalEnviarMaterial } from './enviar-material-modal';

interface MaterialItem {
  id: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  unidad: string;
}

const materialPlanificadoOriginal: MaterialItem[] = [
  { id: 'mat-001', nombre: 'Sacos de cemento 25kg', tipo: 'Consumible', cantidad: 48, unidad: 'sacos' },
  { id: 'mat-002', nombre: 'Vigas metálicas 4m', tipo: 'Estructura', cantidad: 12, unidad: 'unidades' },
  { id: 'mat-003', nombre: 'Cubetas de pintura blanca', tipo: 'Consumible', cantidad: 24, unidad: 'cubetas' },
  { id: 'mat-004', nombre: 'Taladro industrial Bosch', tipo: 'Herramienta', cantidad: 3, unidad: 'unidades' },
  { id: 'mat-005', nombre: 'Lámparas LED industriales', tipo: 'Eléctrico', cantidad: 2, unidad: 'piezas' },
];

export const MaterialPlanificado: FC = () => {
  const [search, setSearch] = useState('');
  const [orden, setOrden] = useState<'asc' | 'desc'>('asc');
  const [unidad, setUnidad] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');

  const [modalEnviarOpen, setModalEnviarOpen] = useState(false);
  const [productoEnviar, setProductoEnviar] = useState<MaterialItem | null>(null);

  const unidadesDisponibles = Array.from(new Set(materialPlanificadoOriginal.map((item) => item.unidad)));

  const materialFiltrado = useMemo(() => {
    let items = [...materialPlanificadoOriginal];

    if (search.trim()) {
      items = items.filter((item) => item.nombre.toLowerCase().includes(search.toLowerCase()));
    }

    if (unidad !== 'all') {
      items = items.filter((item) => item.unidad === unidad);
    }

    items.sort((a, b) =>
      orden === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    );

    return items;
  }, [search, unidad, orden]);

  const abrirModal = (producto: MaterialItem) => {
    const mockMovimientos = [
      {
        id: 'mov-001',
        cantidad: 20,
        unidad: producto.unidad,
        usuario: 'Carlos Méndez',
        fecha: new Date().getTime(),
        tipo: 'entrada',
      },
      {
        id: 'mov-002',
        cantidad: 10,
        unidad: producto.unidad,
        usuario: 'María López',
        fecha: subDays(new Date(), 1).getTime(),
        tipo: 'salida',
      },
    ];
    setProductoSeleccionado(producto.nombre);
    setMovimientos(mockMovimientos);
    setModalOpen(true);
  };

  const abrirModalEnviar = (producto: MaterialItem) => {
    setProductoEnviar(producto);
    setModalEnviarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 3 }}>
          <Typography variant="h5">Material planificado</Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ px: 2, pb: 3 }} flexWrap="wrap" alignItems="center">
          <OutlinedInput
            fullWidth
            placeholder="Buscar material"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon><SearchMdIcon /></SvgIcon>
              </InputAdornment>
            }
            sx={{ maxWidth: 400 }}
          />

          <TextField
            label="Orden"
            select
            SelectProps={{ native: true }}
            value={orden}
            onChange={(e) => setOrden(e.target.value as 'asc' | 'desc')}
            sx={{ width: 180 }}
          >
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </TextField>

          <TextField
            label="Unidad"
            select
            SelectProps={{ native: true }}
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            sx={{ width: 180 }}
          >
            <option value="all">Todas</option>
            {unidadesDisponibles.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </TextField>
        </Stack>

        <Scrollbar>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materialFiltrado
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow hover key={item.id}>
                    <TableCell><Typography variant="subtitle2">{item.nombre}</Typography></TableCell>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>{item.unidad}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => abrirModal(item)}>
                        <SvgIcon><VisibilityIcon /></SvgIcon>
                      </IconButton>
                      <IconButton onClick={() => abrirModalEnviar(item)}>
                        <SvgIcon><SendIcon /></SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePagination
          component="div"
          count={materialFiltrado.length}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      <ModalMovimientos
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        movimientos={movimientos}
        producto={productoSeleccionado}
      />

      {productoEnviar && (
        <ModalEnviarMaterial
          open={modalEnviarOpen}
          onClose={() => setModalEnviarOpen(false)}
          producto={productoEnviar.nombre}
          cantidadDisponible={productoEnviar.cantidad}
          unidad={productoEnviar.unidad}
        />
      )}
    </Box>
  );
};
