import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/features/legal/components/legal-page';
import { getLegalDocument } from '@/features/legal/data/legal-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.privacy');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PrivacyPage() {
  const document = await getLegalDocument('privacy');
  return <LegalPage document={document} />;
}
