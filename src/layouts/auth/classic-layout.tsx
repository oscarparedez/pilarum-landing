import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';

import { Logo } from 'src/components/logo';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

const TOP_NAV_HEIGHT = 64;

const LayoutRoot = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '30%',
    height: '40%',
    background: `radial-gradient(ellipse, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: '25%',
    height: '35%',
    background: `radial-gradient(ellipse, ${alpha(theme.palette.neutral[400], 0.02)} 0%, transparent 70%)`,
    borderRadius: '50%',
  },
}));

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <LayoutRoot>
      {/* Header */}
      <Box
        component="header"
        sx={{
          position: 'relative',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          backgroundColor: theme => alpha(theme.palette.background.paper, 0.8),
          borderBottom: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={2}
            sx={{ 
              height: TOP_NAV_HEIGHT,
              alignItems: 'center',
            }}
          >
            <Stack
              alignItems="center"
              component={RouterLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              spacing={1.5}
              sx={{ 
                textDecoration: 'none',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  height: 36,
                  width: 36,
                  borderRadius: 1.5,
                  background: theme => `linear-gradient(135deg, ${theme.palette.neutral[800]} 0%, ${theme.palette.neutral[600]} 100%)`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Logo />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                }}
              >
                Pilarum
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          position: 'relative',
          zIndex: 1,
          px: 2,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: 4,
              sm: 6,
              md: 8,
            },
          }}
        >
          {children}
        </Container>
      </Box>
    </LayoutRoot>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
