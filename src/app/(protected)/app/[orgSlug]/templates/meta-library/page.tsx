'use client';

import { ArrowRightIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES } from '@/config/routes';
import { AddLibraryTemplateDialog } from '@/features/templates/components/add-library-template-dialog';
import { TemplateLibraryTable } from '@/features/templates/components/template-library-table';
import {
  LIBRARY_INDUSTRY_OPTIONS,
  LIBRARY_TOPIC_OPTIONS,
  LIBRARY_USECASE_OPTIONS,
  TEMPLATE_LANGUAGE_OPTIONS,
} from '@/features/templates/constants/template-filters';
import { useTemplateLibrary } from '@/features/templates/hooks/use-templates';
import { useMetaStatus } from '@/features/settings/hooks/use-integration-settings';
import type { ListTemplateLibraryParams, TemplateLibraryItem } from '@/types/template.types';

export default function TemplateMetaLibraryPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('ar');
  const [topic, setTopic] = useState('ALL');
  const [usecase, setUsecase] = useState('ALL');
  const [industry, setIndustry] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<TemplateLibraryItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data: metaStatus } = useMetaStatus();
  const isMetaConnected = metaStatus?.isConnected ?? false;

  const libraryParams = useMemo<ListTemplateLibraryParams>(() => {
    const query: ListTemplateLibraryParams = {};
    if (search.trim()) query.search = search.trim();
    if (language !== 'ALL') query.language = language;
    if (topic !== 'ALL') query.topic = topic;
    if (usecase !== 'ALL') query.usecase = usecase;
    if (industry !== 'ALL') query.industry = industry;
    return query;
  }, [search, language, topic, usecase, industry]);

  const { data, isLoading, isError, error, refetch } = useTemplateLibrary(
    libraryParams,
    isMetaConnected,
  );

  const items = data?.items ?? [];

  const handleAdd = (item: TemplateLibraryItem) => {
    setSelectedItem(item);
    setAddOpen(true);
  };

  return (
    <PermissionGuard permission="templates.read">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="مكتبة قوالب Meta"
          description="تصفح القوالب الجاهزة (طلبات، شحن، دفع...) وأضفها لمنظمتك"
          actions={
            <Button variant="outline" render={<Link href={ROUTES.app.templates(orgSlug)} />}>
              <ArrowRightIcon data-icon="inline-start" />
              قوالبي
            </Button>
          }
        />

        {!isMetaConnected && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
            WhatsApp غير مربوط.{' '}
            <Link href={ROUTES.app.settings.whatsapp(orgSlug)} className="font-medium underline underline-offset-2">
              اربط الحساب
            </Link>{' '}
            لتصفح وإضافة القوالب من مكتبة Meta.
          </div>
        )}

        <div
          className="stagger-in grid gap-3 rounded-xl border bg-card p-4 shadow-2xs md:grid-cols-2 xl:grid-cols-3"
          style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
        >
          <div className="relative md:col-span-2 xl:col-span-3">
            <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="ابحث: order, payment, delivery..."
              className="ps-9"
              disabled={!isMetaConnected}
            />
          </div>

          <Select value={language} onValueChange={(value) => setLanguage(value ?? 'ALL')} disabled={!isMetaConnected}>
            <SelectTrigger>
              <SelectValue placeholder="اللغة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">كل اللغات</SelectItem>
              {TEMPLATE_LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={topic} onValueChange={(value) => setTopic(value ?? 'ALL')} disabled={!isMetaConnected}>
            <SelectTrigger>
              <SelectValue placeholder="الموضوع" />
            </SelectTrigger>
            <SelectContent>
              {LIBRARY_TOPIC_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={usecase} onValueChange={(value) => setUsecase(value ?? 'ALL')} disabled={!isMetaConnected}>
            <SelectTrigger>
              <SelectValue placeholder="الاستخدام" />
            </SelectTrigger>
            <SelectContent>
              {LIBRARY_USECASE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={industry} onValueChange={(value) => setIndustry(value ?? 'ALL')} disabled={!isMetaConnected}>
            <SelectTrigger>
              <SelectValue placeholder="القطاع" />
            </SelectTrigger>
            <SelectContent>
              {LIBRARY_INDUSTRY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!isLoading && isMetaConnected && items.length === 0}
          emptyTitle="لا توجد قوالب في المكتبة"
          emptyDescription="جرّب تغيير فلاتر اللغة أو البحث. بعض القوالب متاحة بلغات محددة فقط."
          onRetry={() => refetch()}
        >
          <div
            className="stagger-in flex flex-col gap-3"
            style={{ '--stagger-delay': '180ms' } as React.CSSProperties}
          >
            {data?.hasMore ? (
              <p className="text-sm text-muted-foreground">
                يُعرض أول 50 نتيجة — استخدم فلاتر اللغة أو البحث لتضييق النتائج.
              </p>
            ) : null}
            <TemplateLibraryTable items={items} onAdd={handleAdd} />
          </div>
        </QueryState>

        <AddLibraryTemplateDialog
          item={selectedItem}
          open={addOpen}
          onOpenChange={setAddOpen}
          onSuccess={() => void refetch()}
        />
      </div>
    </PermissionGuard>
  );
}
