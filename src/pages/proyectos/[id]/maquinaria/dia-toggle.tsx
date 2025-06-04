import { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface DiaToggleProps {
  dia: string;
  selected: boolean;
  onClick: () => void;
}

export const DiaToggle: FC<DiaToggleProps> = ({ dia, selected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: '50%',
        width: 45,
        height: 45,
        m: 2,
        bgcolor: selected ? 'primary.main' : 'grey.300',
        color: selected ? 'common.white' : 'text.primary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.2s',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <Typography variant="body2" fontWeight="bold">
      {dia.slice(0, 3)}
      </Typography>
    </Box>
  );
};
