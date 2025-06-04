import { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { ModalAgregarMaquinaria } from './agregar-maquinaria-modal';
import { ModalEditarMaquinaria } from './editar-maquinaria-modal';
import { diasBinarioToTexto, diasToBinario } from './utils';

interface Recurso {
  nombre: string;
  tipo: 'Maquinaria' | 'Herramienta';
  fechaInicio: string;
  fechaFin: string;
  estado: 'En uso' | 'Liberado';
  diasAsignados: string;
  asignadoA: string;
}

export const Maquinaria: FC = () => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editando, setEditando] = useState<Recurso | null>(null);

  const [recursos, setRecursos] = useState<Recurso[]>([
    {
      nombre: 'Excavadora CAT 320',
      tipo: 'Maquinaria',
      fechaInicio: '2025-06-01',
      fechaFin: '2025-06-15',
      estado: 'En uso',
      diasAsignados: '1010100',
      asignadoA: 'Juan Pérez',
    },
    {
      nombre: 'Martillo demoledor',
      tipo: 'Herramienta',
      fechaInicio: '2025-06-03',
      fechaFin: '2025-06-08',
      estado: 'Liberado',
      diasAsignados: '1111100',
      asignadoA: 'Ana López',
    },
  ]);

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
            <Button
              variant="contained"
              onClick={() => setAgregarModalOpen(true)}
            >
              Asignar maquinaria
            </Button>
          </Stack>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 900 }}>
              <Table size="small">
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
                  {recursos.map((item, i) => (
                    <TableRow
                      key={i}
                      hover
                      sx={{
                        transition: 'background 0.2s ease',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                      }}
                    >
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.fechaInicio}</TableCell>
                      <TableCell>{item.fechaFin}</TableCell>
                      <TableCell>{item.estado}</TableCell>
                      <TableCell>{diasBinarioToTexto(item.diasAsignados)}</TableCell>
                      <TableCell>{item.asignadoA}</TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                        >
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
            </Box>
          </Box>

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
                setRecursos((prev) =>
                  prev.map((r) =>
                    r.nombre === data.maquina
                      ? {
                          ...r,
                          fechaFin: data.hasta,
                          diasAsignados: diasToBinario(data.dias),
                          asignadoA: data.asignadoA,
                        }
                      : r
                  )
                );
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
