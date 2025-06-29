import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  SvgIcon,
} from '@mui/material';
import { useRouter } from 'next/router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { paths } from 'src/paths';

const ORDENES_MOCK = [
  {
    id: '1',
    factura: 'FAC-00123',
    total: 1450,
    fecha: '2025-07-01',
    materiales: [],
  },
  {
    id: '2',
    factura: 'FAC-00124',
    total: 850,
    fecha: '2025-07-03',
    materiales: [],
  },
];

export const HistorialOrdenesDeCompra = () => {
  const router = useRouter();

  return (
    <Card>
      <Typography
        variant="h6"
        sx={{ px: 3, pt: 3 }}
      >
        Historial de órdenes de compra
      </Typography>

      <TablaPaginadaConFiltros
        totalItems={ORDENES_MOCK.length}
        onFiltrar={() => {}}
        filtrosFecha={false}
        filtrosEstado={false}
      >
        {(currentPage, orden) => {
          const items = ORDENES_MOCK.slice((currentPage - 1) * 5, currentPage * 5);

          return (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Número de factura</TableCell>
                    <TableCell>Total (Q)</TableCell>
                    <TableCell align="center">Ver detalles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell>{orden.fecha}</TableCell>
                      <TableCell>{orden.factura}</TableCell>
                      <TableCell>Q{orden.total.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() =>
                            router.push(`${paths.dashboard.oficina.orden_de_compra(orden.id)}`)
                          }
                        >
                          <SvgIcon>
                            <VisibilityIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }}
      </TablaPaginadaConFiltros>
    </Card>
  );
};
