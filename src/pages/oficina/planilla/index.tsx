import { FC, useEffect, useState } from 'react';
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
import { usePlanillaApi } from 'src/api/planilla/usePlanillaApi';

const Page: NextPage = () => {
  const { getUsuarios } = usePlanillaApi();
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Personal | null>(null);
  const [personal, setPersonal] = useState<Personal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarios = await getUsuarios();
        const transformados: Personal[] = usuarios.map((u) => ({
          id_usuario: String(u.id ?? 'FALTANTE'),
          nombre: u.name ?? 'FALTANTE',
          usuario: u.username ?? 'FALTANTE',
          telefono: u.telefono ?? 'FALTANTE',
          rol: u.rol ?? 'FALTANTE',
          estado: u.is_active === false ? 'Inactivo' : u.is_active === true ? 'Activo' : 'FALTANTE',
          fecha_creacion: u.fecha_creacion ?? 'FALTANTE',
          usuario_registro: u.usuario_registro ?? 'FALTANTE',
        }));
        setPersonal(transformados);
      } catch (error) {
        console.error('Error al cargar usuarios', error);
      }
    };

    fetchData();
  }, [getUsuarios]);

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
                      <TableCell>Usuario</TableCell>
                      <TableCell>Teléfono</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha de creación</TableCell>
                      <TableCell>Creado por</TableCell>
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
                          <TableCell>{persona.usuario}</TableCell>
                          <TableCell>{persona.telefono}</TableCell>
                          <TableCell>{persona.rol}</TableCell>
                          <TableCell>{persona.estado}</TableCell>
                          <TableCell>{persona.fecha_creacion}</TableCell>
                          <TableCell>{persona.usuario_registro}</TableCell>
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

          <ModalRegistrarPersona
            open={modalCrearOpen}
            onClose={() => setModalCrearOpen(false)}
            onConfirm={(nueva) => {
              setPersonal((prev) => [...prev, nueva]);
              setModalCrearOpen(false);
            }}
          />

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
