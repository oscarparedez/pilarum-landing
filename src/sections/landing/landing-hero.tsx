import type { FC } from 'react';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import {
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  Build as MaquinariaIcon,
  Assignment as RevisionIcon,
} from '@mui/icons-material';

export const LandingHero: FC = () => {

  const handleWhatsAppContact = () => {
    const message = 'Hola! Me interesa Pilarum para mis proyectos industriales';
    const phoneNumber = '50254331544'; // Cambia por tu número (código país + número sin +)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
                  fontSize: { xs: '2.8rem', md: '3.8rem' },
                  fontWeight: 800,
                  color: '#1C2536',
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                ¿Cansado de{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#DC2626',
                  }}
                >
                  perder dinero
                </Box>{' '}
                en tus obras?
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 600,
                  color: '#374151',
                  mb: 3,
                  lineHeight: 1.4,
                }}
              >
                El 73% de proyectos industriales se exceden en costos por falta de control
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  fontWeight: 400,
                  color: '#6B7280',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Termina con los sobrecostos, retrasos y el caos operativo. Controla todos los
                costos, tiempos y recursos de tus proyectos industriales desde una sola plataforma.
              </Typography>

              <Stack
                spacing={1}
                sx={{
                  mb: 4,
                  alignItems: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleWhatsAppContact}
                    sx={{
                      backgroundColor: '#25D366',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: '0 4px 14px 0 rgba(37, 211, 102, 0.39)',
                      '&:hover': {
                        backgroundColor: '#1DA851',
                        boxShadow: '0 6px 20px 0 rgba(37, 211, 102, 0.5)',
                      },
                    }}
                  >
                    Consultar por WhatsApp →
                  </Button>
                  <Button
                    component={Link}
                    href="/pricing"
                    variant="contained"
                    size="large"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                    }}
                  >
                    Ver planes y precios
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2563EB',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Plataformas con descuento de lanzamiento (hasta 11% OFF)
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: '#9CA3AF',
                  fontSize: '1.2rem',
                }}
              >
                ✓ Soporte 24/7 • ✓ Resultados inmediatos
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
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    p: 3,
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#1C2536',
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Control total en tiempo real
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
