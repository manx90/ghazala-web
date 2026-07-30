'use client';

import { useParams } from 'next/navigation';
import { RefreshCwIcon } from 'lucide-react';
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

export default function DashboardPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const { stats, meta, phones, templates, recentConversations, isLoading, refetchAll } = useDashboard();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="لوحة التحكم"
          description="نظرة عامة على نشاط المحادثات والرسائل"
          actions={
            <Button variant="outline" size="sm" onClick={refetchAll} disabled={isLoading}>
              <RefreshCwIcon data-icon="inline-start" />
              تحديث
            </Button>
          }
        />

        <DashboardKpis stats={stats} phones={phones} templates={templates} />

        <ConversationChartsLazy stats={stats} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentConversationsTable conversations={recentConversations} orgSlug={orgSlug} />
          </div>
          <QuickActionsCard orgSlug={orgSlug} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <PhoneHealthCard phones={phones} />
          <TemplateSummaryCard templates={templates} />
          <MetaConnectionCard meta={meta} orgSlug={orgSlug} />
        </div>
      </div>
    </PageContainer>
  );
}
