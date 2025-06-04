import type { NextPage } from 'next';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Timeline } from './timeline/timeline';
import { ResumenFinanciero } from './resumen-financiero/resumen-financiero';
import { Revisiones } from './revisiones/revisiones';
import { Inventario } from './inventario/inventario';
import { Maquinaria } from './maquinaria/maquinaria';
import { Personal } from './personal/personal';
import { useState } from 'react';
import { EditarDatosBasicosModal } from './editar-datos-modal';

const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();

  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [datosProyecto, setDatosProyecto] = useState({
    nombre: 'Residencial Aurora',
    ubicacion: 'Zona 16, Guatemala',
    fechaInicio: '2025-01-10',
    fechaFin: '2025-10-15',
    presupuesto: 'Q100,000',
  });

  const revisiones = [
    {
      id: 'rev1',
      fecha: '2025-05-28',
      responsable: 'Ana Méndez',
      anotaciones: 'Avance del segundo nivel',
      imagenes: [
        '/assets/products/product-1.png',
        '/assets/products/product-2.png',
        '/assets/products/product-4.png',
      ],
    },
    {
      id: 'rev2',
      fecha: '2025-05-20',
      responsable: 'Carlos Ruiz',
      anotaciones: 'Colado de losa principal',
      imagenes: ['/assets/products/product-1.png', '/assets/products/product-2.png'],
    },
  ];

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
              <Typography variant="h4">{datosProyecto.nombre}</Typography>
              <Typography color="text.secondary">{datosProyecto.ubicacion}</Typography>
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
            fechaInicio="2025-01-10"
            fechaFin="2025-10-15"
            ampliacionesFecha={[
              { fecha: '2025-08-10', motivo: 'Demora por clima', usuario: 'Luis G.' },
              { fecha: '2025-09-02', motivo: 'Cambio de planos', usuario: 'Ana M.' },
            ]}
            presupuestoInicial="Q100,000"
            ampliacionesPresupuesto={[
              {
                fecha: '2025-03-10',
                motivo: 'Compra de herramienta adicional',
                monto: '15000',
                usuario: 'Luis G.',
              },
              {
                fecha: '2025-06-22',
                motivo: 'Costo extra de concreto',
                monto: '8500',
                usuario: 'Ana M.',
              },
            ]}
            onAmpliarFecha={() => console.log('Ampliar fecha')}
            onAmpliarPresupuesto={() => console.log('Ampliar presupuesto')}
          />

          {/* RESUMEN FINANCIERO */}
          <ResumenFinanciero
            data={[
              {
                label: 'Ingresos',
                value: 'Q92,500',
                buttonLabel: 'Registrar ingreso',
                buttonColor: 'success',
                secondaryButtonLabel: 'Ver ingresos',
                modalType: 'ingreso',
              },
              {
                label: 'Pagos',
                value: 'Q56,000',
                buttonLabel: 'Registrar pago',
                buttonColor: 'error',
                secondaryButtonLabel: 'Ver pagos',
                modalType: 'pago',
              },
              {
                label: 'Ganancia bruta',
                value: 'Q36,500',
              },
              {
                label: 'Último ingreso',
                value: '28 Mayo 2025',
                buttonLabel: 'Ver movimientos',
                buttonColor: 'info',
                modalType: 'movimientos',
              },
            ]}
          />

          {/* MODAL PARA EDITAR DATOS BÁSICOS */}
          <EditarDatosBasicosModal
            open={modalEditarAbierto}
            onClose={() => setModalEditarAbierto(false)}
            initialData={{
              nombre: datosProyecto.nombre,
              ubicacion: datosProyecto.ubicacion,
              presupuesto: datosProyecto.presupuesto,
              fechaInicio: datosProyecto.fechaInicio,
              fechaFin: datosProyecto.fechaFin,
            }}
            onConfirm={(data) => {
              setDatosProyecto(data);
              setModalEditarAbierto(false);
            }}
          />

          {/* MAQUINARIA */}
          <Maquinaria />
          {/* INGENIEROS Y ARQUITECTOS */}
          <Personal />
          {/* INVENTARIO */}
          <Inventario />
          {/* SECCIÓN DE REVISIONES */}
          <Revisiones revisiones={revisiones} />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
