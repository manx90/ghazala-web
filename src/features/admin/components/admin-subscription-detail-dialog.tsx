'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
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
  const t = useTranslations('admin.subscriptions.detailDialog');
  const tSubs = useTranslations('admin.subscriptions');
  const tBilling = useTranslations('settings.billing');
  const tCommon = useTranslations('admin.common');
  const { data, isLoading, isError, error, refetch } = useAdminSubscriptionDetail(
    subscriptionId ?? '',
    open && !!subscriptionId,
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={data?.organization?.name ?? tCommon('loading')}
      footer={
        data?.organization ? (
          <Button variant="outline" render={<Link href={ROUTES.admin.organization(data.organization.id)} />}>
            {t('viewOrganization')}
          </Button>
        ) : null
      }
    >
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!data && !isLoading}
        emptyTitle={t('notFound')}
        onRetry={() => refetch()}
      >
        {data ? (
          <div className="flex flex-col gap-5">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">{tSubs('columns.organization')}</dt>
                <dd className="font-medium">{data.organization?.name ?? tCommon('notAvailable')}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{tSubs('columns.plan')}</dt>
                <dd className="font-medium">{data.plan?.name ?? tCommon('notAvailable')}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{tSubs('columns.status')}</dt>
                <dd>
                  <StatusBadge status={data.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{tSubs('columns.cycle')}</dt>
                <dd>
                  {data.billingCycle === BillingCycle.MONTHLY
                    ? tSubs('cycle.monthly')
                    : tSubs('cycle.yearly')}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{tBilling('subscription.expiresAt')}</dt>
                <dd>{data.expiresAt ? formatDateTime(data.expiresAt) : tCommon('notAvailable')}</dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold">{t('invoices')}</h4>
              {data.invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">{tBilling('invoices.emptyTitle')}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{tBilling('invoices.columns.number')}</TableHead>
                      <TableHead>{tBilling('invoices.columns.amount')}</TableHead>
                      <TableHead>{tBilling('invoices.columns.status')}</TableHead>
                      <TableHead>{tBilling('invoices.columns.issuedAt')}</TableHead>
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
