import { FC, useEffect, useState, useMemo, useCallback } from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Grid, Stack, Button, SvgIcon } from '@mui/material';

import { OverviewDoneTasks } from 'src/sections/dashboard/overview/overview-done-tasks';
import { OverviewPendingIssues } from 'src/sections/dashboard/overview/overview-pending-issues';
import { OverviewOpenTickets } from 'src/sections/dashboard/overview/overview-open-tickets';

import { usePendientesApi } from 'src/api/pendientes/usePendientesApi';
import { Pendiente } from 'src/api/types';
import toast from 'react-hot-toast';
import { ModalCrearPendiente } from './crear-pendiente-modal';
import { ModalPendientesPorEstado } from './pendientes-por-estado-modal';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';

interface Props {
  tipo: 'oficina' | 'proyecto';
}

export const PizarronPendientes: FC<Props> = ({ tipo }) => {
  const router = useRouter();
  const { getPendientesOficina, getPendientesProyecto, patchEstadoPendiente, eliminarPendiente } = usePendientesApi();
  const [pendientes, setPendientes] = useState<Pendiente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEstado, setModalEstado] = useState<'no_iniciado' | 'pendiente' | 'completado' | null>(null);
  const [crearModalOpen, setCrearModalOpen] = useState(false);

  const referenciaId = useMemo(
    () => (tipo === 'proyecto' ? Number(router.query.id) || null : null),
    [tipo, router.query.id]
  );

  const fetchPendientes = useCallback(async () => {
    try {
      let data: Pendiente[] = [];
      if (tipo === 'oficina') {
        data = await getPendientesOficina();
      } else if (tipo === 'proyecto' && referenciaId) {
        data = await getPendientesProyecto(referenciaId);
      }
      setPendientes(data);
    } catch (error) {
      console.error(error);
    }
  }, [tipo, referenciaId, getPendientesOficina, getPendientesProyecto]);

  useEffect(() => {
    fetchPendientes();
  }, [fetchPendientes]);

  const counts = useMemo(
    () => ({
      no_iniciado: pendientes.filter((p) => p.estado === 'no_iniciado').length,
      pendiente: pendientes.filter((p) => p.estado === 'pendiente').length,
      completado: pendientes.filter((p) => p.estado === 'completado').length,
    }),
    [pendientes]
  );

  const handleOpenModal = useCallback((estado: 'no_iniciado' | 'pendiente' | 'completado') => {
    setModalEstado(estado);
    setModalOpen(true);
  }, []);

  const pendientesFiltrados = useMemo(() => {
    if (!modalEstado) return [];
    return pendientes.filter((p) => p.estado === modalEstado);
  }, [pendientes, modalEstado]);

  const handleChangeEstado = useCallback(
    async (id: number, nuevoEstado: 'no_iniciado' | 'pendiente' | 'completado') => {
      try {
        await patchEstadoPendiente(id, nuevoEstado);
        await fetchPendientes();
        toast.success(`Pendiente actualizado correctamente a ${nuevoEstado.replace('_', ' ')}`);
      } catch (error) {
        toast.error('Error al actualizar el estado del pendiente');
      }
    },
    [patchEstadoPendiente, fetchPendientes]
  );

  const handleDeletePendiente = useCallback(
    async (id: number) => {
      try {
        await eliminarPendiente(id);
        await fetchPendientes();
        toast.success('Pendiente eliminado correctamente');
      } catch (error) {
        toast.error('Error al eliminar el pendiente');
      }
    },
    [eliminarPendiente, fetchPendientes]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={3}>
        <Button
          startIcon={
            <SvgIcon>
              <PlusIcon />
            </SvgIcon>
          }
          onClick={() => setCrearModalOpen(true)}
          variant="contained"
        >
          Nueva tarea
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <OverviewPendingIssues
            amount={counts.no_iniciado}
            onClick={() => handleOpenModal('no_iniciado')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <OverviewOpenTickets
            amount={counts.pendiente}
            onClick={() => handleOpenModal('pendiente')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <OverviewDoneTasks
            amount={counts.completado}
            onClick={() => handleOpenModal('completado')}
          />
        </Grid>
      </Grid>

      <ModalCrearPendiente
        open={crearModalOpen}
        onClose={() => setCrearModalOpen(false)}
        tipo={tipo}
        onCreated={fetchPendientes}
      />

      <ModalPendientesPorEstado
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        estado={modalEstado}
        pendientes={pendientesFiltrados}
        onChangeEstado={handleChangeEstado}
        onDeletePendiente={handleDeletePendiente}
      />
    </Box>
  );
};
