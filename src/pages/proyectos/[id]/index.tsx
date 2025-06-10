import type { NextPage } from 'next';
import { useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';

import { Timeline } from './timeline/timeline';
import { ResumenFinanciero } from './resumen-financiero/resumen-financiero';
import { MaterialPlanificado } from './material-planificado/material-planificado';
import { Revisiones } from './revisiones/revisiones';
import { Maquinaria } from './maquinaria/maquinaria';
import { PersonalAsignado } from './personal/personal';
import { EditarDatosBasicosModal } from './editar-datos-modal';
import proyecto from './proyecto.json';
import { ConfigProyecto, Tarea } from './index.d';
import { Pizarron } from './pizarron/pizarron';

const config: ConfigProyecto = proyecto as ConfigProyecto;

export const tareasEjemplo: Tarea[] = [
  // Tareas pendientes (3)
  {
    id: '1',
    descripcion: 'Revisar planos estructurales del primer nivel',
    estado: 'pendiente',
    asignadoA: { id: 'u1', nombre: 'Juan Pérez' },
    fechaCreacion: '2025-06-01T09:00:00Z',
  },
  {
    id: '2',
    descripcion: 'Solicitar cotizaciones de materiales',
    estado: 'pendiente',
    asignadoA: { id: 'u2', nombre: 'Ana Gómez' },
    fechaCreacion: '2025-06-02T10:30:00Z',
  },
  {
    id: '3',
    descripcion: 'Validar permisos municipales',
    estado: 'pendiente',
    asignadoA: { id: 'u3', nombre: 'Carlos Ruiz' },
    fechaCreacion: '2025-06-03T14:45:00Z',
  },

  // Tareas activas (4)
  {
    id: '4',
    descripcion: 'Supervisar vaciado de concreto',
    estado: 'activa',
    asignadoA: { id: 'u1', nombre: 'Juan Pérez' },
    fechaCreacion: '2025-06-04T08:00:00Z',
  },
  {
    id: '5',
    descripcion: 'Verificar instalación de andamios',
    estado: 'activa',
    asignadoA: { id: 'u2', nombre: 'Ana Gómez' },
    fechaCreacion: '2025-06-05T11:20:00Z',
  },
  {
    id: '6',
    descripcion: 'Actualizar cronograma del proyecto',
    estado: 'activa',
    asignadoA: { id: 'u3', nombre: 'Carlos Ruiz' },
    fechaCreacion: '2025-06-06T13:15:00Z',
  },
  {
    id: '7',
    descripcion: 'Coordinar visita del inspector de obra',
    estado: 'activa',
    asignadoA: { id: 'u1', nombre: 'Juan Pérez' },
    fechaCreacion: '2025-06-07T15:00:00Z',
  },

  // Tareas completadas (2)
  {
    id: '8',
    descripcion: 'Entrega de planos firmados por arquitecto',
    estado: 'completada',
    asignadoA: { id: 'u2', nombre: 'Ana Gómez' },
    fechaCreacion: '2025-05-30T09:30:00Z',
  },
  {
    id: '9',
    descripcion: 'Informe de avance semanal enviado',
    estado: 'completada',
    asignadoA: { id: 'u3', nombre: 'Carlos Ruiz' },
    fechaCreacion: '2025-05-31T16:00:00Z',
  },
];

const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();

  const {
    datosBasicos,
    ampliacionesPresupuesto,
    ampliacionesFecha,
    ingresos,
    pagos,
    revisiones,
    maquinaria,
    personal,
    materialPlanificado,
  }: ConfigProyecto = config;

  const { nombre, ubicacion, fechaInicio, fechaFin, socio, presupuestoInicial } = datosBasicos;

  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [datosProyecto, setDatosProyecto] = useState(datosBasicos);

  // sum de las ampliaciones de presupuesto + presupeusto inicial
  const presupuestoTotal =
    presupuestoInicial +
    ampliacionesPresupuesto.reduce((acc, curr) => {
      const monto = curr.monto ? curr.monto : 0;
      return acc + monto;
    }, 0);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 8 }}
    >
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Stack spacing={2}>
          {/* ENCABEZADO */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            px={3}
          >
            <Box>
              <Typography variant="h4">{nombre}</Typography>
              <Typography color="text.secondary">{ubicacion}</Typography>
              <Typography color="text.secondary">Socio - {socio.nombre}</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setModalEditarAbierto(true)}
            >
              Editar datos básicos
            </Button>
          </Stack>

          {/* TIMELINE */}
          <Timeline
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            presupuestoInicial={presupuestoTotal}
            ampliacionesFecha={ampliacionesFecha}
            ampliacionesPresupuesto={ampliacionesPresupuesto}
            onAmpliarFecha={() => console.log('Ampliar fecha')}
            onAmpliarPresupuesto={() => console.log('Ampliar presupuesto')}
          />

          <Pizarron tareas={tareasEjemplo} />

          {/* RESUMEN FINANCIERO */}
          <ResumenFinanciero
            ingresos={ingresos}
            pagos={pagos}
            presupuestoInicial={presupuestoTotal}
          />

          {/* MODAL PARA EDITAR DATOS BÁSICOS */}
          <EditarDatosBasicosModal
            open={modalEditarAbierto}
            onClose={() => setModalEditarAbierto(false)}
            initialData={datosProyecto}
            onConfirm={(data) => {
              setDatosProyecto(data);
              setModalEditarAbierto(false);
            }}
          />

          {/* MAQUINARIA */}
          <Maquinaria maquinaria={maquinaria} />
          {/* PERSONAL */}
          <PersonalAsignado personal={personal} />
          {/* MATERIAL PLANIFICADO */}
          <MaterialPlanificado materialPlanificado={materialPlanificado} />
          {/* REVISIÓN DE OBRA */}
          <Revisiones revisiones={revisiones} />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
