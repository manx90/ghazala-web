'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RefreshCwIcon } from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
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
import { MessageDirection, MessageStatus } from '@/types/message.types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/types/pagination.types';
import { formatDateTime } from '@/utils/date';

const MESSAGE_TYPE_LABELS: Record<string, string> = {
  TEXT: 'نص',
  TEMPLATE: 'قالب',
  IMAGE: 'صورة',
  VIDEO: 'فيديو',
  DOCUMENT: 'مستند',
  AUDIO: 'صوت',
  STICKER: 'ملصق',
  LOCATION: 'موقع',
  CONTACTS: 'جهات اتصال',
};

export default function MessagesPage() {
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

  const handleRetry = async (messageId: string) => {
    try {
      await retryMutation.mutateAsync(messageId);
      toastSuccess('تمت إعادة إرسال الرسالة');
    } catch (error) {
      toastApiError(error);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="الرسائل الصادرة"
          description="تتبّع حالة الرسائل المرسلة من منصتك"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => void messagesQuery.refetch()}
              disabled={messagesQuery.isLoading}
            >
              <RefreshCwIcon data-icon="inline-start" />
              تحديث
            </Button>
          }
        />

        <QueryState
          isLoading={messagesQuery.isLoading}
          isError={messagesQuery.isError}
          error={messagesQuery.error}
          isEmpty={outboundMessages.length === 0}
          emptyTitle="لا توجد رسائل صادرة"
          emptyDescription="ستظهر الرسائل هنا بعد إرسالها."
          onRetry={() => void messagesQuery.refetch()}
          skeletonRows={8}
        >
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستلم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="text-left">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.recipient}</TableCell>
                    <TableCell>{MESSAGE_TYPE_LABELS[message.messageType] ?? message.messageType}</TableCell>
                    <TableCell>
                      <StatusBadge status={message.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(message.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" render={<Link href={`/app/${orgSlug}/messages/${message.id}`} />}>
                          التفاصيل
                        </Button>
                        {message.status === MessageStatus.FAILED && (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={retryMutation.isPending}
                            onClick={() => void handleRetry(message.id)}
                          >
                            إعادة المحاولة
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
        </QueryState>
      </div>
    </PageContainer>
  );
}
