import { Box, Card, Typography, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorOverlayProps {
  tipoReporte: string;
}

export const ErrorOverlay = ({ tipoReporte }: ErrorOverlayProps) => {
  const getArticleAndText = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    switch (tipoLower) {
      case 'maquinaria':
        return { article: 'la', text: 'maquinaria' };
      case 'material planificado':
        return { article: 'el', text: 'material planificado' };
      case 'orden de compra':
        return { article: 'la', text: 'orden de compra' };
      case 'rebaja':
        return { article: 'la', text: 'rebaja' };
      case 'traslado inventario':
        return { article: 'el', text: 'traslado de inventario' };
      case 'traslados material':
        return { article: 'los', text: 'traslados de material' };
      default:
        return { article: 'el', text: tipoLower };
    }
  };

  const { article, text } = getArticleAndText(tipoReporte);

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
            No pudimos encontrar {article} {text} que buscas.
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
