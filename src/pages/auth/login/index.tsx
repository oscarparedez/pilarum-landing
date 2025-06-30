import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

import { Seo } from 'src/components/seo';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';

interface Values {
  username: string;
  password: string;
  submit: null;
}

const initialValues: Values = {
  username: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  username: Yup.string().max(150).required('El usuario es requerido'),
  password: Yup.string().max(255).required('La contraseña es requerida'),
});

const Page: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (values: Values, helpers: any) => {
    try {
      await signIn(values.username, values.password);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err.message });
      helpers.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(paths.dashboard.inicio);
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSignIn,
  });

  return (
    <>
      <Seo title="Login" />
      <div>
        <Card elevation={16}>
          <CardHeader sx={{ pb: 0 }} title="Inicio de sesión" />
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Usuario"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Contraseña"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" variant="contained">
                Continuar
              </Button>
              {errorMessage && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                </Box>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
