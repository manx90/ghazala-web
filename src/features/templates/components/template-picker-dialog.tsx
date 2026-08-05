'use client';

import { Loader2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLanguageLabel } from '@/features/templates/constants/template-filters';
import { useTemplatesList } from '@/features/templates/hooks/use-templates';
import { getTemplateBodyPreview } from '@/features/templates/utils/template-preview';
import { filterSendableTemplates } from '@/features/templates/utils/template-sendable';
import { TemplateStatus, type Template } from '@/types/template.types';

interface TemplatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: Template) => void;
  wabaId?: string;
  isSending?: boolean;
}

export function TemplatePickerDialog({
  open,
  onOpenChange,
  onSelect,
  wabaId,
  isSending,
}: TemplatePickerDialogProps) {
  const [language, setLanguage] = useState('');
  const [templateId, setTemplateId] = useState('');

  const templatesQuery = useTemplatesList({ status: TemplateStatus.APPROVED });

  const approvedTemplates = useMemo(() => {
    const items = templatesQuery.data?.items ?? [];
    const sendable = filterSendableTemplates(items);
    if (!wabaId) return sendable;
    return sendable.filter((item) => item.wabaId === wabaId);
  }, [templatesQuery.data?.items, wabaId]);

  const languages = useMemo(() => {
    const codes = [...new Set(approvedTemplates.map((item) => item.language))].sort();
    return codes;
  }, [approvedTemplates]);

  const templatesForLanguage = useMemo(
    () => approvedTemplates.filter((item) => item.language === language),
    [approvedTemplates, language],
  );

  const selectedTemplate = templatesForLanguage.find((item) => item.id === templateId);

  const handleLanguageChange = (value: string | null) => {
    const next = value ?? '';
    setLanguage(next);
    setTemplateId('');
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setLanguage('');
      setTemplateId('');
    }
    onOpenChange(next);
  };

  const handleSend = () => {
    if (!selectedTemplate) return;
    onSelect(selectedTemplate);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إرسال قالب</DialogTitle>
          <DialogDescription>اختر اللغة ثم القالب المعتمد للإرسال.</DialogDescription>
        </DialogHeader>

        {templatesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            <Loader2Icon className="me-2 size-4 animate-spin" />
            جاري تحميل القوالب...
          </div>
        ) : !approvedTemplates.length ? (
          <p className="py-4 text-sm text-muted-foreground">
            {wabaId
              ? 'لا توجد قوالب معتمدة على Meta لهذا الحساب — أضف من مكتبة Meta ثم زامن.'
              : 'لا توجد قوالب جاهزة للإرسال. أضف من مكتبة Meta ثم زامن بعد الاعتماد.'}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>اللغة</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللغة" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((code) => (
                    <SelectItem key={code} value={code}>
                      {getLanguageLabel(code)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>القالب</Label>
              <Select
                value={templateId}
                onValueChange={(value) => setTemplateId(value ?? '')}
                disabled={!language}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language ? 'اختر القالب' : 'اختر اللغة أولاً'} />
                </SelectTrigger>
                <SelectContent>
                  {templatesForLanguage.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {formatTemplateOption(template)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate ? (
              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <p dir="ltr" className="mb-1 font-mono text-xs text-muted-foreground">
                  {selectedTemplate.name}
                </p>
                <p className="text-muted-foreground">{getTemplateBodyPreview(selectedTemplate)}</p>
              </div>
            ) : null}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            type="button"
            variant="gradient"
            disabled={!selectedTemplate || isSending}
            onClick={handleSend}
          >
            {isSending ? <Loader2Icon className="animate-spin" /> : 'إرسال القالب'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatTemplateOption(template: Template): string {
  return `${template.name} (${template.language})`;
}
