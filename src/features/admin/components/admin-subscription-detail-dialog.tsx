'use client';

import Link from 'next/link';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/config/routes';
import { useAdminSubscriptionDetail } from '@/features/admin/hooks/use-admin-subscriptions';
import { BillingCycle } from '@/types/billing.types';
import { formatCurrency } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';

const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  [BillingCycle.MONTHLY]: 'شهري',
  [BillingCycle.YEARLY]: 'سنوي',
};

interface AdminSubscriptionDetailDialogProps {
  subscriptionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminSubscriptionDetailDialog({
  subscriptionId,
  open,
  onOpenChange,
}: AdminSubscriptionDetailDialogProps) {
  const { data, isLoading, isError, error, refetch } = useAdminSubscriptionDetail(
    subscriptionId ?? '',
    open && !!subscriptionId,
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="تفاصيل الاشتراك"
      description={data?.organization?.name ?? 'جاري التحميل...'}
      footer={
        data?.organization ? (
          <Button variant="outline" render={<Link href={ROUTES.admin.organization(data.organization.id)} />}>
            عرض المنظمة
          </Button>
        ) : null
      }
    >
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!data && !isLoading}
        emptyTitle="الاشتراك غير موجود"
        onRetry={() => refetch()}
      >
        {data ? (
          <div className="flex flex-col gap-5">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">المنظمة</dt>
                <dd className="font-medium">{data.organization?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">الخطة</dt>
                <dd className="font-medium">{data.plan?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">الحالة</dt>
                <dd>
                  <StatusBadge status={data.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">دورة الفوترة</dt>
                <dd>{BILLING_CYCLE_LABELS[data.billingCycle]}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">تاريخ البداية</dt>
                <dd>{formatDateTime(data.startsAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">تاريخ الانتهاء</dt>
                <dd>{data.expiresAt ? formatDateTime(data.expiresAt) : '—'}</dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold">سجل الفواتير</h4>
              {data.invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد فواتير</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الرقم</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-xs" dir="ltr">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(invoice.issuedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        ) : null}
      </QueryState>
    </ModalWrapper>
  );
}
