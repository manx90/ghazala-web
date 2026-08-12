import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { MetaSettingsSection } from '@/features/settings/components/meta-settings-section';

export default async function MetaSettingsPage() {
  const t = await getTranslations('settings.pages.meta');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />
      <MetaSettingsSection />
    </div>
  );
}
