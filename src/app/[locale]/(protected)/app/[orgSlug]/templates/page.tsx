'use client';

import { BookOpenIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
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
  TEMPLATE_STATUS_FILTER_VALUES,
} from '@/features/templates/constants/template-filters';
import { TemplateTable } from '@/features/templates/components/template-table';
import {
  useSyncTemplates,
  useTemplateLanguages,
  useTemplatesList,
} from '@/features/templates/hooks/use-templates';
import { useMetaStatus } from '@/features/settings/hooks/use-integration-settings';

export default function TemplatesPage() {
  const t = useTranslations('templates');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('status');
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
      ? t('emptyFiltered')
      : !isMetaConnected
        ? t('emptyNotConnected')
        : t('emptyConnected');

  const getStatusLabel = (value: string) =>
    value === 'ALL' ? tCommon('all') : tStatus(value as 'APPROVED');

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
          title={t('title')}
          description={t('description')}
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
                {t('syncFromMeta')}
              </Button>
              <Button
                variant="outline"
                render={<Link href={ROUTES.app.templateLibrary(orgSlug)} />}
                disabled={!isMetaConnected}
              >
                <BookOpenIcon data-icon="inline-start" />
                {t('metaLibrary')}
              </Button>
              <Button variant="gradient" render={<Link href={`/app/${orgSlug}/templates/new`} />}>
                <PlusIcon data-icon="inline-start" />
                {t('newTemplate')}
              </Button>
            </>
          }
        />

        {!isMetaConnected && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
            {t('metaNotConnected')}{' '}
            <Link href={ROUTES.app.settings.whatsapp(orgSlug)} className="font-medium underline underline-offset-2">
              {t('connectFromSettings')}
            </Link>{' '}
            {t('connectToEnable')}
          </div>
        )}

        <div
          className="stagger-in flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3 shadow-2xs"
          style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
        >
          <span className="text-sm text-muted-foreground">{t('filterLabel')}</span>
          <Select value={languageFilter} onValueChange={(value) => setLanguageFilter(value ?? 'ALL')}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('allLanguages')}</SelectItem>
              {languageOptions.map((code) => (
                <SelectItem key={code} value={code}>
                  {getLanguageLabel(code, t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? 'ALL')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_STATUS_FILTER_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {getStatusLabel(value)}
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
          emptyTitle={t('noTemplates')}
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
                    {t('syncFromMeta')}
                  </Button>
                  <Button render={<Link href={ROUTES.app.templateLibrary(orgSlug)} />}>
                    <BookOpenIcon data-icon="inline-start" />
                    {t('metaLibrary')}
                  </Button>
                </>
              ) : (
                <Button render={<Link href={ROUTES.app.settings.whatsapp(orgSlug)} />}>
                  {t('connectWhatsApp')}
                </Button>
              )}
              <Button render={<Link href={`/app/${orgSlug}/templates/new`} />}>
                <PlusIcon data-icon="inline-start" />
                {t('createTemplate')}
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
