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
import { ModalCrearMarca } from './crear-marca-modal';
import { ModalEditarMarca } from './editar-marca-modal';

interface Marca {
  id: string;
  nombre: string;
}

const MARCAS_MOCK: Marca[] = [
  { id: 'mar-001', nombre: 'Cemex' },
  { id: 'mar-002', nombre: 'Holcim' },
  { id: 'mar-003', nombre: 'Argos' },
  { id: 'mar-004', nombre: 'Corona' },
  { id: 'mar-005', nombre: 'Forsa' },
];

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);

  const abrirModalEditar = (marca: Marca) => {
    setMarcaSeleccionada(marca);
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
          <Typography variant="h5">Marcas</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalCrearOpen(true)}
          >
            Crear marca
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={MARCAS_MOCK.length}
          onFiltrar={() => {}}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = MARCAS_MOCK.sort((a, b) =>
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
                    {items.map((marca) => (
                      <TableRow
                        key={marca.id}
                        hover
                      >
                        <TableCell>{marca.nombre}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(marca)}>
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

      <ModalCrearMarca
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onConfirm={() => {}}
      />

      {marcaSeleccionada && (
        <ModalEditarMarca
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={marcaSeleccionada}
          onConfirm={() => {}}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
