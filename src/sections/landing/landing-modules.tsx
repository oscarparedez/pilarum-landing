import type { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Business as ProjectIcon,
  QueryStats as ReportsIcon,
  Build as MaquinariaIcon,
} from '@mui/icons-material';

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const ModuleCard: FC<ModuleCardProps> = ({ icon, title, description, features }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(41, 112, 255, 0.15)',
          borderColor: '#2970FF',
        },
      }}
    >
      <CardContent
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '12px',
            backgroundColor: '#F5F8FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            color: '#2970FF',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1C2536',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#6C737F',
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          {features.map((feature, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                color: '#4D5761',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '"•"',
                  color: '#2970FF',
                  marginRight: 1,
                  fontWeight: 'bold',
                },
              }}
            >
              {feature}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export const LandingModules: FC = () => {
  const modules = [
    {
      icon: <InventoryIcon sx={{ fontSize: 32 }} />,
      title: 'Inventario',
      description: 'Asignación precisa de materiales por obra, sin depender de Excel.',
      features: [
        'Material asignado por proyecto',
        'Órdenes de compra',
        'Rebajas de inventario',
        'Saldos disponibles por obra',
      ],
    },
    {
      icon: <ProjectIcon sx={{ fontSize: 32 }} />,
      title: 'Proyectos',
      description: 'Rentabilidad real por obra con ingresos y costos centralizados.',
      features: [
        'Ingresos y costos por proyecto',
        'Comparativos por periodos',
        'Ejecución vs presupuesto',
        'Seguimiento de avances',
      ],
    },
    {
      icon: <ReportsIcon sx={{ fontSize: 32 }} />,
      title: 'Reportes en tiempo real',
      description: 'Gráficas y flujos financieros en tiempo real para decidir rápido.',
      features: [
        'Flujo de caja por obra en vivo',
        'Rentabilidad por proyecto y fechas',
        'Gráficas comparativas por periodo',
      ],
    },
    {
      icon: <MaquinariaIcon sx={{ fontSize: 32 }} />,
      title: 'Maquinaria',
      description: 'Control de costos de maquinaria en servicios y consumos.',
      features: [
        'Costos por equipo y obra',
        'Servicios y consumos',
        'Gastos de combustible',
        'Mantenimiento preventivo',
      ],
    },
  ];

  return (
    <Box
      sx={{
        py: 12,
        backgroundColor: '#F8F9FA',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.25rem' },
              fontWeight: 800,
              color: '#1C2536',
              mb: 3,
            }}
          >
            Módulos principales
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.375rem' },
              fontWeight: 400,
              color: '#6C737F',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Pensado para constructoras que hoy trabajan en Excel o sin control centralizado.
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
        >
          {modules.map((module, index) => (
            <Grid
              key={index}
              item
              xs={12}
              md={6}
              lg={3}
            >
              <ModuleCard {...module} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
