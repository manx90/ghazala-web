'use client';

import { Link } from '@/i18n/navigation';
import type { UseQueryResult } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/config/routes';
import type { ConversationListResponse } from '@/types/conversation.types';
import { formatRelativeTime } from '@/utils/date';
import { cn } from '@/lib/utils';

interface RecentConversationsTableProps {
  conversations: UseQueryResult<ConversationListResponse>;
  orgSlug: string;
}

export function RecentConversationsTable({ conversations, orgSlug }: RecentConversationsTableProps) {
  const t = useTranslations('dashboard.recentConversations');
  const items = conversations.data?.items ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="tracking-tight">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </div>
        <Link href={ROUTES.app.inbox(orgSlug)} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          {t('viewAll')}
        </Link>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={conversations.isLoading}
          isError={conversations.isError}
          error={conversations.error}
          isEmpty={items.length === 0}
          emptyTitle={t('emptyTitle')}
          emptyDescription={t('emptyDescription')}
          onRetry={() => void conversations.refetch()}
        >
          <div className="overflow-hidden rounded-xl border border-border/60">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-3">{t('customerPhone')}</TableHead>
                  <TableHead className="px-3">{t('status')}</TableHead>
                  <TableHead className="px-3">{t('lastMessage')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="px-3 py-2.5 font-medium">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-gradient-brand text-[10px] font-semibold text-primary-foreground">
                            {conversation.customerPhone.slice(-2)}
                          </AvatarFallback>
                        </Avatar>
                        <span dir="ltr">{conversation.customerPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <StatusBadge status={conversation.status} />
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-muted-foreground">
                      {formatRelativeTime(conversation.lastMessageAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </QueryState>
      </CardContent>
    </Card>
  );
}
