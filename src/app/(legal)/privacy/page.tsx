import type { Metadata } from 'next';
import { arabicFont } from '@/lib/fonts';
import { LegalPage } from '@/features/legal/components/legal-page';
import { PRIVACY_CONTENT } from '@/features/legal/data/legal-content';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'كيف تجمع منصة غزالة بياناتك وتستخدمها وتحميها.',
};

export default function PrivacyPage() {
  return (
    <div className={arabicFont.className}>
      <LegalPage document={PRIVACY_CONTENT} />
    </div>
  );
}
