import type { NextPage } from 'next';
import { Container, Typography, Stack, Box } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { CrearProyectoForm } from './form';

const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();

  return (
    <>
      <Seo title="Crear nuevo proyecto" />
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth={settings.stretch ? false : 'md'}>
          <Stack spacing={4}>
            <Typography variant="h4">Crear nuevo proyecto</Typography>
            <CrearProyectoForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
