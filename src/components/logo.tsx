import type { FC } from 'react';
import { Box } from '@mui/material';
import logo from 'public/assets/logo.png'; // Ajusta ruta

export const Logo: FC = () => {
  return (
    <img
      src={typeof logo === 'string' ? logo : logo.src}
      alt="Pilarum logo"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
};
