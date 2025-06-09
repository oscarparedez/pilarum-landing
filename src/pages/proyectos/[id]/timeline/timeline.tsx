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
  onAmpliarFecha?: () => void;
  onAmpliarPresupuesto?: () => void;
}

export const Timeline: FC<TimelineProps> = ({
  fechaInicio,
  fechaFin,
  ampliacionesFecha,
  presupuestoInicial,
  ampliacionesPresupuesto,
}) => {
  // Modales independientes
  const [showAmpliarFecha, setShowAmpliarFecha] = useState(false);
  const [showHistorialFechas, setShowHistorialFechas] = useState(false);
  const [showHistorialPresupuesto, setShowHistorialPresupuesto] = useState(false);
  const [showAmpliarPresupuesto, setShowAmpliarPresupuesto] = useState(false);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Card>
          <Grid
            container
            sx={{
              '& > *:not(:last-of-type)': {
                borderRight: (theme) => ({
                  md: `1px solid ${theme.palette.divider}`,
                }),
                borderBottom: (theme) => ({
                  xs: `1px solid ${theme.palette.divider}`,
                  md: 'none',
                }),
              },
            }}
          >
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

            {/* PRESUPUESTO */}
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
                  {formatearQuetzales(presupuestoInicial)}
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

      {/* MODAL: Ampliar Fecha */}
      <AmpliarFechaModal
        open={showAmpliarFecha}
        onClose={() => setShowAmpliarFecha(false)}
        fechaActual={fechaFin}
      />

      {/* MODAL: Historial Fechas */}
      <ModalAmpliacionesFecha
        open={showHistorialFechas}
        onClose={() => setShowHistorialFechas(false)}
        ampliaciones={ampliacionesFecha}
      />

      {/* MODAL: Ampliar Presupuesto */}
      <ModalAmpliarPresupuesto
        open={showAmpliarPresupuesto}
        onClose={() => setShowAmpliarPresupuesto(false)}
      />

      {/* MODAL: Historial Presupuesto */}
      <ModalAmpliacionesPresupuesto
        open={showHistorialPresupuesto}
        onClose={() => setShowHistorialPresupuesto(false)}
        ampliaciones={ampliacionesPresupuesto}
      />
    </>
  );
};
