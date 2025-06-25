import { FC, useState } from 'react';
import { Grid } from '@mui/material';
import { OverviewDoneTasks } from 'src/sections/dashboard/overview/overview-done-tasks';
import { OverviewPendingIssues } from 'src/sections/dashboard/overview/overview-pending-issues';
import { OverviewOpenTickets } from 'src/sections/dashboard/overview/overview-open-tickets';
import { ModalTareas } from './tareas-pizarron-modal';
import { Tarea } from '../index.d';
import { Box } from '@mui/system';

interface PizarronProps {
  tareas: Tarea[];
}

export const Pizarron: FC<PizarronProps> = ({ tareas }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estadoActual, setEstadoActual] = useState<Tarea['estado']>('pendiente');

  const abrirModal = (estado: Tarea['estado']) => {
    setEstadoActual(estado);
    setModalAbierto(true);
  };

  const tareasPendientes = tareas.filter((t) => t.estado === 'pendiente');
  const tareasActivas = tareas.filter((t) => t.estado === 'activa');
  const tareasCompletadas = tareas.filter((t) => t.estado === 'completada');

  return (
    <Box sx={{ p: 3 }}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <OverviewPendingIssues
            amount={3}
            onClick={() => abrirModal('pendiente')}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <OverviewOpenTickets
            amount={4}
            onClick={() => abrirModal('activa')}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <OverviewDoneTasks
            amount={2}
            onClick={() => abrirModal('completada')}
          />
        </Grid>
      </Grid>

      <ModalTareas
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        estado={estadoActual}
        tareas={tareas.filter((t) => t.estado === estadoActual)}
        onActualizarEstado={() => {}}
      />
    </Box>
  );
};
