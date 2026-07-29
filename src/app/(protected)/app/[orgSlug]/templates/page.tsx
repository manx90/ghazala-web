'use client';

import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TemplateTable } from '@/features/templates/components/template-table';
import { useSyncTemplates, useTemplatesList } from '@/features/templates/hooks/use-templates';
import { TemplateStatus } from '@/types/template.types';

const STATUS_FILTERS = [
  { value: 'ALL', label: 'الكل' },
  { value: TemplateStatus.APPROVED, label: 'معتمد' },
  { value: TemplateStatus.PENDING, label: 'قيد المراجعة' },
  { value: TemplateStatus.REJECTED, label: 'مرفوض' },
  { value: TemplateStatus.DRAFT, label: 'مسودة' },
  { value: TemplateStatus.PAUSED, label: 'موقوف' },
  { value: TemplateStatus.DISABLED, label: 'معطل' },
];

export default function TemplatesPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, isLoading, isError, error, refetch } = useTemplatesList();
  const syncMutation = useSyncTemplates();

  const filteredTemplates = useMemo(() => {
    const items = data?.items ?? [];
    if (statusFilter === 'ALL') return items;
    return items.filter((template) => template.status === statusFilter);
  }, [data?.items, statusFilter]);

  return (
    <PermissionGuard permission="templates.read">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="القوالب"
          description="إدارة قوالب رسائل WhatsApp المعتمدة من Meta"
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => syncMutation.mutate({ incremental: true })}
                disabled={syncMutation.isPending}
              >
                <RefreshCwIcon data-icon="inline-start" className={syncMutation.isPending ? 'animate-spin' : ''} />
                مزامنة
              </Button>
              <Button render={<Link href={`/app/${orgSlug}/templates/new`} />}>
                <PlusIcon data-icon="inline-start" />
                قالب جديد
              </Button>
            </>
          }
        />

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">تصفية حسب الحالة:</span>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? 'ALL')}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!isLoading && filteredTemplates.length === 0}
          emptyTitle="لا توجد قوالب"
          emptyDescription={
            statusFilter !== 'ALL'
              ? 'لا توجد قوالب بهذه الحالة'
              : 'قم بمزامنة القوالب من Meta أو أنشئ قالباً جديداً'
          }
          emptyAction={
            <Button render={<Link href={`/app/${orgSlug}/templates/new`} />}>
              <PlusIcon data-icon="inline-start" />
              إنشاء قالب
            </Button>
          }
          onRetry={() => refetch()}
        >
          <TemplateTable templates={filteredTemplates} orgSlug={orgSlug} />
        </QueryState>
      </div>
    </PermissionGuard>
  );
}
