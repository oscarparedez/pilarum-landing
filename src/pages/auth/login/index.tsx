import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
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
  const { signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (values: Values, helpers: any) => {
    try {
      setErrorMessage(null);
      await signIn(values.username, values.password);
      router.replace(paths.dashboard.inicio);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err.message });
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSignIn,
  });

  return (
    <>
      <Seo title="Iniciar Sesión | Pilarum" />
      <Fade
        in
        timeout={600}
      >
        <Card
          elevation={0}
          sx={{
            background: (theme) => theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {formik.isSubmitting && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
              }}
            />
          )}

          <CardHeader
            sx={{
              pb: 2,
              pt: 4,
              px: 4,
              textAlign: 'center',
            }}
            title={
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 0.5,
                }}
              >
                Bienvenido
              </Typography>
            }
            subheader={
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '0.95rem' }}
              >
                Inicia sesión en tu cuenta
              </Typography>
            }
          />

          <CardContent sx={{ px: 4, pb: 4 }}>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                {errorMessage && (
                  <Fade in>
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 1.5,
                        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.05),
                        border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        '& .MuiAlert-message': {
                          fontSize: '0.875rem',
                        },
                      }}
                    >
                      {errorMessage}
                    </Alert>
                  </Fade>
                )}

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
                  disabled={formik.isSubmitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: (theme) => theme.palette.neutral[400],
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  }}
                />

                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Contraseña"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  disabled={formik.isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          disabled={formik.isSubmitting}
                          sx={{
                            color: (theme) => theme.palette.neutral[500],
                            '&:hover': {
                              color: (theme) => theme.palette.neutral[700],
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: (theme) => theme.palette.neutral[400],
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  }}
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                  startIcon={<LoginIcon />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 1.5,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: (theme) => theme.palette.primary.main,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.primary.dark,
                      transform: 'translateY(-1px)',
                      boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: (theme) => theme.palette.neutral[200],
                      color: (theme) => theme.palette.neutral[500],
                    },
                  }}
                >
                  {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
