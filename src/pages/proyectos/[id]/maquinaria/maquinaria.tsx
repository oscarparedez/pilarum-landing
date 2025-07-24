import { FC, useCallback, useMemo, useState } from 'react';
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
import { AsignacionMaquinaria, Maquinaria as MaquinariaInterface, NuevaAsignacionMaquinaria } from 'src/api/types';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { ModalEditarMaquinaria } from './editar-maquinaria-modal';

interface MaquinariaProps {
  maquinaria: MaquinariaInterface[];
  asignacionesMaquinaria: AsignacionMaquinaria[];
  handleCrearAsignacion: (data: NuevaAsignacionMaquinaria) => void;
}

export const Maquinaria: FC<MaquinariaProps> = ({
    maquinaria,
    asignacionesMaquinaria,
    handleCrearAsignacion, 
  }) => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editando, setEditando] = useState<AsignacionMaquinaria | null>(null);

  const [filtros, setFiltros] = useState<{ search: string; estado?: 'Activo' | 'Inactivo' | 'Todos' }>({ search: '', estado: 'Todos' });

  const today = useMemo(() => new Date(), []);

  const calcularEstado = (entrada: string, fin?: string): 'Activo' | 'Inactivo' => {
    const hoy = today;
    const finDate = fin ? new Date(fin + 'T12:00:00') : null;
    if (finDate && finDate < hoy) return 'Inactivo';
    return 'Activo';
  };

  const asignacionesConEstado = useMemo(() => {
    return asignacionesMaquinaria.map((a) => ({
      ...a,
      estado: calcularEstado(a.fecha_inicio, a.fecha_fin),
    }));
  }, [asignacionesMaquinaria]);

  const asignacionesFiltradas = useMemo(() => {
    return aplicarFiltros(asignacionesConEstado, filtros, {
      camposTexto: ['equipo.nombre', 'usuario_recibe.first_name'],
      campoEstado: 'estado',
    });
  }, [asignacionesConEstado, filtros]);

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const onCrearAsgnacion = useCallback(
    (data: NuevaAsignacionMaquinaria) => {
      handleCrearAsignacion(data);
      setAgregarModalOpen(false);
    },
    [handleCrearAsignacion]
  );

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

          <TablaPaginadaConFiltros
            totalItems={asignacionesFiltradas.length}
            onFiltrar={handleFiltrar}
            filtrosFecha={false}
            filtrosEstado={true}
          >
            {(currentPage, estadoFiltro) => (
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 600 }}
              >
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
                    {asignacionesFiltradas
                      .filter((r) => (estadoFiltro ? r.estado === estadoFiltro : true))
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, i) => (
                        <TableRow
                          key={i}
                          hover
                        >
                          <TableCell>{item.equipo.nombre}</TableCell>
                          <TableCell>{item.equipo.tipo}</TableCell>
                          <TableCell>{item.equipo.fecha_inicio}</TableCell>
                          <TableCell>{item.equipo.fecha_fin}</TableCell>
                          <TableCell>{item.estado}</TableCell>
                          <TableCell>{item.dias_asignados.join(', ')}</TableCell>
                          <TableCell>{item.usuario_recibe.first_name}</TableCell>
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
              </TableContainer>
            )}
          </TablaPaginadaConFiltros>

          <ModalAgregarMaquinaria
            open={agregarModalOpen}
            onClose={() => setAgregarModalOpen(false)}
            maquinasDisponibles={maquinaria}
            onConfirm={onCrearAsgnacion}
          />

          {editando && (
            <ModalEditarMaquinaria
              open={editarModalOpen}
              onClose={() => {
                setEditarModalOpen(false);
                setEditando(null);
              }}
              maquinasDisponibles={maquinaria}
              initialData={editando}
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
