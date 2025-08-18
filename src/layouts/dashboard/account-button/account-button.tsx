import type { FC } from 'react';
import { useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { useAuth } from 'src/hooks/use-auth';
import { usePopover } from 'src/hooks/use-popover';

import { AccountPopover } from './account-popover';

export const AccountButton: FC = () => {
  const auth = useAuth();
  const user = auth.user;
  const popover = usePopover<HTMLButtonElement>();

  const userInitials = useMemo(() => {
    const first = user?.first_name?.charAt(0)?.toUpperCase() || '';
    const last = user?.last_name?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U';
  }, [user?.first_name, user?.last_name]);

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'divider',
          height: 48,
          width: 48,
          borderRadius: '50%',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40,
            background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'white',
          }}
        >
          {userInitials}
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
