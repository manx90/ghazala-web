import type { Metadata } from 'next';
import { LegalPage } from '@/features/legal/components/legal-page';
import { TERMS_CONTENT } from '@/features/legal/data/legal-content';

export const metadata: Metadata = {
  title: 'شروط الخدمة',
  description: 'الشروط والأحكام المنظمة لاستخدام منصة غزالة للتواصل عبر WhatsApp Business API.',
};

export default function TermsPage() {
  return <LegalPage document={TERMS_CONTENT} />;
}
