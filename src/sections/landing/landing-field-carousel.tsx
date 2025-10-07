import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const carouselItems = [
  {
    image: '/assets/maquinaria.png',
    title: 'Control de maquinaria y herramientas',
    description: 'Rastrea ubicación, estado y mantenimiento de todo tu equipo en tiempo real',
  },
  {
    image: '/assets/inventario.png',
    title: 'Inventario central actualizado',
    description: 'Gestiona materiales y suministros con control automático de stock',
  },
  {
    image: '/assets/foto-revision-obra.png',
    title: 'Evidencia fotográfica en campo',
    description: 'Documenta avances y supervisión con fotografías georreferenciadas',
  },
];

export const LandingFieldCarousel = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = carouselItems.length;

  // Auto-slide con loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
    }, 4500);
    return () => clearInterval(timer);
  }, [maxSteps]);

  const handleNext = () => setActiveStep((prev) => (prev + 1) % maxSteps);
  const handleBack = () => setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 12 },
        bgcolor: 'grey.50',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: { xs: '100vw', md: '85vw' },
          mx: 'auto',
          px: { xs: 1, md: 0 },
        }}
      >
        {/* Contenedor del carrusel */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ position: 'relative', height: { xs: 500, md: 700 } }}>
            {carouselItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: activeStep === index ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  pointerEvents: activeStep === index ? 'auto' : 'none',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2.2fr 0.8fr' },
                    minHeight: '100%',
                    gap: { xs: 2, md: 4 },
                    width: '100%',
                  }}
                >
                  {/* Imagen izquierda */}
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.50',
                      p: { xs: 1, md: 2 },
                      borderRadius: 3,
                      boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                      order: { xs: 1, md: 1 },
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: { xs: 320, md: 700 },
                        objectFit: 'contain',
                        borderRadius: 3,
                        display: 'block',
                      }}
                    />
                  </Box>

                  {/* Texto derecha */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: { xs: 'flex-start', md: 'center' },
                      p: { xs: 2, md: 4 },
                      bgcolor: 'background.paper',
                      order: { xs: 2, md: 2 },
                      overflowY: { xs: 'auto', md: 'visible' },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 3,
                        fontSize: { xs: '1.8rem', md: '2.4rem' },
                        lineHeight: 1.2,
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.8,
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        mb: 4,
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          fontSize: '0.9rem',
                        }}
                      >
                        Función #{index + 1} de {carouselItems.length}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Arrows + Dots centered row (all screen sizes) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 4,
            gap: 2,
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 52,
              height: 52,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>

          {/* Dots */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {carouselItems.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveStep(index)}
                sx={{
                  width: activeStep === index ? 32 : 12,
                  height: 12,
                  borderRadius: '50px',
                  bgcolor: activeStep === index ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  opacity: activeStep === index ? 1 : 0.6,
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 52,
              height: 52,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
