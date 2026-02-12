import type { FC } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

export const LandingCta: FC = () => {

  return (
    <Box
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #2970FF 0%, #004EEB 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logo sutil como fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200,
          height: 200,
          opacity: 0.05,
          backgroundImage: 'url(/assets/logo.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              color: '#fff',
              mb: 4,
              lineHeight: 1.2,
            }}
          >
            Recupera el control{' '}
            <Box
              component="span"
              sx={{
                color: '#EBEFFF',
              }}
            >
              de tus obras
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Material por obra, rentabilidad real y costos centralizados en una sola plataforma.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
