import { useEffect } from 'react';
import { useRouter } from 'src/hooks/use-router';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import { LandingLayout } from 'src/layouts/landing';
import {
  LandingHero,
  LandingModules,
  LandingFinances,
  LandingBenefits,
  LandingCta,
} from 'src/sections/landing';

const IndexPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    // Solo redirigir después de que la autenticación esté inicializada
    if (isInitialized && isAuthenticated) {
      router.replace(paths.dashboard.inicio);
    }
  }, [isAuthenticated, isInitialized, router]);

  // Si el usuario está autenticado, no mostrar la landing
  if (isInitialized && isAuthenticated) {
    return null;
  }

  // Si aún no está inicializado, mostrar la landing (evita flickers)
  return (
    <LandingLayout>
      <LandingHero />
      <LandingModules />
      <LandingFinances />
      <LandingBenefits />
      <LandingCta />
    </LandingLayout>
  );
};

export default IndexPage;
