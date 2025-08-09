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
import { Usuario } from './index.d';
import { usePlanillaApi } from 'src/api/planilla/usePlanillaApi';
import toast from 'react-hot-toast';

const Page: NextPage = () => {
  const { getUsuarios } = usePlanillaApi();
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Usuario | null>(
    null
  );
  const [personal, setPersonal] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarios = await getUsuarios();
        const transformados = usuarios;
        setPersonal(transformados);
      } catch (error) {
        toast.error('Error al cargar usuarios');
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
            <Button
              variant="contained"
              onClick={() => setModalCrearOpen(true)}
            >
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
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 600 }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Teléfono</TableCell>
                      <TableCell>Rol</TableCell>
                      {/* <TableCell>Estado</TableCell> */}
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {personal
                      .filter(
                        (p) =>
                          (estadoFiltro ? p.estado === estadoFiltro : true) &&
                          (rolFiltro ? p.rol === rolFiltro : true) &&
                          (search
                            ? `${p.first_name} ${p.last_name}`
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            : true)
                      )
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((persona) => (
                        <TableRow
                          key={persona.username}
                          hover
                        >
                          <TableCell>{`${persona.first_name} ${persona.last_name}`}</TableCell>
                          <TableCell>{persona.username}</TableCell>
                          <TableCell>{persona.telefono}</TableCell>
                          <TableCell>{persona.rol}</TableCell>
                          {/* <TableCell>{persona.estado}</TableCell> */}
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
              onConfirm={(actualizada) => {
                setPersonal((prev) =>
                  prev.map((p) => (p.username === actualizada.username ? actualizada : p))
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
