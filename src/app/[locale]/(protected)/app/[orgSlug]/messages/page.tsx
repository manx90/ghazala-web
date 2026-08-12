'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RefreshCwIcon } from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { toastApiError } from '@/components/global/toast-helpers';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMessages, useRetryMessage } from '@/features/messages/hooks/use-messages';
import { MessageDirection, MessageStatus, MessageType } from '@/types/message.types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/types/pagination.types';
import { formatDateTime } from '@/utils/date';

export default function MessagesPage() {
  const t = useTranslations('messages');
  const tCommon = useTranslations('common');
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const [page, setPage] = useState(DEFAULT_PAGE);
  const limit = DEFAULT_LIMIT;

  const messagesQuery = useMessages();
  const retryMutation = useRetryMessage();

  const outboundMessages = useMemo(
    () =>
      (messagesQuery.data?.items ?? []).filter(
        (message) => message.direction === MessageDirection.OUTBOUND,
      ),
    [messagesQuery.data?.items],
  );

  const paginatedMessages = useMemo(() => {
    const start = (page - 1) * limit;
    return outboundMessages.slice(start, start + limit);
  }, [outboundMessages, page, limit]);

  const getTypeLabel = (type: MessageType) =>
    t(`types.${type}` as 'types.TEXT');

  const handleRetry = async (messageId: string) => {
    try {
      await retryMutation.mutateAsync(messageId);
    } catch (error) {
      toastApiError(error);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => void messagesQuery.refetch()}
              disabled={messagesQuery.isLoading}
            >
              <RefreshCwIcon data-icon="inline-start" />
              {tCommon('refresh')}
            </Button>
          }
        />

        <QueryState
          isLoading={messagesQuery.isLoading}
          isError={messagesQuery.isError}
          error={messagesQuery.error}
          isEmpty={outboundMessages.length === 0}
          emptyTitle={t('noMessages')}
          emptyDescription={t('noMessagesDescription')}
          onRetry={() => void messagesQuery.refetch()}
          skeletonRows={8}
        >
          <div
            className="stagger-in flex flex-col gap-4"
            style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
          >
            <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>{t('recipient')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('createdAt')}</TableHead>
                    <TableHead className="text-left">{t('action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell dir="ltr" className="text-start font-mono text-xs font-medium">
                        {message.recipient}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getTypeLabel(message.messageType)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={message.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(message.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" render={<Link href={`/app/${orgSlug}/messages/${message.id}`} />}>
                            {t('details')}
                          </Button>
                          {message.status === MessageStatus.FAILED && (
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={retryMutation.isPending}
                              onClick={() => void handleRetry(message.id)}
                            >
                              {t('retry')}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <PaginationControls
              page={page}
              limit={limit}
              total={outboundMessages.length}
              onPageChange={setPage}
            />
          </div>
        </QueryState>
      </div>
    </PageContainer>
  );
}
