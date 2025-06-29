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

const REBAJAS_MOCK = [
  {
    id: '1',
    motivo: 'Material dañado por lluvia',
    fecha: '2025-07-01',
  },
  {
    id: '2',
    motivo: 'Error de inventario detectado',
    fecha: '2025-07-03',
  },
];

export const HistorialRebajasInventario = () => {
  const router = useRouter();

  return (
    <Card sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ px: 3, pt: 3 }}
      >
        Historial de rebajas de inventario
      </Typography>

      <TablaPaginadaConFiltros
        totalItems={REBAJAS_MOCK.length}
        onFiltrar={() => {}}
        filtrosFecha={false}
        filtrosEstado={false}
      >
        {(currentPage, orden) => {
          const items = REBAJAS_MOCK.slice((currentPage - 1) * 5, currentPage * 5);

          return (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell align="center">Ver detalles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((rebaja) => (
                    <TableRow key={rebaja.id}>
                      <TableCell>{rebaja.fecha}</TableCell>
                      <TableCell>{rebaja.motivo}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() =>
                            router.push(`${paths.dashboard.oficina.rebaja(rebaja.id)}`)
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
