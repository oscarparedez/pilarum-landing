import { FC, useState } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableHead,
  TableRow, Stack, Card, CardContent
} from '@mui/material';
import { diasBinarioToTexto, diasToBinario } from '../maquinaria/utils';
import { ModalAgregarPersonal } from './agregar-personal-modal';
import { ModalEditarPersonal } from './editar-personal-modal';

interface Asignacion {
  nombre: string;
  tipo: 'Ingeniero' | 'Arquitecto';
  fechaInicio: string;
  fechaFin: string;
  estado: 'En uso' | 'Liberado';
  diasAsignados: string;
}

export const Personal: FC = () => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editando, setEditando] = useState<Asignacion | null>(null);

  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([
    {
      nombre: 'Carlos Gómez',
      tipo: 'Ingeniero',
      fechaInicio: '2025-06-01',
      fechaFin: '2025-06-20',
      estado: 'En uso',
      diasAsignados: '1111100',
    },
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 3 }}>
            <Typography variant="h5">Ingenieros y arquitectos asignados</Typography>
            <Button variant="contained" onClick={() => setAgregarModalOpen(true)}>
              Asignar recurso
            </Button>
          </Stack>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 900 }}>
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
                  {asignaciones.map((item, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.fechaInicio}</TableCell>
                      <TableCell>{item.fechaFin}</TableCell>
                      <TableCell>{item.estado}</TableCell>
                      <TableCell>{diasBinarioToTexto(item.diasAsignados)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" onClick={() => {
                            setEditando(item);
                            setEditarModalOpen(true);
                          }}>Editar</Button>
                          <Button size="small" variant="outlined" color="error">Liberar</Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>

          <ModalAgregarPersonal
            open={agregarModalOpen}
            onClose={() => setAgregarModalOpen(false)}
            personalDisponible={['Carlos Gómez', 'Sandra Herrera', 'Luis Méndez']}
            onConfirm={(data) => {
              setAsignaciones(prev => [
                ...prev,
                {
                  nombre: data.personal,
                  tipo: data.tipo,
                  fechaInicio: new Date().toISOString().split('T')[0],
                  fechaFin: data.hasta,
                  estado: 'En uso',
                  diasAsignados: diasToBinario(data.dias),
                },
              ]);
              setAgregarModalOpen(false);
            }}
          />

          {editando && (
            <ModalEditarPersonal
              open={editarModalOpen}
              onClose={() => {
                setEditarModalOpen(false);
                setEditando(null);
              }}
              personalDisponible={['Carlos Gómez', 'Sandra Herrera', 'Luis Méndez']}
              initialData={{
                personal: editando.nombre,
                diasBinarios: editando.diasAsignados,
                hasta: editando.fechaFin,
              }}
              onConfirm={(data) => {
                setAsignaciones(prev =>
                  prev.map(r =>
                    r.nombre === data.personal
                      ? {
                          ...r,
                          fechaFin: data.hasta,
                          diasAsignados: diasToBinario(data.dias),
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
