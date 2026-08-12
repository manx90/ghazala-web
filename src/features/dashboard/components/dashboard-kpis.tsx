'use client';

import type React from 'react';
import { MessageSquareIcon, MessagesSquareIcon, PhoneIcon, FileTextIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('dashboard.kpis');
  const loading = stats.isLoading || phones.isLoading || templates.isLoading;

  const total = useCountUp(stats.data?.total ?? 0);
  const open = useCountUp(stats.data?.open ?? 0);
  const phonesTotal = useCountUp(phones.data?.total ?? 0);
  const templatesTotal = useCountUp(templates.data?.total ?? 0);

  const cards = [
    {
      key: 'totalConversations',
      title: t('totalConversations'),
      value: total,
      description: t('totalConversationsDesc', { open: stats.data?.open ?? 0 }),
      icon: MessagesSquareIcon,
    },
    {
      key: 'openConversations',
      title: t('openConversations'),
      value: open,
      description: t('openConversationsDesc', { closed: stats.data?.closed ?? 0 }),
      icon: MessageSquareIcon,
    },
    {
      key: 'whatsappNumbers',
      title: t('whatsappNumbers'),
      value: phonesTotal,
      description: t('whatsappNumbersDesc'),
      icon: PhoneIcon,
    },
    {
      key: 'templates',
      title: t('templates'),
      value: templatesTotal,
      description: t('templatesDesc'),
      icon: FileTextIcon,
    },
  ] as const;

  return (
    <StatsGrid className="gap-6">
      {cards.map((card, index) => (
        <div
          key={card.key}
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
