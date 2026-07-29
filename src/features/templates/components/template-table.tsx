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
import { EyeIcon, MoreHorizontalIcon } from 'lucide-react';

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
    <Table>
      <TableHeader>
        <TableRow>
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
            <TableCell className="font-medium" dir="ltr">
              {template.name}
            </TableCell>
            <TableCell>{CATEGORY_LABELS[template.category] ?? template.category}</TableCell>
            <TableCell>{template.language}</TableCell>
            <TableCell>
              <StatusBadge status={template.status} />
            </TableCell>
            <TableCell className="max-w-xs truncate">{getBodyPreview(template)}</TableCell>
            <TableCell>{formatDateTime(template.lastSyncedAt)}</TableCell>
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
  );
}
