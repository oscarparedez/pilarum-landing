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
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import { ModalAgregarPersonal } from './agregar-personal-modal';
import { ModalEditarPersonal } from './editar-personal-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { esHoy, formatearFechaHora } from 'src/utils/format-date';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/pages/oficina/roles/permissions';

interface PersonalAsignadoProps {
  usuarios: any[];
  asignacionesPersonal: any[];
  handleCrearAsignacionPersonal: (data: {
    usuario_id: number;
    dias_asignados: string[];
    fecha_entrada: string;
    fecha_fin: string;
  }) => void;
  handleActualizarAsignacionPersonal: (
    asignacion_id: number,
    data: {
      usuario_id: number;
      dias_asignados: string[];
      fecha_entrada: string;
      fecha_fin: string;
    }
  ) => void;
  handleLiberarAsignacionPersonal: (asignacion_id: number) => void;
  handleEliminarAsignacionPersonal: (asignacion_id: number) => void;
}

export const PersonalAsignado: FC<PersonalAsignadoProps> = ({
  usuarios,
  asignacionesPersonal,
  handleCrearAsignacionPersonal,
  handleActualizarAsignacionPersonal,
  handleLiberarAsignacionPersonal,
  handleEliminarAsignacionPersonal,
}) => {
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editando, setEditando] = useState<any | null>(null);
  const [asignacionAEliminar, setAsignacionAEliminar] = useState<any | null>(null);

  const canAsignarPersonal = useHasPermission(PermissionId.CREAR_ASIG_PERSONAL);
  const canEditAsignacionPersonal = useHasPermission(PermissionId.EDITAR_ASIG_PERSONAL);
  const canLiberarAsignacionPersonal = useHasPermission(PermissionId.LIBERAR_ASIG_PERSONAL);

  const [filtros, setFiltros] = useState<{
    search: string;
    estado?: 'Activo' | 'Inactivo' | 'Todos';
  }>({ search: '', estado: 'Todos' });

  const today = useMemo(() => new Date(), []);

  const calcularEstado = (entrada: string, fin?: string): 'Activo' | 'Inactivo' => {
    const hoy = today;
    const finDate = fin ? new Date(fin) : null;

    if (finDate && finDate < hoy) return 'Inactivo';
    return 'Activo';
  };

  const asignacionesConEstado = useMemo(() => {
    return asignacionesPersonal.map((a) => ({
      ...a,
      estado: calcularEstado(a.fecha_entrada, a.fecha_fin),
    }));
  }, [asignacionesPersonal]);

  const asignacionesFiltradas = useMemo(() => {
    return aplicarFiltros(asignacionesConEstado, filtros, {
      camposTexto: ['usuario.first_name', 'usuario.last_name'],
      campoEstado: 'estado',
    });
  }, [asignacionesConEstado, filtros]);

  const handleFiltrar = useCallback((f: typeof filtros) => {
    setFiltros(f);
  }, []);

  const onCrearAsignacionPersonal = useCallback(
    (data: {
      usuario_id: number;
      dias_asignados: string[];
      fecha_entrada: string;
      fecha_fin: string;
    }) => {
      handleCrearAsignacionPersonal(data);
      setAgregarModalOpen(false);
    },
    [handleCrearAsignacionPersonal]
  );

  const onActualizarAsignacionPersonal = useCallback(
    (
      asignacion_id: number,
      data: {
        usuario_id: number;
        dias_asignados: string[];
        fecha_entrada: string;
        fecha_fin: string;
      }
    ) => {
      handleActualizarAsignacionPersonal(asignacion_id, data);
      setEditarModalOpen(false);
      setEditando(null);
    },
    [handleActualizarAsignacionPersonal]
  );

  const onLiberarAsignacionPersonal = useCallback(
    (asignacion: any) => {
      const entrada = new Date(asignacion.fecha_entrada);
      const hoy = today;

      if (entrada > hoy) {
        // Mostrar modal de confirmación
        setAsignacionAEliminar(asignacion);
      } else {
        handleLiberarAsignacionPersonal(asignacion.id);
      }
    },
    [handleLiberarAsignacionPersonal, today]
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
            <Typography variant="h5">Ingenieros y arquitectos asignados</Typography>
            {canAsignarPersonal && (
              <Button
                variant="contained"
                onClick={() => setAgregarModalOpen(true)}
              >
                Asignar recurso
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
                      {(canEditAsignacionPersonal || canLiberarAsignacionPersonal) && <TableCell>Acciones</TableCell> }
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
                            <TableCell>
                              {item.usuario.first_name} {item.usuario.last_name}
                            </TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{formatearFechaHora(item.fecha_entrada)}</TableCell>
                            <TableCell>{formatearFechaHora(item.fecha_fin)}</TableCell>
                            <TableCell>{item.estado}</TableCell>
                            <TableCell>{item.dias_asignados.join(', ')}</TableCell>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                              >
                                {canEditAsignacionPersonal && (
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      setEditando(item);
                                      setEditarModalOpen(true);
                                    }}
                                  >
                                    Editar
                                  </Button>
                                )}
                                {canLiberarAsignacionPersonal && (
                                  <Button
                                    disabled={esHoy(item.fecha_fin)}
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onLiberarAsignacionPersonal(item)}
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

          <ModalAgregarPersonal
            open={agregarModalOpen}
            onClose={() => setAgregarModalOpen(false)}
            personalDisponible={usuarios}
            onConfirm={onCrearAsignacionPersonal}
          />

          {editando && (
            <ModalEditarPersonal
              open={editarModalOpen}
              onClose={() => {
                setEditarModalOpen(false);
                setEditando(null);
              }}
              personalDisponible={usuarios}
              initialData={editando}
              onConfirm={onActualizarAsignacionPersonal}
            />
          )}

          {asignacionAEliminar && (
            <ModalEliminar
              type="asignación de personal"
              open={!!asignacionAEliminar}
              onClose={() => setAsignacionAEliminar(null)}
              onConfirm={() => {
                handleEliminarAsignacionPersonal(asignacionAEliminar.id);
                setAsignacionAEliminar(null);
              }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
