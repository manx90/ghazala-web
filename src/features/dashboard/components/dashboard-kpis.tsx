'use client';

import { MessageSquareIcon, MessagesSquareIcon, PhoneIcon, FileTextIcon } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import { StatsCard, StatsGrid } from '@/components/shared/stats-card';
import type { ConversationStatistics } from '@/types/conversation.types';
import type { PhoneNumberListResponse } from '@/types/whatsapp.types';
import type { TemplateListResponse } from '@/types/template.types';

interface DashboardKpisProps {
  stats: UseQueryResult<ConversationStatistics>;
  phones: UseQueryResult<PhoneNumberListResponse>;
  templates: UseQueryResult<TemplateListResponse>;
}

export function DashboardKpis({ stats, phones, templates }: DashboardKpisProps) {
  const loading = stats.isLoading || phones.isLoading || templates.isLoading;

  return (
    <StatsGrid>
      <StatsCard
        title="إجمالي المحادثات"
        value={stats.data?.total ?? 0}
        description={`${stats.data?.open ?? 0} مفتوحة حالياً`}
        icon={MessagesSquareIcon}
        loading={loading}
      />
      <StatsCard
        title="محادثات مفتوحة"
        value={stats.data?.open ?? 0}
        description={`${stats.data?.closed ?? 0} مغلقة`}
        icon={MessageSquareIcon}
        loading={loading}
      />
      <StatsCard
        title="أرقام واتساب"
        value={phones.data?.total ?? 0}
        description="أرقام نشطة مرتبطة"
        icon={PhoneIcon}
        loading={loading}
      />
      <StatsCard
        title="القوالب"
        value={templates.data?.total ?? 0}
        description="قوالب رسائل مسجّلة"
        icon={FileTextIcon}
        loading={loading}
      />
    </StatsGrid>
  );
}
