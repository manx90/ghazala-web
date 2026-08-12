import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { SecuritySettingsSection } from '@/features/settings/components/security-settings-section';

export default async function SecuritySettingsPage() {
  const t = await getTranslations('settings.pages.security');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />
      <SecuritySettingsSection />
    </div>
  );
}
