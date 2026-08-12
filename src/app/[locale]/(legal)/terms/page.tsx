import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/features/legal/components/legal-page';
import { getLegalDocument } from '@/features/legal/data/legal-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.terms');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TermsPage() {
  const document = await getLegalDocument('terms');
  return <LegalPage document={document} />;
}
