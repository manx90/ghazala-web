'use client';

import dynamic from 'next/dynamic';
import type { UseQueryResult } from '@tanstack/react-query';
import { ChartSkeleton } from '@/components/feedback/skeletons';
import type { ConversationStatistics } from '@/types/conversation.types';

function ChartsLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  );
}

const ConversationChartsInner = dynamic(
  () =>
    import('@/features/dashboard/components/conversation-charts').then(
      (mod) => mod.ConversationCharts,
    ),
  { loading: () => <ChartsLoading />, ssr: false },
);

interface ConversationChartsLazyProps {
  stats: UseQueryResult<ConversationStatistics>;
}

export function ConversationChartsLazy({ stats }: ConversationChartsLazyProps) {
  return <ConversationChartsInner stats={stats} />;
}
