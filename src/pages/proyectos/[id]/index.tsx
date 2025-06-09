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
import { ConfigProyecto } from './index.d';

const config: ConfigProyecto = proyecto as ConfigProyecto;

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

  const { nombre, ubicacion, fechaInicio, fechaFin, presupuestoInicial } = datosBasicos;

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
