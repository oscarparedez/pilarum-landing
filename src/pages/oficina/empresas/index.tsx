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

import { ModalCrearEmpresa } from './crear-empresa-modal';
import { ModalEditarEmpresa } from './editar-empresa-modal';

interface Empresa {
  id: string;
  nombre: string;
}

const EMPRESAS_MOCK: Empresa[] = [
  { id: 'emp-001', nombre: 'Empresa A' },
  { id: 'emp-002', nombre: 'Empresa B' },
  { id: 'emp-003', nombre: 'Empresa C' },
];

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);

  const abrirModalEditar = (empresa: Empresa) => {
    setEmpresaSeleccionada(empresa);
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
          <Typography variant="h5">Empresas</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalCrearOpen(true)}
          >
            Crear empresa
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={EMPRESAS_MOCK.length}
          onFiltrar={() => {}}
          filtrosFecha={false}
          filtrosEstado={false}
        >
          {(currentPage, orden) => {
            const items = EMPRESAS_MOCK.sort((a, b) =>
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
                    {items.map((empresa) => (
                      <TableRow key={empresa.id} hover>
                        <TableCell>{empresa.nombre}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(empresa)}>
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

      <ModalCrearEmpresa
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onConfirm={() => {}}
      />

      {empresaSeleccionada && (
        <ModalEditarEmpresa
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={empresaSeleccionada}
          onConfirm={() => {}}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
