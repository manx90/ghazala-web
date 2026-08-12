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
        <aside className="lg:sticky lg:top-6 lg:w-60 lg:shrink-0">
          <div className="animate-fade-in-up lg:rounded-xl lg:bg-card lg:p-3 lg:shadow-xs lg:ring-1 lg:ring-foreground/5">
            <SettingsSidebar orgSlug={orgSlug} />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PageContainer>
  );
}
