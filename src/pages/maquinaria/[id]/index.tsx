import type { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { EstadisticasRapidas } from './estadisticas-rapidas/estadisticas-rapidas';
import { Asignaciones } from './asignaciones/asignaciones';
import { HistorialServicios } from './historial-servicios/historial-servicios';
import { HistorialConsumos } from './historial-consumos/historial-consumos';
import { Servicio, Consumo } from './index.d';
import { EditarDatosBasicosModal } from './editar-datos-modal';
import maquinaria from './maquinaria.json';

import { ConfigMaquinaria } from './index.d';

const config: ConfigMaquinaria = maquinaria as ConfigMaquinaria;


const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

   const {
    nombre,
    placa,
    costo,
    totalServicios,
    totalCombustibleUltimoMes,
    asignaciones,
    servicios,
    consumos,
  } = config;

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 8 }}
    >
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            px={3}
          >
            <Box>
              <Typography variant="h4">{nombre}</Typography>
              <Typography color="text.secondary">Placa No. {placa}</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setModalEditarOpen(true)}
            >
              Editar datos
            </Button>
          </Stack>

          <EditarDatosBasicosModal
            open={modalEditarOpen}
            onClose={() => setModalEditarOpen(false)}
            initialData={{
              nombre: maquinaria.nombre,
              placa: maquinaria.placa,
              esMaquina: true, // 👈 cambia a false si es herramienta
            }}
            onConfirm={(updated) => {
              // llamada api
              setModalEditarOpen(false);
            }}
          />

          {/* ESTADISCICAS RAPIDAS */}
          <EstadisticasRapidas
            costo={costo}
            totalServicios={totalServicios}
            totalCombustibleUltimoMes={totalCombustibleUltimoMes}
          />
          {/* ASIGNACIONES */}
          <Asignaciones asignaciones={asignaciones} />

          {/* HISTORIAL DE SERVICIOS */}
          <HistorialServicios servicios={servicios} />

          {/* HISTORIAL CONSUMOS */}
          <HistorialConsumos consumos={consumos} />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
