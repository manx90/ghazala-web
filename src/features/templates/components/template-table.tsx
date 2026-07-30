'use client';

import Link from 'next/link';
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

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  [TemplateCategory.MARKETING]: 'تسويق',
  [TemplateCategory.UTILITY]: 'خدمي',
  [TemplateCategory.AUTHENTICATION]: 'مصادقة',
};

interface TemplateTableProps {
  templates: Template[];
  orgSlug: string;
}

function getBodyPreview(template: Template): string {
  const body = template.components.find((c) => c.type === 'BODY');
  return body?.text ?? '—';
}

export function TemplateTable({ templates, orgSlug }: TemplateTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>الاسم</TableHead>
            <TableHead>التصنيف</TableHead>
            <TableHead>اللغة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>المحتوى</TableHead>
            <TableHead>آخر مزامنة</TableHead>
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
              <TableCell>{CATEGORY_LABELS[template.category] ?? template.category}</TableCell>
              <TableCell>
                <span dir="ltr" className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {template.language}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={template.status} />
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
                      <Button variant="ghost" size="sm" aria-label="إجراءات">
                        <MoreHorizontalIcon />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={`/app/${orgSlug}/templates/${template.id}`} />}>
                      <EyeIcon data-icon="inline-start" />
                      عرض التفاصيل
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
