import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { OrganizationSettingsForm } from '@/features/settings/components/organization-settings-form';

export default async function OrganizationSettingsPage() {
  const t = await getTranslations('settings.pages.organization');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />
      <OrganizationSettingsForm />
    </div>
  );
}
