import { getTranslations } from 'next-intl/server';

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export type LegalDocumentType = 'terms' | 'privacy';

export async function getLegalDocument(type: LegalDocumentType): Promise<LegalDocument> {
  const t = await getTranslations(`legal.${type}`);
  return {
    title: t('title'),
    subtitle: t('subtitle'),
    lastUpdated: t('lastUpdated'),
    intro: t('intro'),
    sections: t.raw('sections') as LegalSection[],
  };
}
