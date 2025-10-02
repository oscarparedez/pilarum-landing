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
import {
  AsignacionMaquinaria,
  Maquinaria as MaquinariaInterface,
  NuevaAsignacionMaquinaria,
} from 'src/api/types';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { ModalEditarMaquinaria } from './editar-maquinaria-modal';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { esHoy, formatearFecha } from 'src/utils/format-date';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

interface MaquinariaProps {
  maquinaria: MaquinariaInterface[];
  usuarios: any[];
  asignacionesMaquinaria: AsignacionMaquinaria[];
  handleCrearAsignacion: (data: NuevaAsignacionMaquinaria) => void;
  handleActualizarAsignacion: (id: number, data: NuevaAsignacionMaquinaria) => void;
  handleEliminarAsignacion: (id: number) => void;
  handleLiberarAsignacion: (id: number) => void;
}

export const Maquinaria: FC<MaquinariaProps> = ({
  maquinaria,
  usuarios,
  asignacionesMaquinaria,
  handleCrearAsignacion,
  handleActualizarAsignacion,
  handleEliminarAsignacion,
  handleLiberarAsignacion,
}) => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editando, setEditando] = useState<AsignacionMaquinaria | null>(null);
  const [asignacionAEliminar, setAsignacionAEliminar] = useState<AsignacionMaquinaria | null>(null);

  const canAsignarMaquinaria = useHasPermission(PermissionId.ASIGNAR_MAQ_PROYECTO);
  const canEditarAsignacionMaquinaria = useHasPermission(PermissionId.EDITAR_ASIG_MAQ_PROYECTO);
  const canLiberarMaquinaria = useHasPermission(PermissionId.LIBERAR_ASIG_MAQ_PROYECTO);

  const [filtros, setFiltros] = useState<{
    search: string;
    estado?: 'Activo' | 'Inactivo' | 'Todos';
  }>({
    search: '',
    estado: 'Todos',
  });

  const today = useMemo(() => new Date(), []);

  const calcularEstado = useCallback(
    (fin: string): 'Activo' | 'Inactivo' => {
      const hoy = today;
      const finDate = fin ? new Date(fin) : null;
      if (finDate && finDate < hoy) return 'Inactivo';
      return 'Activo';
    },
    [today]
  );

  const asignacionesConEstado = useMemo(() => {
    return asignacionesMaquinaria.map((a) => ({
      ...a,
      estado: calcularEstado(a.fecha_fin),
    }));
  }, [asignacionesMaquinaria, calcularEstado]);

  const asignacionesFiltradas = useMemo(() => {
    return aplicarFiltros(asignacionesConEstado, filtros, {
      camposTexto: [
        'equipo.nombre',
        'usuario_recibe.first_name',
        'usuario_recibe.last_name',
        'equipo.tipo',
      ],
      campoEstado: 'estado',
    });
  }, [asignacionesConEstado, filtros]);

  const handleFiltrar = useCallback(
    (f: typeof filtros) => {
      setFiltros(f);
    },
    [setFiltros]
  );

  const onCrearAsignacion = useCallback(
    (data: NuevaAsignacionMaquinaria) => {
      handleCrearAsignacion(data);
      setAgregarModalOpen(false);
    },
    [handleCrearAsignacion]
  );

  const onActualizarAsignacion = useCallback(
    (id: number, data: NuevaAsignacionMaquinaria) => {
      handleActualizarAsignacion(id, data);
      setEditarModalOpen(false);
      setEditando(null);
    },
    [handleActualizarAsignacion]
  );

  const onLiberarAsignacion = useCallback(
    (asignacion: AsignacionMaquinaria) => {
      const entrada = new Date(asignacion.fecha_entrada);
      const hoy = today;
      if (entrada > hoy) {
        setAsignacionAEliminar(asignacion);
      } else {
        handleLiberarAsignacion(asignacion.id);
      }
    },
    [handleLiberarAsignacion, today]
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
            {canAsignarMaquinaria && (
              <Button
                variant="contained"
                onClick={() => setAgregarModalOpen(true)}
              >
                Asignar maquinaria
              </Button>
            )}
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
                      <TableCell>Usuario creador</TableCell>
                      {(canEditarAsignacionMaquinaria || canLiberarMaquinaria) && (
                        <TableCell>Acciones</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {asignacionesFiltradas
                      .filter((r) => (estadoFiltro ? r.estado === estadoFiltro : true))
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((item, i) => {
                        const esFutura = new Date(item.fecha_entrada) > today;
                        return (
                          <TableRow
                            key={i}
                            hover
                          >
                            <TableCell>{item.equipo.nombre}</TableCell>
                            <TableCell>{item.equipo.tipo}</TableCell>
                            <TableCell>{formatearFecha(item.fecha_entrada)}</TableCell>
                            <TableCell>{formatearFecha(item.fecha_fin)}</TableCell>
                            <TableCell>{item.estado}</TableCell>
                            <TableCell>{item.dias_asignados.join(', ')}</TableCell>
                            <TableCell>
                              {item.usuario_recibe?.first_name} {item.usuario_recibe?.last_name}
                            </TableCell>
                            <TableCell>
                              {item.usuario_creador?.first_name} {item.usuario_creador?.last_name}
                            </TableCell>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                              >
                                {canEditarAsignacionMaquinaria && (
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
                                )}
                                {canLiberarMaquinaria && (
                                  <Button
                                    disabled={esHoy(item.fecha_fin)}
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onLiberarAsignacion(item)}
                                  >
                                    {esFutura ? 'Eliminar' : 'Liberar'}
                                  </Button>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TablaPaginadaConFiltros>

          <ModalAgregarMaquinaria
            open={agregarModalOpen}
            onClose={() => setAgregarModalOpen(false)}
            maquinasDisponibles={maquinaria}
            usuarios={usuarios}
            onConfirm={onCrearAsignacion}
          />

          {editando && (
            <ModalEditarMaquinaria
              open={editarModalOpen}
              onClose={() => {
                setEditarModalOpen(false);
                setEditando(null);
              }}
              maquinasDisponibles={maquinaria}
              usuarios={usuarios}
              initialData={editando}
              onConfirm={(data) => onActualizarAsignacion(editando.id, data)}
            />
          )}

          {asignacionAEliminar && (
            <ModalEliminar
              type="asignación de maquinaria"
              open={!!asignacionAEliminar}
              onClose={() => setAsignacionAEliminar(null)}
              onConfirm={() => {
                handleEliminarAsignacion(asignacionAEliminar.id);
                setAsignacionAEliminar(null);
              }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
