import type { FC } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import {
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  Build as MaquinariaIcon,
  Assignment as RevisionIcon,
} from '@mui/icons-material';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';

export const LandingHero: FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push(paths.auth.login);
  };

  return (
    <Box
      sx={{
        py: 12,
        backgroundColor: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={4}
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4rem' },
                  fontWeight: 800,
                  color: '#1C2536',
                  lineHeight: 1.1,
                  mb: 4,
                }}
              >
                Control total de tus{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#2970FF',
                  }}
                >
                  proyectos de construcción
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: 400,
                  color: '#6C737F',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Gestiona proyectos industriales, inventario, personal, maquinaria y finanzas en una sola plataforma.
                Optimiza tiempos, reduce costos y maximiza la eficiencia de tus obras.
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 400,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                }}
              >
                {/* Iconos flotantes animados */}
                <Box
                  className="float-animation"
                  sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '15%',
                    width: 64,
                    height: 64,
                    borderRadius: '12px',
                    backgroundColor: '#2970FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <FinanceIcon sx={{ fontSize: 32 }} />
                </Box>
                
                <Box
                  className="float-animation-delay-1"
                  sx={{
                    position: 'absolute',
                    top: '15%',
                    right: '20%',
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    backgroundColor: '#16B364',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 28 }} />
                </Box>
                
                <Box
                  className="float-animation-delay-2"
                  sx={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '20%',
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    backgroundColor: '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <MaquinariaIcon sx={{ fontSize: 30 }} />
                </Box>
                
                <Box
                  className="float-animation-delay-3"
                  sx={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                    width: 52,
                    height: 52,
                    borderRadius: '12px',
                    backgroundColor: '#DC6803',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <RevisionIcon sx={{ fontSize: 26 }} />
                </Box>

                {/* Texto central */}
                <Box
                  sx={{
                    textAlign: 'center',
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#1C2536',
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Tu obra en tiempo real
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6C737F',
                      fontWeight: 500,
                    }}
                  >
                    Desde tu computadora o celular
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
