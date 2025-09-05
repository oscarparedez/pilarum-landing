import { Box, Card, Typography, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorOverlayProps {
  tipoReporte: string;
}

export const ErrorOverlay = ({ tipoReporte }: ErrorOverlayProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <Card
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: 3,
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 48,
              color: 'error.main',
            }}
          />
          <Typography
            variant="h6"
            color="error"
          >
            {tipoReporte} no encontrado
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No pudimos encontrar el {tipoReporte.toLowerCase()} que buscas.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Puede que no exista o haya sido eliminado.
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};
