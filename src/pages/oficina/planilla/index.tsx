import { FC, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { ModalRegistrarPersona } from './crear-personal-modal';
import { ModalEditarPersona } from './editar-personal-modal';
import { NextPage } from 'next';
import { Personal } from './index.d';

const mockPersonas: Personal[] = [
  {
    id_usuario: 'u001',
    nombre: 'Carlos Morales',
    telefono: '5555-1234',
    rol: 'Ingeniero',
    estado: 'Activo',
    fecha_creacion: '2025-06-01',
  },
  {
    id_usuario: 'u002',
    nombre: 'María López',
    telefono: '5555-5678',
    rol: 'Arquitecto',
    estado: 'Activo',
    fecha_creacion: '2025-06-03',
  },
  {
    id_usuario: 'u003',
    nombre: 'Pedro Rodríguez',
    telefono: '5555-8765',
    rol: 'Supervisor',
    estado: 'Inactivo',
    fecha_creacion: '2025-05-28',
  },
  {
    id_usuario: 'u004',
    nombre: 'Ana Gómez',
    telefono: '5555-1122',
    rol: 'Ingeniero',
    estado: 'Activo',
    fecha_creacion: '2025-06-02',
  },
];

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Personal | null>(null);
  const [personal, setPersonal] = useState<Personal[]>(mockPersonas);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 3, py: 3 }}
          >
            <Typography variant="h5">Planilla de personal</Typography>
            <Button variant="contained" onClick={() => setModalCrearOpen(true)}>
              Agregar persona
            </Button>
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={personal.length}
            onFiltrar={() => {}}
            filtrosFecha={false}
            filtrosEstado
            filtrosRol
          >
            {(currentPage, estadoFiltro, rolFiltro, search) => (
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Teléfono</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha de creación</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {personal
                      .filter(
                        (p) =>
                          (estadoFiltro ? p.estado === estadoFiltro : true) &&
                          (rolFiltro ? p.rol === rolFiltro : true) &&
                          (search ? p.nombre.toLowerCase().includes(search.toLowerCase()) : true)
                      )
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((persona) => (
                        <TableRow key={persona.id_usuario} hover>
                          <TableCell>{persona.nombre}</TableCell>
                          <TableCell>{persona.telefono}</TableCell>
                          <TableCell>{persona.rol}</TableCell>
                          <TableCell>{persona.estado}</TableCell>
                          <TableCell>{persona.fecha_creacion}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setPersonaSeleccionada(persona);
                                setModalEditarOpen(true);
                              }}
                            >
                              Ver detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TablaPaginadaConFiltros>

          {/* Modal para crear nueva persona */}
          <ModalRegistrarPersona
            open={modalCrearOpen}
            onClose={() => setModalCrearOpen(false)}
            onConfirm={(nueva) => {
              setPersonal((prev) => [...prev, nueva]);
              setModalCrearOpen(false);
            }}
          />

          {/* Modal para editar persona */}
          {personaSeleccionada && (
            <ModalEditarPersona
              open={modalEditarOpen}
              onClose={() => setModalEditarOpen(false)}
              initialData={personaSeleccionada}
              onConfirm={(actualizada: Personal) => {
                setPersonal((prev) =>
                  prev.map((p) => (p.id_usuario === actualizada.id_usuario ? actualizada : p))
                );
                setModalEditarOpen(false);
              }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
