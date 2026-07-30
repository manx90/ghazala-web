'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type React from 'react';
import {
  ArrowRightIcon,
  CalendarIcon,
  FileTextIcon,
  PhoneIcon,
  RefreshCwIcon,
  RepeatIcon,
} from 'lucide-react';
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

                <Card
                  className="stagger-in"
                  style={{ '--stagger-delay': '60ms' } as React.CSSProperties}
                >
                  <CardHeader>
                    <CardTitle>تفاصيل الرسالة</CardTitle>
                    <CardDescription>معلومات الإرسال والمحتوى</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                          <PhoneIcon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <dt className="text-xs text-muted-foreground">المستلم</dt>
                          <dd dir="ltr" className="truncate text-start font-mono text-xs font-medium">
                            {messageQuery.data.recipient}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                          <FileTextIcon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs text-muted-foreground">النوع</dt>
                          <dd>{MESSAGE_TYPE_LABELS[messageQuery.data.messageType] ?? messageQuery.data.messageType}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                          <CalendarIcon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs text-muted-foreground">تاريخ الإنشاء</dt>
                          <dd>{formatDateTime(messageQuery.data.createdAt)}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                          <RepeatIcon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs text-muted-foreground">عدد المحاولات</dt>
                          <dd>
                            {messageQuery.data.retryCount} / {messageQuery.data.maxRetries}
                          </dd>
                        </div>
                      </div>
                      {messageQuery.data.errorMessage && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 sm:col-span-2">
                          <p className="text-xs font-medium text-destructive">رسالة الخطأ</p>
                          <p className="mt-1 text-sm text-destructive/90">
                            {messageQuery.data.errorMessage}
                          </p>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>

                <Card
                  className="stagger-in"
                  style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
                >
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
                      <ol className="relative flex flex-col gap-0 border-s-2 border-border ps-6">
                        {timeline.map((step, index) => (
                          <li key={step.key} className="relative pb-6 last:pb-0">
                            <span
                              className={cn(
                                'absolute -start-[calc(0.5rem+1px)] top-1 size-3 rounded-full',
                                step.failed
                                  ? 'bg-destructive ring-4 ring-destructive/15'
                                  : step.active
                                    ? 'bg-primary ring-4 ring-primary/15'
                                    : 'bg-muted-foreground/30 ring-2 ring-background',
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
