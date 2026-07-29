'use client';

import Link from 'next/link';
import type { UseQueryResult } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
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
  const items = conversations.data?.items ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>أحدث المحادثات</CardTitle>
          <CardDescription>آخر 5 محادثات نشطة</CardDescription>
        </div>
        <Link href={ROUTES.app.inbox(orgSlug)} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          عرض الكل
        </Link>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={conversations.isLoading}
          isError={conversations.isError}
          error={conversations.error}
          isEmpty={items.length === 0}
          emptyTitle="لا توجد محادثات"
          emptyDescription="ستظهر المحادثات هنا عند استقبال رسائل جديدة."
          onRetry={() => void conversations.refetch()}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم العميل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>آخر رسالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell className="font-medium">{conversation.customerPhone}</TableCell>
                  <TableCell>
                    <StatusBadge status={conversation.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(conversation.lastMessageAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </QueryState>
      </CardContent>
    </Card>
  );
}
