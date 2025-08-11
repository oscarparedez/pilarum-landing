import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { PizarronPendientes } from 'src/components/pendientes/pizarron-pendientes';

const Page: NextPage = () => {
  const settings = useSettings();
  usePageView();

  return (
    <>
      <Seo title="Dashboard: Pizarrón" />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid container disableEqualOverflow spacing={{ xs: 3, lg: 4 }}>
            <Grid xs={12}>
              <PizarronPendientes tipo="oficina" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
