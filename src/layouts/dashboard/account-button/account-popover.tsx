import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import LogOut01Icon from '@untitled-ui/icons-react/build/esm/LogOut01';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { Issuer } from 'src/utils/auth';

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const auth = useAuth();
  const user = auth.user;

  const userInitials = useMemo(() => {
    const first = user?.first_name?.charAt(0)?.toUpperCase() || '';
    const last = user?.last_name?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U';
  }, [user?.first_name, user?.last_name]);

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      onClose?.();

      switch (auth.issuer) {
        case Issuer.JWT: {
          await auth.signOut();
          break;
        }

        default: {
          console.warn('Using an unknown Auth Issuer, did not log out');
        }
      }

      router.push(paths.index);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, [auth, router, onClose]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      PaperProps={{
        sx: {
          width: 320,
          mt: 1.5,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      {...other}
    >
      {/* User Profile Section */}
      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
              width: 48,
              height: 48,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'white',
            }}
          >
            {userInitials}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : 'Usuario'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                mb: 1,
                wordBreak: 'break-word',
              }}
            >
              @{user?.username || 'username'}
            </Typography>
            {user?.groups?.[0]?.name && (
              <Chip
                label={user.groups[0].name}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Logout Section */}
      <Box sx={{ p: 3, pt: 2 }}>
        <Button
          fullWidth
          variant="text"
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'none',
            color: 'error.main',
            borderRadius: 2,
            border: 'none',
            bgcolor: 'transparent',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: 'error.50',
              color: 'error.dark',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          }}
          startIcon={
            <SvgIcon
              fontSize="small"
              sx={{
                color: 'inherit',
                transition: 'transform 0.2s ease-in-out',
                '.MuiButton-root:hover &': {
                  transform: 'translateX(2px)',
                },
              }}
            >
              <LogOut01Icon />
            </SvgIcon>
          }
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
