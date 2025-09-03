import type { FC } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { Logo } from 'src/components/logo';

export const LandingHeader: FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push(paths.auth.login);
  };

  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            height: 80,
            py: 2,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                mr: 2,
                height: 40,
                width: 40,
              }}
            >
              <Logo />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#1C2536',
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
              Pilarum
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: '#2970FF',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#004EEB',
              },
            }}
          >
            Iniciar sesión
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
