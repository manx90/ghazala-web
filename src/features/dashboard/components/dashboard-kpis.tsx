'use client';

import type React from 'react';
import { MessageSquareIcon, MessagesSquareIcon, PhoneIcon, FileTextIcon } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import { StatsCard, StatsGrid } from '@/components/shared/stats-card';
import { useCountUp } from '@/features/dashboard/hooks/use-count-up';
import type { ConversationStatistics } from '@/types/conversation.types';
import type { PhoneNumberListResponse } from '@/types/whatsapp.types';
import type { TemplateListResponse } from '@/types/template.types';

interface DashboardKpisProps {
  stats: UseQueryResult<ConversationStatistics>;
  phones: UseQueryResult<PhoneNumberListResponse>;
  templates: UseQueryResult<TemplateListResponse>;
}

const STAGGER_DELAY = 80;

export function DashboardKpis({ stats, phones, templates }: DashboardKpisProps) {
  const loading = stats.isLoading || phones.isLoading || templates.isLoading;

  const total = useCountUp(stats.data?.total ?? 0);
  const open = useCountUp(stats.data?.open ?? 0);
  const phonesTotal = useCountUp(phones.data?.total ?? 0);
  const templatesTotal = useCountUp(templates.data?.total ?? 0);

  const cards = [
    {
      title: 'إجمالي المحادثات',
      value: total,
      description: `${stats.data?.open ?? 0} مفتوحة حالياً`,
      icon: MessagesSquareIcon,
    },
    {
      title: 'محادثات مفتوحة',
      value: open,
      description: `${stats.data?.closed ?? 0} مغلقة`,
      icon: MessageSquareIcon,
    },
    {
      title: 'أرقام واتساب',
      value: phonesTotal,
      description: 'أرقام نشطة مرتبطة',
      icon: PhoneIcon,
    },
    {
      title: 'القوالب',
      value: templatesTotal,
      description: 'قوالب رسائل مسجّلة',
      icon: FileTextIcon,
    },
  ] as const;

  return (
    <StatsGrid className="gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="stagger-in"
          style={{ '--stagger-delay': `${index * STAGGER_DELAY}ms` } as React.CSSProperties}
        >
          <StatsCard
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            loading={loading}
            className="h-full"
          />
        </div>
      ))}
    </StatsGrid>
  );
}
