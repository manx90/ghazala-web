'use client';

import {
  ActivityIcon,
  CheckCheckIcon,
  FileTextIcon,
  LanguagesIcon,
  MessageSquareIcon,
  StarIcon,
  TagIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { TemplateCategory, TemplateComponentType } from '@/types/template.types';
import type { Template } from '@/types/template.types';

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  [TemplateCategory.MARKETING]: 'تسويق',
  [TemplateCategory.UTILITY]: 'خدمي',
  [TemplateCategory.AUTHENTICATION]: 'مصادقة',
};

interface TemplatePreviewProps {
  template: Template;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const header = template.components.find((c) => c.type === TemplateComponentType.HEADER);
  const body = template.components.find((c) => c.type === TemplateComponentType.BODY);
  const footer = template.components.find((c) => c.type === TemplateComponentType.FOOTER);
  const buttons = template.components.find((c) => c.type === TemplateComponentType.BUTTONS);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <MessageSquareIcon className="size-4" aria-hidden="true" />
            </span>
            معاينة WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-sm rounded-2xl bg-muted/40 bg-grid-pattern p-4">
            <div className="flex justify-start">
              <div className="max-w-[85%] overflow-hidden rounded-2xl rounded-ss-sm bg-card shadow-2xs ring-1 ring-foreground/5">
                <div className="p-3">
                  {header?.text && (
                    <p className="mb-2 text-sm font-semibold">{header.text}</p>
                  )}
                  {body?.text && (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{body.text}</p>
                  )}
                  {footer?.text && (
                    <p className="mt-2 text-xs text-muted-foreground">{footer.text}</p>
                  )}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                    <span>12:00</span>
                    <CheckCheckIcon className="size-3.5 text-sky-500" aria-hidden="true" />
                  </div>
                </div>
                {buttons?.buttons?.length ? (
                  <div className="flex flex-col border-t">
                    {buttons.buttons.map((btn, index) => (
                      <span
                        key={`${btn.text}-${index}`}
                        className="border-t py-2 text-center text-sm font-medium text-primary first:border-0"
                      >
                        {btn.text}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل القالب</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <FileTextIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1 text-muted-foreground">الاسم</span>
            <span dir="ltr" className="font-mono text-xs font-medium">
              {template.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <TagIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1 text-muted-foreground">التصنيف</span>
            <span>{CATEGORY_LABELS[template.category] ?? template.category}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <LanguagesIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1 text-muted-foreground">اللغة</span>
            <span dir="ltr" className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
              {template.language}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <ActivityIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1 text-muted-foreground">الحالة</span>
            <StatusBadge status={template.status} />
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <StarIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1 text-muted-foreground">جودة القالب</span>
            <StatusBadge status={template.qualityScore} />
          </div>
          {template.rejectionReason && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
              <p className="text-xs font-medium text-destructive">سبب الرفض</p>
              <p className="mt-1 text-sm">{template.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
