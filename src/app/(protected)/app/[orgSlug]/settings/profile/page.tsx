'use client';

import { PageHeader } from '@/components/shared/page-header';
import { ProfileSettingsSection } from '@/features/settings/components/profile-settings-section';

export default function ProfileSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="الملف الشخصي" description="عرض معلومات حسابك" />
      <ProfileSettingsSection />
    </div>
  );
}
