import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { BillingSettingsSection } from '@/features/settings/components/billing-settings-section';

export default async function BillingSettingsPage() {
  const t = await getTranslations('settings.pages.billing');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />
      <BillingSettingsSection />
    </div>
  );
}
