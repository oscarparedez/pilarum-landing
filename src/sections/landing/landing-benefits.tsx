import type { FC } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  TrendingUp as OptimizationIcon,
} from '@mui/icons-material';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <Card
      sx={{
        height: '100%',
        border: 'none',
        borderRadius: '16px',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        textAlign: 'center',
      }}
    >
      <CardContent
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
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
            lineHeight: 1.6,
            fontSize: '1.125rem',
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const LandingBenefits: FC = () => {
  const benefits = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Intuitivo y fácil de usar',
      description: 'Interface diseñada para arquitectos e ingenieros. Sin curva de aprendizaje compleja.',
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
      title: 'Visión centralizada',
      description: 'Todos tus recursos, proyectos y finanzas en una sola plataforma integrada.',
    },
    {
      icon: <OptimizationIcon sx={{ fontSize: 40 }} />,
      title: 'Optimización garantizada',
      description: 'Reduce tiempos operativos y controla costos con análisis automatizados.',
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
            Beneficios clave
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
            Diseñado específicamente para profesionales de la construcción
            que buscan eficiencia y control total.
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
        >
          {benefits.map((benefit, index) => (
            <Grid
              key={index}
              item
              xs={12}
              md={4}
            >
              <BenefitCard {...benefit} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
