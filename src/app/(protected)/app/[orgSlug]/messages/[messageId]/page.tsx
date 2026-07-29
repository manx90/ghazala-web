'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRightIcon, RefreshCwIcon } from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useMessage,
  useMessageStatus,
  useRetryMessage,
} from '@/features/messages/hooks/use-messages';
import { ROUTES } from '@/config/routes';
import { MessageStatus } from '@/types/message.types';
import { formatDateTime } from '@/utils/date';
import { cn } from '@/lib/utils';

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

interface TimelineStep {
  key: string;
  label: string;
  timestamp: string | null;
  active: boolean;
  failed?: boolean;
}

function buildTimeline(status: {
  status: MessageStatus;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
}): TimelineStep[] {
  const steps: TimelineStep[] = [
    { key: 'queued', label: 'في الانتظار', timestamp: null, active: true },
    { key: 'sent', label: 'مُرسلة', timestamp: status.sentAt, active: Boolean(status.sentAt) },
    {
      key: 'delivered',
      label: 'مُسلّمة',
      timestamp: status.deliveredAt,
      active: Boolean(status.deliveredAt),
    },
    { key: 'read', label: 'مقروءة', timestamp: status.readAt, active: Boolean(status.readAt) },
  ];

  if (status.status === MessageStatus.FAILED) {
    steps.push({
      key: 'failed',
      label: 'فشل الإرسال',
      timestamp: status.failedAt,
      active: true,
      failed: true,
    });
  }

  return steps;
}

function MessageDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  );
}

export default function MessageDetailPage() {
  const params = useParams<{ orgSlug: string; messageId: string }>();
  const { orgSlug, messageId } = params;

  const messageQuery = useMessage(messageId);
  const statusQuery = useMessageStatus(messageId);
  const retryMutation = useRetryMessage();

  const isLoading = messageQuery.isLoading || statusQuery.isLoading;
  const isError = messageQuery.isError || statusQuery.isError;
  const error = messageQuery.error ?? statusQuery.error;

  const handleRetry = async () => {
    try {
      await retryMutation.mutateAsync(messageId);
      toastSuccess('تمت إعادة إرسال الرسالة');
    } catch (retryError) {
      toastApiError(retryError);
    }
  };

  const timeline = statusQuery.data ? buildTimeline(statusQuery.data) : [];

  return (
    <PageContainer size="md">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.app.messages(orgSlug)}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
          >
            <ArrowRightIcon className="size-4" />
            العودة للرسائل
          </Link>
        </div>

        {isLoading ? (
          <MessageDetailSkeleton />
        ) : (
          <QueryState
            isLoading={false}
            isError={isError}
            error={error}
            isEmpty={!messageQuery.data}
            emptyTitle="الرسالة غير موجودة"
            emptyDescription="تعذّر العثور على هذه الرسالة."
            onRetry={() => {
              void messageQuery.refetch();
              void statusQuery.refetch();
            }}
          >
            {messageQuery.data && (
              <>
                <PageHeader
                  title={`رسالة إلى ${messageQuery.data.recipient}`}
                  description={`معرّف: ${messageQuery.data.id}`}
                  actions={
                    <div className="flex items-center gap-2">
                      <StatusBadge status={messageQuery.data.status} />
                      {messageQuery.data.status === MessageStatus.FAILED && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={retryMutation.isPending}
                          onClick={() => void handleRetry()}
                        >
                          <RefreshCwIcon data-icon="inline-start" />
                          إعادة المحاولة
                        </Button>
                      )}
                    </div>
                  }
                />

                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل الرسالة</CardTitle>
                    <CardDescription>معلومات الإرسال والمحتوى</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                      <div className="flex flex-col gap-0.5">
                        <dt className="text-muted-foreground">المستلم</dt>
                        <dd className="font-medium">{messageQuery.data.recipient}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <dt className="text-muted-foreground">النوع</dt>
                        <dd>{MESSAGE_TYPE_LABELS[messageQuery.data.messageType] ?? messageQuery.data.messageType}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <dt className="text-muted-foreground">تاريخ الإنشاء</dt>
                        <dd>{formatDateTime(messageQuery.data.createdAt)}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <dt className="text-muted-foreground">عدد المحاولات</dt>
                        <dd>
                          {messageQuery.data.retryCount} / {messageQuery.data.maxRetries}
                        </dd>
                      </div>
                      {messageQuery.data.errorMessage && (
                        <div className="flex flex-col gap-0.5 sm:col-span-2">
                          <dt className="text-destructive">رسالة الخطأ</dt>
                          <dd className="text-destructive">{messageQuery.data.errorMessage}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>مسار الحالة</CardTitle>
                    <CardDescription>تتبّع مراحل إرسال الرسالة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QueryState
                      isLoading={statusQuery.isLoading}
                      isError={statusQuery.isError}
                      error={statusQuery.error}
                      isEmpty={timeline.length === 0}
                      emptyTitle="لا توجد بيانات حالة"
                      onRetry={() => void statusQuery.refetch()}
                    >
                      <ol className="relative flex flex-col gap-0 border-r-2 border-muted pr-6">
                        {timeline.map((step, index) => (
                          <li key={step.key} className="relative pb-6 last:pb-0">
                            <span
                              className={cn(
                                'absolute -right-[calc(0.5rem+1px)] top-1 size-3 rounded-full ring-2 ring-background',
                                step.failed
                                  ? 'bg-destructive'
                                  : step.active
                                    ? 'bg-primary'
                                    : 'bg-muted',
                              )}
                            />
                            <div className="flex flex-col gap-0.5">
                              <span
                                className={cn(
                                  'text-sm font-medium',
                                  !step.active && !step.failed && 'text-muted-foreground',
                                  step.failed && 'text-destructive',
                                )}
                              >
                                {step.label}
                              </span>
                              {step.timestamp && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(step.timestamp)}
                                </span>
                              )}
                              {!step.timestamp && step.key === 'queued' && index === 0 && (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </QueryState>
                  </CardContent>
                </Card>
              </>
            )}
          </QueryState>
        )}
      </div>
    </PageContainer>
  );
}
