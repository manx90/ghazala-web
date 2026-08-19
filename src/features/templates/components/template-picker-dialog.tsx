'use client';

import { Loader2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { TemplateVariableFields } from '@/features/templates/components/template-variable-fields';
import { getLanguageLabel } from '@/features/templates/constants/template-filters';
import { useTemplatesList } from '@/features/templates/hooks/use-templates';
import { getTemplateBodyPreview } from '@/features/templates/utils/template-preview';
import { filterSendableTemplates } from '@/features/templates/utils/template-sendable';
import {
  areTemplateVariablesFilled,
  buildTemplateSendComponents,
} from '@/features/templates/utils/template-variables';
import { TemplateStatus, type Template } from '@/types/template.types';
import type { SendTemplateMessagePayload } from '@/types/message.types';

interface TemplatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (
    template: Template,
    components?: SendTemplateMessagePayload['components'],
  ) => void;
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
  const t = useTranslations('templates.picker');
  const tCommon = useTranslations('common');
  const tTemplates = useTranslations('templates');
  const [language, setLanguage] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

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

  useEffect(() => {
    setVariableValues({});
  }, [templateId]);

  const handleLanguageChange = (value: string | null) => {
    const next = value ?? '';
    setLanguage(next);
    setTemplateId('');
    setVariableValues({});
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setLanguage('');
      setTemplateId('');
      setVariableValues({});
    }
    onOpenChange(next);
  };

  const canSend =
    Boolean(selectedTemplate) &&
    (!selectedTemplate || areTemplateVariablesFilled(selectedTemplate, variableValues)) &&
    !isSending;

  const handleSend = () => {
    if (!selectedTemplate || !canSend) return;
    const components = buildTemplateSendComponents(selectedTemplate, variableValues);
    onSelect(selectedTemplate, components);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {templatesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            <Loader2Icon className="me-2 size-4 animate-spin" />
            {t('loading')}
          </div>
        ) : !approvedTemplates.length ? (
          <p className="py-4 text-sm text-muted-foreground">
            {wabaId ? t('noTemplatesWaba') : t('noTemplates')}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('language')}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((code) => (
                    <SelectItem key={code} value={code}>
                      {getLanguageLabel(code, tTemplates)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('template')}</Label>
              <Select
                value={templateId}
                onValueChange={(value) => setTemplateId(value ?? '')}
                disabled={!language}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language ? t('selectTemplate') : t('selectLanguageFirst')} />
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
              <>
                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <p dir="ltr" className="mb-1 font-mono text-xs text-muted-foreground">
                    {selectedTemplate.name}
                  </p>
                  <p className="text-muted-foreground">{getTemplateBodyPreview(selectedTemplate)}</p>
                </div>
                <TemplateVariableFields
                  template={selectedTemplate}
                  values={variableValues}
                  onChange={setVariableValues}
                />
              </>
            ) : null}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            {tCommon('cancel')}
          </Button>
          <Button type="button" variant="gradient" disabled={!canSend} onClick={handleSend}>
            {isSending ? <Loader2Icon className="animate-spin" /> : t('sendTemplate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatTemplateOption(template: Template): string {
  return `${template.name} (${template.language})`;
}
