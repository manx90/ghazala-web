import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { WhatsappSettingsSection } from '@/features/settings/components/whatsapp-settings-section';

export default async function WhatsappSettingsPage() {
  const t = await getTranslations('settings.pages.whatsapp');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />
      <WhatsappSettingsSection />
    </div>
  );
}
