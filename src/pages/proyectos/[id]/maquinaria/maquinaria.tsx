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
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { ModalAgregarMaquinaria } from './agregar-maquinaria-modal';
import { ModalEditarMaquinaria } from './editar-maquinaria-modal';
import { diasBinarioToTexto, diasToBinario } from './utils';
import { Recurso } from '../index.d';

export const Maquinaria: FC<{ maquinaria: Recurso[] }> = ({ maquinaria }) => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editando, setEditando] = useState<Recurso | null>(null);

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
            <Typography variant="h5">Maquinaria y herramientas</Typography>
            <Button variant="contained" onClick={() => setAgregarModalOpen(true)}>
              Asignar maquinaria
            </Button>
          </Stack>

          <TablaPaginadaConFiltros
            totalItems={maquinaria.length}
            onFiltrar={() => {}}
            filtrosFecha={false}
            filtrosEstado={true}
          >
            {(currentPage, estadoFiltro) => (
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Inicio</TableCell>
                      <TableCell>Fin</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Días</TableCell>
                      <TableCell>Asignado a</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {maquinaria
                      .filter((r) => (estadoFiltro ? r.estado === estadoFiltro : true))
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, i) => (
                        <TableRow key={i} hover>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell>{item.tipo}</TableCell>
                          <TableCell>{item.fechaInicio}</TableCell>
                          <TableCell>{item.fechaFin}</TableCell>
                          <TableCell>{item.estado}</TableCell>
                          <TableCell>{diasBinarioToTexto(item.diasAsignados)}</TableCell>
                          <TableCell>{item.asignadoA}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => {
                                  setEditando(item);
                                  setEditarModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button size="small" variant="outlined" color="error">
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

          <ModalAgregarMaquinaria
            open={agregarModalOpen}
            onClose={() => setAgregarModalOpen(false)}
            maquinasDisponibles={[
              'Excavadora CAT 320',
              'Retroexcavadora Volvo',
              'Camión Mack',
              'Martillo demoledor',
            ]}
            onConfirm={(data) => {
              // lógica para agregar
            }}
          />

          {editando && (
            <ModalEditarMaquinaria
              open={editarModalOpen}
              onClose={() => {
                setEditarModalOpen(false);
                setEditando(null);
              }}
              maquinasDisponibles={[
                'Excavadora CAT 320',
                'Retroexcavadora Volvo',
                'Camión Mack',
                'Martillo demoledor',
              ]}
              initialData={{
                maquina: editando.nombre,
                diasBinarios: editando.diasAsignados,
                hasta: editando.fechaFin,
                asignadoA: editando.asignadoA,
              }}
              onConfirm={(data) => {
                // lógica para editar
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
