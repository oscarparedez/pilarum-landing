import type { NextPage } from 'next';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Timeline } from './timeline/timeline';
import { ResumenFinanciero } from './resumen-financiero/resumen-financiero';
import { Revisiones } from './revisiones/revisiones';
import { Inventario } from './inventario/inventario';
import { Maquinaria } from './maquinaria/maquinaria';

const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();

  const proyecto = {
    nombre: 'Residencial Aurora',
    ubicacion: 'Zona 16, Guatemala',
    fecha_inicio: '2024-01-10',
    fecha_fin: '2024-10-15',
    actualizado_el: '2025-06-01',
    creado_por: 'Luis G.',
  };

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  const openModalWithImages = (images: string[]) => {
    setModalImages(images);
    setImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageIndex(0);
  };

  const handleNext = () => {
    setImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const handlePrev = () => {
    setImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 8 }}
    >
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Stack spacing={4}>
          {/* ENCABEZADO */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h4">{proyecto.nombre}</Typography>
              <Typography color="text.secondary">
                Última modificación por {proyecto.creado_por} el {proyecto.actualizado_el}
              </Typography>
            </Box>
            <Button variant="outlined">Editar datos básicos</Button>
          </Stack>
          {/* TIMELINE */}

          <Timeline
            fechaInicio="2024-01-10"
            fechaFin="2024-10-15"
            ampliacionesFecha={[
              { fecha: '2025-08-10', motivo: 'Demora por clima', usuario: 'Luis G.' },
              { fecha: '2025-09-02', motivo: 'Cambio de planos', usuario: 'Ana M.' },
            ]}
            presupuestoInicial="Q100,000"
            ampliacionesPresupuesto={[
              {
                fecha: '2024-03-10',
                motivo: 'Compra de herramienta adicional',
                monto: 'Q15,000',
                usuario: 'Luis G.',
              },
              {
                fecha: '2024-06-22',
                motivo: 'Costo extra de concreto',
                monto: 'Q8,500',
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
          {/* MAQUINARIA */}
          <Maquinaria />
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
