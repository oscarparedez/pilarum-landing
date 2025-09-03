import type { FC, ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { Seo } from 'src/components/seo';
import { LandingHeader } from './landing-header';
import { LandingFooter } from '../../sections/landing/landing-footer';

interface LandingLayoutProps {
  children: ReactNode;
}

export const LandingLayout: FC<LandingLayoutProps> = ({ children }) => {
  return (
    <>
      <Seo title="Pilarum - Control total de tus proyectos de construcción" />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#fff',
        }}
      >
        <LandingHeader />
        <Box component="main">
          {children}
        </Box>
        <LandingFooter />
      </Box>
    </>
  );
};
