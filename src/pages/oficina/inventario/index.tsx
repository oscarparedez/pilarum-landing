import {
  Box,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { NextPage } from 'next';
import { Inventario } from 'src/sections/oficina/inventario/inventario';

const Page: NextPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* INVENTARIO */}
      <Inventario />
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
