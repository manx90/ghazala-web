'use client';

import { Loader2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PhoneNumberSelect, usePhoneNumbers } from '@/components/shared/phone-number-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSendMessage } from '@/features/inbox/hooks/use-send-message';
import { getLanguageLabel } from '@/features/templates/constants/template-filters';
import { useTemplatesList } from '@/features/templates/hooks/use-templates';
import { TemplateStatus, type Template } from '@/types/template.types';
import { normalizePhone } from '@/utils/phone';

interface SendTemplateComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRecipient?: string;
  onSent?: (conversationId: string) => void;
}

export function SendTemplateComposeDialog({
  open,
  onOpenChange,
  defaultRecipient = '',
  onSent,
}: SendTemplateComposeDialogProps) {
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [language, setLanguage] = useState('');
  const [templateId, setTemplateId] = useState('');

  const phoneNumbersQuery = usePhoneNumbers();
  const templatesQuery = useTemplatesList({ status: TemplateStatus.APPROVED });
  const { sendTemplate, isSending } = useSendMessage();

  const approvedTemplates = templatesQuery.data?.items ?? [];

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
    if (!open) return;
    setRecipient(defaultRecipient);
    setLanguage('');
    setTemplateId('');
  }, [open, defaultRecipient]);

  useEffect(() => {
    if (phoneNumberId || !phoneNumbersQuery.data?.items.length) return;
    setPhoneNumberId(phoneNumbersQuery.data.items[0]!.phoneNumberId);
  }, [phoneNumberId, phoneNumbersQuery.data?.items]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setLanguage('');
      setTemplateId('');
    }
    onOpenChange(next);
  };

  const handleSend = async () => {
    const normalizedRecipient = normalizePhone(recipient).replace(/^\+/, '');
    if (!normalizedRecipient || !phoneNumberId || !templateId) return;

    const message = await sendTemplate({
      phoneNumberId,
      recipient: normalizedRecipient,
      templateId,
    });

    if (message.conversationId) {
      onSent?.(message.conversationId);
    }

    handleOpenChange(false);
  };

  const canSend = Boolean(recipient.trim() && phoneNumberId && templateId && !isSending);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إرسال قالب لرقم جديد</DialogTitle>
          <DialogDescription>
            ابدأ محادثة بإرسال قالب معتمد — لا حاجة لرسالة واردة مسبقة.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="compose-recipient">رقم المستلم</Label>
            <Input
              id="compose-recipient"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="218924943733"
              dir="ltr"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">صيغة دولية بدون +</p>
          </div>

          <div className="space-y-1.5">
            <Label>رقم الإرسال (WhatsApp Business)</Label>
            <PhoneNumberSelect
              value={phoneNumberId}
              onChange={setPhoneNumberId}
              className="w-full"
            />
          </div>

          {templatesQuery.isLoading ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2Icon className="me-2 size-4 animate-spin" />
              جاري تحميل القوالب...
            </div>
          ) : !approvedTemplates.length ? (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
              لا توجد قوالب معتمدة. زامن من Meta أو أضف hello_world من المكتبة.
            </p>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>اللغة</Label>
                <Select value={language} onValueChange={(value) => {
                  setLanguage(value ?? '');
                  setTemplateId('');
                }}>
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
                  <p className="text-muted-foreground">{getTemplatePreview(selectedTemplate)}</p>
                </div>
              ) : null}
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            type="button"
            variant="gradient"
            disabled={!canSend}
            onClick={() => void handleSend()}
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

function getTemplatePreview(template: Template): string {
  const body = template.components.find((component) => component.type === 'BODY');
  return body?.text ?? '—';
}
