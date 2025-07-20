import { FC, useState } from 'react';
import { Box, Card, Grid, Typography, Button, Stack } from '@mui/material';
import { AmpliarFechaModal } from './ampliar-fecha-modal';
import { ModalAmpliacionesFecha } from './ampliaciones-fecha-modal';
import { ModalAmpliacionesPresupuesto } from './ampliaciones-presupuesto-modal';
import { ModalAmpliarPresupuesto } from './ampliar-presupuesto-modal';
import { AmpliacionPresupuesto, AmpliacionFecha } from '../index.d';
import { formatearQuetzales } from 'src/utils/format-currency';

interface TimelineProps {
  fechaInicio: string;
  fechaFin: string;
  ampliacionesFecha: AmpliacionFecha[];
  presupuestoInicial: number;
  ampliacionesPresupuesto: AmpliacionPresupuesto[];
  onAmpliarFecha: (nuevaFecha: Date, motivo: string) => Promise<void>;
  onEditarAmpliacion: (
    id: number,
    data: { nueva_fecha_estimada_fin: string; motivo: string }
  ) => Promise<void>;
  onEliminarAmpliacion: (id: number) => Promise<void>;
  onAmpliarPresupuesto: (data: { monto: number; motivo?: string }) => Promise<void>;
  onEditarAmpliacionPresupuesto: (
    id: number,
    data: { monto: number; motivo?: string }
  ) => Promise<void>;
  onEliminarAmpliacionPresupuesto: (id: number) => Promise<void>;
}

export const Timeline: FC<TimelineProps> = ({
  fechaInicio,
  fechaFin,
  ampliacionesFecha,
  presupuestoInicial,
  ampliacionesPresupuesto,
  onAmpliarFecha,
  onEditarAmpliacion,
  onEliminarAmpliacion,
  onAmpliarPresupuesto,
  onEditarAmpliacionPresupuesto,
  onEliminarAmpliacionPresupuesto,
}) => {
  const [showAmpliarFecha, setShowAmpliarFecha] = useState(false);
  const [showHistorialFechas, setShowHistorialFechas] = useState(false);
  const [showHistorialPresupuesto, setShowHistorialPresupuesto] = useState(false);
  const [showAmpliarPresupuesto, setShowAmpliarPresupuesto] = useState(false);

  const handleAmpliarFecha = async (nuevaFecha: Date, motivo: string) => {
    setShowAmpliarFecha(false);
    await onAmpliarFecha(nuevaFecha, motivo);
  };

  const handleActualizarAmpliacion = async (
    id: number,
    data: { fecha: string; motivo: string }
  ) => {
    await onEditarAmpliacion(id, {
      nueva_fecha_estimada_fin: data.fecha,
      motivo: data.motivo,
    });
  };

  const handleEliminarAmpliacion = async (id: number) => {
    await onEliminarAmpliacion(id);
    setShowHistorialFechas(false);
  };

  const handleAmpliarPresupuesto = async (data: { monto: number; motivo?: string }) => {
    setShowAmpliarPresupuesto(false);
    if (onAmpliarPresupuesto) await onAmpliarPresupuesto(data);
  };

  const handleEditarAmpliacionPresupuesto = async (
    id: number,
    data: { monto: number; motivo?: string }
  ) => {
    if (onEditarAmpliacionPresupuesto) await onEditarAmpliacionPresupuesto(id, data);
  };

  const handleEliminarAmpliacionPresupuesto = async (id: number) => {
    if (onEliminarAmpliacionPresupuesto) {
      await onEliminarAmpliacionPresupuesto(id);
      setShowHistorialPresupuesto(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Card>
          <Grid container>
            <Grid
              item
              xs={12}
              md={4}
            >
              <Stack
                alignItems="center"
                spacing={1}
                sx={{ p: 3 }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {fechaInicio}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Fecha de inicio
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <Stack
                alignItems="center"
                spacing={1}
                sx={{ p: 3 }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {fechaFin}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Fin estimada
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 3, width: '100%' }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => setShowAmpliarFecha(true)}
                  >
                    Ampliar fecha
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => setShowHistorialFechas(true)}
                  >
                    Ampliaciones
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <Stack
                alignItems="center"
                spacing={1}
                sx={{ p: 3 }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  Q{formatearQuetzales(presupuestoInicial)}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Presupuesto inicial
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 3, width: '100%' }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => setShowAmpliarPresupuesto(true)}
                  >
                    Ampliar presupuesto
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => setShowHistorialPresupuesto(true)}
                  >
                    Ampliaciones
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <AmpliarFechaModal
        open={showAmpliarFecha}
        onClose={() => setShowAmpliarFecha(false)}
        fechaActual={fechaFin}
        onSave={handleAmpliarFecha}
      />

      <ModalAmpliacionesFecha
        open={showHistorialFechas}
        onClose={() => setShowHistorialFechas(false)}
        ampliaciones={ampliacionesFecha}
        onAmpliacionActualizada={handleActualizarAmpliacion}
        onEliminarAmpliacion={handleEliminarAmpliacion}
      />

      <ModalAmpliarPresupuesto
        open={showAmpliarPresupuesto}
        onClose={() => setShowAmpliarPresupuesto(false)}
        onSave={handleAmpliarPresupuesto}
      />

      <ModalAmpliacionesPresupuesto
        open={showHistorialPresupuesto}
        onClose={() => setShowHistorialPresupuesto(false)}
        ampliaciones={ampliacionesPresupuesto}
        onEditarAmpliacion={handleEditarAmpliacionPresupuesto}
        onEliminarAmpliacion={handleEliminarAmpliacionPresupuesto}
      />
    </>
  );
};
