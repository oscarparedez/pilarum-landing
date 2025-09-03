import type { FC } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

export const LandingFinances: FC = () => {
  return (
    <Box
      sx={{
        py: 12,
        backgroundColor: '#fff',
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={6}
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.25rem' },
                fontWeight: 800,
                color: '#1C2536',
                mb: 3,
              }}
            >
              Control financiero{' '}
              <Box
                component="span"
                sx={{
                  color: '#2970FF',
                }}
              >
                inteligente
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.375rem' },
                fontWeight: 400,
                color: '#6C737F',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Reportes flexibles de ingresos y costos por proyecto.
              Filtra por fechas, socio, tipo de ingreso o costo según necesites.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    backgroundColor: '#F5F8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2970FF',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#1C2536',
                  }}
                >
                  Reportes filtrados por proyecto y fechas
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    backgroundColor: '#F5F8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2970FF',
                  }}
                >
                  <AnalyticsIcon />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#1C2536',
                  }}
                >
                  Clasificación por tipo de ingreso y costo
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    backgroundColor: '#F5F8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2970FF',
                  }}
                >
                  <AccountBalanceIcon />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#1C2536',
                  }}
                >
                  Análisis por socio y área de trabajo
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                overflow: 'hidden',
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, #2970FF 0%, #004EEB 100%)',
                  color: '#fff',
                  position: 'relative',
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {/* Logo como fondo sutil */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 120,
                    height: 120,
                    opacity: 0.1,
                    backgroundImage: 'url(/assets/logo.svg)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    zIndex: 1,
                  }}
                >
                  Reportes Flexibles
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.125rem',
                    opacity: 0.9,
                    zIndex: 1,
                  }}
                >
                  Filtra y analiza tus datos financieros 
                  exactamente como necesitas.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
