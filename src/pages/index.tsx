import { LandingLayout } from 'src/layouts/landing';
import {
  LandingHero,
  LandingAdminCarousel,
  LandingFieldCarousel,
  LandingModules,
  LandingFinances,
  LandingBenefits,
  LandingCta,
} from 'src/sections/landing';

const IndexPage = () => {
  return (
    <LandingLayout>
      <LandingHero />
      
      {/* 🧾 Carrusel 1 — Gestión administrativa */}
      <LandingAdminCarousel />

      {/* 🏗️ Carrusel 2 — Control en campo */}
      <LandingFieldCarousel />

      {/* Secciones existentes */}
      <LandingModules />
      <LandingFinances />
      <LandingBenefits />
      <LandingCta />
    </LandingLayout>
  );
};

export default IndexPage;
