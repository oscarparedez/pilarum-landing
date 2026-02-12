import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

type PricingPlan = {
  id: string;
  name: string;
  subtitle: string;
  usersLimit: number;
  monthlyPrice: number;
  launchPrice: number;
  features: string[];
  highlight?: boolean;
  tag?: string;
  discountLabel?: string;
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '502XXXXXXXX';

const priceFormatter = new Intl.NumberFormat('es-GT', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatQuetzal = (value: number) => `Q${priceFormatter.format(value)}`;

export const openWhatsApp = (planName: string, usersLimit: number, launchPrice: number) => {
  const message = `Hola, quiero información del plan ${planName} de Pilarum (hasta ${usersLimit} usuarios). Estoy revisando el precio de lanzamiento ${formatQuetzal(
    launchPrice
  )}. ¿Me puedes cotizar y explicar el proceso?`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (typeof window === 'undefined') {
    return;
  }

  window.open(url, '_blank');
};

const sharedFeatures = [
  'Control financiero por proyecto',
  'Materiales y movimientos sin desorden',
  'Reportes claros para decisiones rápidas',
];

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'Hasta 3 usuarios',
    usersLimit: 3,
    monthlyPrice: 2400,
    launchPrice: 2190,
    features: sharedFeatures,
  },
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'Hasta 6 usuarios',
    usersLimit: 6,
    monthlyPrice: 4000,
    launchPrice: 3590,
    highlight: true,
    tag: 'Ideal',
    discountLabel: 'Ahorras 10%',
    features: sharedFeatures,
  },
  {
    id: 'business',
    name: 'Business',
    subtitle: 'Hasta 10 usuarios',
    usersLimit: 10,
    monthlyPrice: 5400,
    launchPrice: 4790,
    discountLabel: 'Ahorras 11%',
    features: sharedFeatures,
  },
];

export const PricingSection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        py: 4,
        background: 'linear-gradient(180deg, #fdfdfd 0%, #f7f9fc 100%)',
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        <Stack
          spacing={1}
          alignItems="center"
          textAlign="center"
          mb={6}
        >
          <Typography
            variant="overline"
            fontSize={16}
            color="primary"
            sx={{ letterSpacing: '0.3em' }}
          >
            Planes Pilarum
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            sx={{ maxWidth: 520 }}
          >
            La misma plataforma, solo más usuarios
          </Typography>
          <Typography
            variant="body1"
            fontSize={16}
            color="text.secondary"
            sx={{ maxWidth: 520 }}
          >
            Mismas capacidades premium. Cambia de plan solo cuando necesites más usuarios.
          </Typography>
        </Stack>

        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          alignItems="stretch"
          justifyContent={{ xs: 'center', md: 'flex-start' }}
        >
          {pricingPlans.map((plan) => {
            const isProfessional = plan.highlight;

            return (
              <Grid
                item
                xs={12}
                md={4}
                key={plan.id}
                sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Card
                  component="article"
                  elevation={0}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    borderRadius: 3,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: isProfessional ? 'primary.main' : 'divider',
                    backgroundColor: '#fff',
                    boxShadow: isProfessional ? theme.shadows[5] : 'none',
                    transform: isProfessional ? { xs: 'none', md: 'translateY(-12px)' } : 'none',
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                    width: '100%',
                    maxWidth: { xs: 360, md: 'none' },
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      flexGrow: 1,
                    }}
                  >
                    {(plan.tag || plan.discountLabel) && (
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                      >
                        {plan.tag && (
                          <Chip
                            label={plan.tag}
                            size="small"
                            color="primary"
                            sx={{ textTransform: 'none' }}
                          />
                        )}
                        {plan.discountLabel && (
                          <Chip
                            label={plan.discountLabel}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ textTransform: 'none', borderWidth: 1.5 }}
                          />
                        )}
                      </Stack>
                    )}

                    <Stack spacing={0.25}>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                      >
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {plan.subtitle}
                      </Typography>
                    </Stack>

                    <Stack spacing={0.5}>
                      <Box
                        display="flex"
                        alignItems="baseline"
                        gap={1}
                      >
                        <Typography
                          variant="h3"
                          component="span"
                          fontWeight={700}
                        >
                          {formatQuetzal(plan.launchPrice)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          / mes
                        </Typography>
                      </Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        flexWrap="wrap"
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            textDecoration: 'line-through',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {formatQuetzal(plan.monthlyPrice)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
                        >
                          Precio regular
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        Precio de lanzamiento por tiempo limitado
                      </Typography>
                    </Stack>

                    <Stack
                      component="ul"
                      spacing={1.5}
                      mt={1}
                      sx={{ listStyle: 'none', margin: 0, padding: 0 }}
                    >
                      {plan.features.map((feature) => (
                        <Typography
                          component="li"
                          key={feature}
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              display: 'inline-flex',
                            }}
                          />
                          {feature}
                        </Typography>
                      ))}
                    </Stack>

                    <Box mt="auto">
                      <Button
                        fullWidth
                        size="large"
                        variant={isProfessional ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => openWhatsApp(plan.name, plan.usersLimit, plan.launchPrice)}
                        aria-label={`Contactar por WhatsApp el plan ${plan.name}`}
                        sx={{ textTransform: 'none' }}
                      >
                        Cotizar por WhatsApp
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="text.secondary"
          mt={4}
        >
          Precios en Quetzales (GTQ). Precio de lanzamiento por tiempo limitado.
        </Typography>
      </Container>
    </Box>
  );
};
