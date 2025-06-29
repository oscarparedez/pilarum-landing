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

import { ModalEditarMaterial } from './editar-material-modal';
import { ModalCrearMaterial } from './crear-material-modal';

interface Material {
  id: string;
  nombre: string;
  unidad: string;
  marca: string;
}

const MATERIALES_MOCK: Material[] = [
  { id: 'mat-001', nombre: 'Saco de cemento 20 kg', unidad: 'sacos', marca: 'Cemex' },
  { id: 'mat-002', nombre: 'Vigas de hierro 6 metros', unidad: 'barras', marca: 'Holcim' },
  { id: 'mat-003', nombre: 'Arena fina', unidad: 'm3', marca: 'Argos' },
  { id: 'mat-004', nombre: 'Piedrín', unidad: 'm3', marca: 'Corona' },
  { id: 'mat-005', nombre: 'Varilla #3', unidad: 'barras', marca: 'Forsa' },
];

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);

  const abrirModalEditar = (material: Material) => {
    setMaterialSeleccionado(material);
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
          <Typography variant="h5">Materiales</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalCrearOpen(true)}
          >
            Crear material
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={MATERIALES_MOCK.length}
          onFiltrar={() => {}}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = MATERIALES_MOCK.sort((a, b) =>
              orden === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
            ).slice((currentPage - 1) * 5, currentPage * 5);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((material) => (
                      <TableRow
                        key={material.id}
                        hover
                      >
                        <TableCell>{material.nombre}</TableCell>
                        <TableCell>{material.unidad}</TableCell>
                        <TableCell>{material.marca}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(material)}>
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

      <ModalCrearMaterial
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onConfirm={() => {}}
      />

      {materialSeleccionado && (
        <ModalEditarMaterial
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={materialSeleccionado}
          onConfirm={() => {}}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
