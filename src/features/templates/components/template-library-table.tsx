'use client';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getFilterLabel, getLanguageLabel } from '@/features/templates/constants/template-filters';
import type { TemplateLibraryItem } from '@/types/template.types';

interface TemplateLibraryTableProps {
  items: TemplateLibraryItem[];
  onAdd: (item: TemplateLibraryItem) => void;
  isAdding?: boolean;
}

export function TemplateLibraryTable({ items, onAdd, isAdding }: TemplateLibraryTableProps) {
  const t = useTranslations('templates.table');
  const tTemplates = useTranslations('templates');

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('language')}</TableHead>
            <TableHead>{t('usecase')}</TableHead>
            <TableHead>{t('content')}</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={`${item.id}-${item.language}`}>
              <TableCell>
                <span dir="ltr" className="font-mono text-xs font-medium">
                  {item.name}
                </span>
              </TableCell>
              <TableCell>
                <span dir="ltr" className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {getLanguageLabel(item.language, tTemplates)}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {item.usecase
                  ? getFilterLabel('usecases', item.usecase, tTemplates)
                  : '—'}
              </TableCell>
              <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                {item.header ? `${item.header} — ` : ''}
                {item.body}
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isAdding}
                  onClick={() => onAdd(item)}
                >
                  <PlusIcon data-icon="inline-start" />
                  {t('add')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
