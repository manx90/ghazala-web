'use client';

import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/global/page-container';
import { SettingsSidebar } from '@/features/settings/components/settings-sidebar';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const orgSlug = useParams<{ orgSlug: string }>().orgSlug;

  return (
    <PageContainer size="lg">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="lg:w-56 lg:shrink-0">
          <SettingsSidebar orgSlug={orgSlug} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PageContainer>
  );
}
