import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  SvgIcon,
  Button,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { NextPage } from 'next';
import { ModalCrearUnidad } from './crear-unidad-modal';
import { ModalEditarUnidad } from './editar-unidad-modal';

interface Unidad {
  id: string;
  nombre: string;
}

const UNIDADES_MOCK: Unidad[] = [
  { id: 'uni-001', nombre: 'sacos' },
  { id: 'uni-002', nombre: 'barras' },
  { id: 'uni-003', nombre: 'm3' },
  { id: 'uni-004', nombre: 'litros' },
  { id: 'uni-005', nombre: 'toneladas' },
];

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<Unidad | null>(null);

  const abrirModalEditar = (unidad: Unidad) => {
    setUnidadSeleccionada(unidad);
    setModalEditarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Unidades</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalCrearOpen(true)}
          >
            Crear unidad
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={UNIDADES_MOCK.length}
          onFiltrar={() => {}}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = UNIDADES_MOCK.sort((a, b) =>
              orden === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
            ).slice((currentPage - 1) * 5, currentPage * 5);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((unidad) => (
                      <TableRow
                        key={unidad.id}
                        hover
                      >
                        <TableCell>{unidad.nombre}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(unidad)}>
                            <SvgIcon>
                              <EditIcon />
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

      <ModalCrearUnidad
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onConfirm={() => {}}
      />

      {unidadSeleccionada && (
        <ModalEditarUnidad
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={unidadSeleccionada}
          onConfirm={() => {}}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
