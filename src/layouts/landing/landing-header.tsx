import type { FC } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { Logo } from 'src/components/logo';

export const LandingHeader: FC = () => {
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};
