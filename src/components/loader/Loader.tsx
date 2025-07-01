// src/components/loaders/FullPageLoader.tsx
import { Box, CircularProgress } from '@mui/material';

export const FullPageLoader = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      bgcolor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(2px)',
      zIndex: 1300, // por encima del layout y modales normales
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);
