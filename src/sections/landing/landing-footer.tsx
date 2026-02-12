import type { FC } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
} from '@mui/material';
import { Logo } from 'src/components/logo';

export const LandingFooter: FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1C2536',
        pt: 6,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 3, md: 0 },
            }}
          >
            <Box
              sx={{
                height: 40,
                width: 40,
                mr: 2,
              }}
            >
              <Logo />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
              Pilarum
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: '#9DA4AE',
              textAlign: { xs: 'center', md: 'right' },
            }}
          >
            Plataforma de gestión de constructoras
          </Typography>
        </Box>
        <Divider
          sx={{
            borderColor: '#2F3746',
            mb: 3,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: '#6C737F',
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} Pilarum. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};
