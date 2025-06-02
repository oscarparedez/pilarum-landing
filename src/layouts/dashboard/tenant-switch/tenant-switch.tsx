import type { FC } from 'react';
import PropTypes from 'prop-types';
import type { SxProps } from '@mui/system/styleFunctionSx';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
interface TenantSwitchProps {
  sx?: SxProps;
}

export const TenantSwitch: FC<TenantSwitchProps> = (props) => {
  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        {...props}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="inherit"
            variant="h5"
          >
            Pilarum
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

TenantSwitch.propTypes = {
  sx: PropTypes.object,
};
