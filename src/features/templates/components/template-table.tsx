'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TemplateCategory } from '@/types/template.types';
import { formatDateTime } from '@/utils/date';
import type { Template } from '@/types/template.types';
import { EyeIcon, FileTextIcon, MoreHorizontalIcon } from 'lucide-react';

interface TemplateTableProps {
  templates: Template[];
  orgSlug: string;
}

function getBodyPreview(template: Template): string {
  const body = template.components.find((c) => c.type === 'BODY');
  return body?.text ?? '—';
}

export function TemplateTable({ templates, orgSlug }: TemplateTableProps) {
  const t = useTranslations('templates.table');
  const tCategories = useTranslations('templates.categories');
  const tCommon = useTranslations('common');

  const getCategoryLabel = (category: TemplateCategory) =>
    tCategories(category as 'MARKETING' | 'UTILITY' | 'AUTHENTICATION');

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('category')}</TableHead>
            <TableHead>{t('language')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('content')}</TableHead>
            <TableHead>{t('lastSync')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                    <FileTextIcon className="size-4" aria-hidden="true" />
                  </span>
                  <span dir="ltr" className="font-mono text-xs font-medium">
                    {template.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getCategoryLabel(template.category)}</TableCell>
              <TableCell>
                <span dir="ltr" className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {template.language}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={template.status} />
                  {!template.metaTemplateId ? (
                    <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-200">
                      {t('notLinkedMeta')}
                    </span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {getBodyPreview(template)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDateTime(template.lastSyncedAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="sm" aria-label={tCommon('actions')}>
                        <MoreHorizontalIcon />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={`/app/${orgSlug}/templates/${template.id}`} />}>
                      <EyeIcon data-icon="inline-start" />
                      {t('viewDetails')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
