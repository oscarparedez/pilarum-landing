import { FC } from 'react';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/pages/oficina/roles/permissions';
import { formatearQuetzales } from 'src/utils/format-currency';

interface EstadisticasRapidasProps {
  costo: number;
  totalServicios: number;
  totalCombustibleUltimoMes: number;
}

export const EstadisticasRapidas: FC<EstadisticasRapidasProps> = ({
  costo,
  totalServicios,
  totalCombustibleUltimoMes,
}) => {
  const canViewCostosAdquisicion = useHasPermission(PermissionId.VER_COSTO_ADQ_MAQUINARIA);
  const canViewTotalServicios = useHasPermission(PermissionId.VER_TOTAL_SERVICIOS);
  const canViewCombustibleUltimoMes = useHasPermission(PermissionId.VER_COMBUSTIBLE_ULTIMO_MES);
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Grid
          container
          sx={{
            '& > *:not(:last-of-type)': {
              borderRight: (theme) => ({
                sm: `1px solid ${theme.palette.divider}`,
              }),
              borderBottom: (theme) => ({
                xs: `1px solid ${theme.palette.divider}`,
                sm: 'none',
              }),
            },
          }}
        >
          <Grid
            xs={12}
            sm={4}
          >
            <Stack
              alignItems="center"
              spacing={1}
              sx={{ p: 3 }}
            >
              <Typography variant="h5">
                {canViewCostosAdquisicion ? formatearQuetzales(Number(costo)) : 'GTQ ***,***.**'}
              </Typography>
              <Typography
                color="text.secondary"
                variant="overline"
              >
                Costo de adquisición
              </Typography>
            </Stack>
          </Grid>
          <Grid
            xs={12}
            sm={4}
          >
            <Stack
              alignItems="center"
              spacing={1}
              sx={{ p: 3 }}
            >
              <Typography variant="h5">
                {canViewTotalServicios
                  ? formatearQuetzales(Number(totalServicios))
                  : 'GTQ ***,***.**'}
              </Typography>
              <Typography
                color="text.secondary"
                variant="overline"
              >
                Total en servicios
              </Typography>
            </Stack>
          </Grid>
          <Grid
            xs={12}
            sm={4}
          >
            <Stack
              alignItems="center"
              spacing={1}
              sx={{ p: 3 }}
            >
              <Typography variant="h5">
                {canViewCombustibleUltimoMes
                  ? formatearQuetzales(Number(totalCombustibleUltimoMes))
                  : 'GTQ ***,***.**'}
              </Typography>
              <Typography
                color="text.secondary"
                variant="overline"
              >
                Combustible último mes
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
