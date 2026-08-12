import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { ProfileSettingsSection } from '@/features/settings/components/profile-settings-section';

export default async function ProfileSettingsPage() {
  const t = await getTranslations('settings.pages.profile');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />
      <ProfileSettingsSection />
    </div>
  );
}
