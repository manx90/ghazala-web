import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LandingNav } from '@/features/landing/components/landing-nav';
import { HeroSection } from '@/features/landing/components/hero-section';
import { TrustedBy } from '@/features/landing/components/trusted-by';
import { FeaturesGrid } from '@/features/landing/components/features-grid';
import { ProductShowcase } from '@/features/landing/components/product-showcase';
import { SplitFeatures } from '@/features/landing/components/split-feature';
import { PricingCta } from '@/features/landing/components/pricing-cta';
import { FaqSection } from '@/features/landing/components/faq-section';
import { LandingFooter } from '@/features/landing/components/landing-footer';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('landing.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <LandingNav />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <TrustedBy />
        <FeaturesGrid />
        <ProductShowcase />
        <SplitFeatures />
        <PricingCta />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
