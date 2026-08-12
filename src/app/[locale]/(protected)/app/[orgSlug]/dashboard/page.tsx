'use client';

import type React from 'react';
import { useParams } from 'next/navigation';
import { RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { ConversationChartsLazy } from '@/features/dashboard/components/conversation-charts-lazy';
import { DashboardKpis } from '@/features/dashboard/components/dashboard-kpis';
import { MetaConnectionCard } from '@/features/dashboard/components/meta-connection-card';
import { PhoneHealthCard } from '@/features/dashboard/components/phone-health-card';
import { QuickActionsCard } from '@/features/dashboard/components/quick-actions-card';
import { RecentConversationsTable } from '@/features/dashboard/components/recent-conversations-table';
import { TemplateSummaryCard } from '@/features/dashboard/components/template-summary-card';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';

function StaggerSection({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={className ? `stagger-in ${className}` : 'stagger-in'}
      style={{ '--stagger-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const t = useTranslations('dashboard.page');
  const { stats, meta, phones, templates, recentConversations, isLoading, refetchAll } = useDashboard();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button variant="outline" size="sm" onClick={refetchAll} disabled={isLoading}>
              <RefreshCwIcon data-icon="inline-start" />
              {t('refresh')}
            </Button>
          }
        />

        <DashboardKpis stats={stats} phones={phones} templates={templates} />

        <ConversationChartsLazy stats={stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <StaggerSection delay={360} className="lg:col-span-2">
            <RecentConversationsTable conversations={recentConversations} orgSlug={orgSlug} />
          </StaggerSection>
          <StaggerSection delay={440}>
            <QuickActionsCard orgSlug={orgSlug} />
          </StaggerSection>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StaggerSection delay={480}>
            <PhoneHealthCard phones={phones} />
          </StaggerSection>
          <StaggerSection delay={560}>
            <TemplateSummaryCard templates={templates} />
          </StaggerSection>
          <StaggerSection delay={640}>
            <MetaConnectionCard meta={meta} orgSlug={orgSlug} />
          </StaggerSection>
        </div>
      </div>
    </PageContainer>
  );
}
