import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { TeamMembersSection } from '@/features/settings/components/team-members-section';

export default async function TeamSettingsPage() {
  const t = await getTranslations('settings.pages.team');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />
      <TeamMembersSection />
    </div>
  );
}
