import { FC, useState } from 'react';
import { Box, Card, Grid, Typography, Button, Stack } from '@mui/material';
import { AmpliarFechaModal } from './ampliar-fecha-modal';
import { ModalAmpliacionesPresupuesto } from './ampliaciones-presupuesto-modal';
import { ModalAmpliarPresupuesto } from './ampliar-presupuesto-modal';
import { AmpliacionPresupuesto, AmpliacionFecha } from 'src/api/types';
import { formatearQuetzales } from 'src/utils/format-currency';
import { formatearFecha } from 'src/utils/format-date';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { AmpliacionesFechaModal } from 'src/sections/proyectos/timeline-ampliaciones/ampliaciones-fecha-modal';

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

  const canViewPresupuestoInicial = useHasPermission(PermissionId.VER_PRESUPUESTO_INICIAL);
  const canAmpliarPresupuesto = useHasPermission(PermissionId.AMPLIAR_PRESUPUESTO_INICIAL);
  const canViewAmpliacionesPresupuesto = useHasPermission(
    PermissionId.VER_AMPLIACIONES_PRESUPUESTO
  );
  const canViewFechaFin = useHasPermission(PermissionId.VER_FECHA_FIN);
  const canAmpliarFechaFin = useHasPermission(PermissionId.AMPLIAR_FECHA_FIN);
  const canViewAmpliacionesFechaFin = useHasPermission(PermissionId.VER_AMPLIACIONES_FECHA_FIN);

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
                  {formatearFecha(fechaInicio)}
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
                  {canViewFechaFin ? formatearFecha(fechaFin) : '** *** ****'}
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
                  {canAmpliarFechaFin && (
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={() => setShowAmpliarFecha(true)}
                    >
                      Ampliar fecha
                    </Button>
                  )}
                  {canViewAmpliacionesFechaFin && (
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => setShowHistorialFechas(true)}
                    >
                      Ampliaciones
                    </Button>
                  )}
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
                  {canViewPresupuestoInicial
                    ? formatearQuetzales(presupuestoInicial)
                    : 'GTQ *******'}
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
                  {canAmpliarPresupuesto && (
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={() => setShowAmpliarPresupuesto(true)}
                    >
                      Ampliar presupuesto
                    </Button>
                  )}
                  {canViewAmpliacionesPresupuesto && (
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => setShowHistorialPresupuesto(true)}
                    >
                      Ampliaciones
                    </Button>
                  )}
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

      <AmpliacionesFechaModal
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
