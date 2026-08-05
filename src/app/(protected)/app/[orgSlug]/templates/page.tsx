'use client';

import { BookOpenIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type React from 'react';
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
import { ROUTES } from '@/config/routes';
import {
  getLanguageLabel,
  TEMPLATE_LANGUAGE_OPTIONS,
} from '@/features/templates/constants/template-filters';
import { TemplateTable } from '@/features/templates/components/template-table';
import {
  useSyncTemplates,
  useTemplateLanguages,
  useTemplatesList,
} from '@/features/templates/hooks/use-templates';
import { useMetaStatus } from '@/features/settings/hooks/use-integration-settings';
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
  const [languageFilter, setLanguageFilter] = useState('ALL');

  const listParams = useMemo(
    () => ({
      ...(languageFilter !== 'ALL' ? { language: languageFilter } : {}),
      ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
    }),
    [languageFilter, statusFilter],
  );

  const { data, isLoading, isError, error, refetch } = useTemplatesList(listParams);
  const { data: languagesData } = useTemplateLanguages();
  const { data: metaStatus } = useMetaStatus();
  const syncMutation = useSyncTemplates();

  const isMetaConnected = metaStatus?.isConnected ?? false;
  const templates = data?.items ?? [];

  const languageOptions = useMemo(() => {
    const fromOrg = languagesData?.languages ?? [];
    const merged = new Set([
      ...fromOrg,
      ...TEMPLATE_LANGUAGE_OPTIONS.map((item) => item.value),
    ]);
    return [...merged].sort();
  }, [languagesData?.languages]);

  const emptyDescription =
    statusFilter !== 'ALL' || languageFilter !== 'ALL'
      ? 'لا توجد قوالب بهذه التصفية'
      : !isMetaConnected
        ? 'اربط حساب WhatsApp من الإعدادات أولاً، ثم زامن القوالب أو أضف من مكتبة Meta.'
        : 'زامن من Meta، أو تصفح مكتبة القوالب الجاهزة (طلبات، شحن، دفع...) وأضفها لمنظمتك.';

  const handleSync = () => {
    syncMutation.mutate(
      { incremental: false },
      {
        onSuccess: () => {
          void refetch();
        },
      },
    );
  };

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
                onClick={handleSync}
                disabled={syncMutation.isPending || !isMetaConnected}
              >
                <RefreshCwIcon
                  data-icon="inline-start"
                  className={syncMutation.isPending ? 'animate-spin' : ''}
                />
                مزامنة من Meta
              </Button>
              <Button
                variant="outline"
                render={<Link href={ROUTES.app.templateLibrary(orgSlug)} />}
                disabled={!isMetaConnected}
              >
                <BookOpenIcon data-icon="inline-start" />
                مكتبة Meta
              </Button>
              <Button variant="gradient" render={<Link href={`/app/${orgSlug}/templates/new`} />}>
                <PlusIcon data-icon="inline-start" />
                قالب جديد
              </Button>
            </>
          }
        />

        {!isMetaConnected && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
            WhatsApp غير مربوط.{' '}
            <Link href={ROUTES.app.settings.whatsapp(orgSlug)} className="font-medium underline underline-offset-2">
              اربط الحساب من الإعدادات
            </Link>{' '}
            لتفعيل المزامنة وإرسال القوالب.
          </div>
        )}

        <div
          className="stagger-in flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3 shadow-2xs"
          style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
        >
          <span className="text-sm text-muted-foreground">تصفية:</span>
          <Select value={languageFilter} onValueChange={(value) => setLanguageFilter(value ?? 'ALL')}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="اللغة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">كل اللغات</SelectItem>
              {languageOptions.map((code) => (
                <SelectItem key={code} value={code}>
                  {getLanguageLabel(code)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? 'ALL')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="الحالة" />
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
          isEmpty={!isLoading && templates.length === 0}
          emptyTitle="لا توجد قوالب"
          emptyDescription={emptyDescription}
          emptyAction={
            <div className="flex flex-wrap items-center justify-center gap-2">
              {isMetaConnected ? (
                <>
                  <Button variant="outline" onClick={handleSync} disabled={syncMutation.isPending}>
                    <RefreshCwIcon
                      data-icon="inline-start"
                      className={syncMutation.isPending ? 'animate-spin' : ''}
                    />
                    مزامنة من Meta
                  </Button>
                  <Button render={<Link href={ROUTES.app.templateLibrary(orgSlug)} />}>
                    <BookOpenIcon data-icon="inline-start" />
                    مكتبة Meta
                  </Button>
                </>
              ) : (
                <Button render={<Link href={ROUTES.app.settings.whatsapp(orgSlug)} />}>
                  ربط WhatsApp
                </Button>
              )}
              <Button render={<Link href={`/app/${orgSlug}/templates/new`} />}>
                <PlusIcon data-icon="inline-start" />
                إنشاء قالب
              </Button>
            </div>
          }
          onRetry={() => refetch()}
        >
          <div
            className="stagger-in"
            style={{ '--stagger-delay': '180ms' } as React.CSSProperties}
          >
            <TemplateTable templates={templates} orgSlug={orgSlug} />
          </div>
        </QueryState>
      </div>
    </PermissionGuard>
  );
}
