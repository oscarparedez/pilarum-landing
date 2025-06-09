import { FC } from 'react';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

interface EstadisticasRapidasProps {
  costo: number;
  totalServicios: number;
  totalCombustibleUltimoMes: number;
}

export const EstadisticasRapidas: FC<EstadisticasRapidasProps> = ({
  costo,
  totalServicios,
  totalCombustibleUltimoMes,
}) => (
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
        <Grid xs={12} sm={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography variant="h5">Q{costo.toLocaleString()}</Typography>
            <Typography color="text.secondary" variant="overline">Costo de adquisición</Typography>
          </Stack>
        </Grid>
        <Grid xs={12} sm={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography variant="h5">Q{totalServicios.toLocaleString()}</Typography>
            <Typography color="text.secondary" variant="overline">Total en servicios</Typography>
          </Stack>
        </Grid>
        <Grid xs={12} sm={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography variant="h5">Q{totalCombustibleUltimoMes.toLocaleString()}</Typography>
            <Typography color="text.secondary" variant="overline">Combustible último mes</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  </Box>
);
