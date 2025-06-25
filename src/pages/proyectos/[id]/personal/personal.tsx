import { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import { diasBinarioToTexto, diasToBinario } from '../maquinaria/utils';
import { ModalAgregarPersonal } from './agregar-personal-modal';
import { ModalEditarPersonal } from './editar-personal-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Personal } from '../index.d';

export const PersonalAsignado: FC<{ personal: Personal[] }> = ({ personal }) => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editando, setEditando] = useState<Personal | null>(null);

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
            <Typography variant="h5">Ingenieros y arquitectos asignados</Typography>
            <Button
              variant="contained"
              onClick={() => setAgregarModalOpen(true)}
            >
              Asignar recurso
            </Button>
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={personal.length}
            onFiltrar={() => {}}
            filtrosFecha={false}
            filtrosEstado={true}
          >
            {(currentPage, estadoFiltro) => (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Inicio</TableCell>
                      <TableCell>Fin</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Días</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {personal
                      .filter((r) => (estadoFiltro ? r.estado === estadoFiltro : true))
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, i) => (
                        <TableRow
                          key={i}
                          hover
                        >
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell>{item.tipo}</TableCell>
                          <TableCell>{item.fechaInicio}</TableCell>
                          <TableCell>{item.fechaFin}</TableCell>
                          <TableCell>{item.estado}</TableCell>
                          <TableCell>{diasBinarioToTexto(item.diasAsignados)}</TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                            >
                              <Button
                                size="small"
                                onClick={() => {
                                  setEditando(item);
                                  setEditarModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                              >
                                Liberar
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TablaPaginadaConFiltros>

          <ModalAgregarPersonal
            open={agregarModalOpen}
            onClose={() => setAgregarModalOpen(false)}
            personalDisponible={[
              { nombre: 'Carlos Gómez', tipo: 'Ingeniero' },
              { nombre: 'Sandra Herrera', tipo: 'Arquitecto' },
              { nombre: 'Luis Méndez', tipo: 'Ingeniero' },
            ]}
            onConfirm={(data) => {
              // logica para agregar personal
            }}
          />

          {editando && (
            <ModalEditarPersonal
              open={editarModalOpen}
              onClose={() => {
                setEditarModalOpen(false);
                setEditando(null);
              }}
              personalDisponible={[
                { nombre: 'Carlos Gómez', tipo: 'Ingeniero' },
                { nombre: 'Sandra Herrera', tipo: 'Arquitecto' },
                { nombre: 'Luis Méndez', tipo: 'Ingeniero' },
              ]}
              initialData={{
                personal: editando.nombre,
                diasBinarios: editando.diasAsignados,
                hasta: editando.fechaFin,
              }}
              onConfirm={(data) => {
                // lógica para editar personal
                setEditarModalOpen(false);
                setEditando(null);
              }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
