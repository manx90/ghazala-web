'use client';

import { Loader2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ImportContactRow } from '@/types/contact.types';

const MAX_IMPORT_ROWS = 5000;

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (rows: ImportContactRow[]) => void;
  isLoading?: boolean;
}

function parseContactsInput(raw: string): ImportContactRow[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index) => !(index === 0 && line.toLowerCase().startsWith('phone')))
    .map((line) => {
      const [phone = '', firstName = '', lastName = '', profileName = '', tags = ''] = line
        .split(',')
        .map((p) => p.trim());
      const parsedTags = tags
        .split('|')
        .map((tag) => tag.trim())
        .filter(Boolean);
      return {
        phone,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        profileName: profileName || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      };
    })
    .filter((row) => row.phone.length > 0);
}

export function ImportContactsDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ImportContactsDialogProps) {
  const t = useTranslations('contacts.import');
  const tCommon = useTranslations('common');
  const [raw, setRaw] = useState('');
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setRaw('');
  }

  const rows = useMemo(() => parseContactsInput(raw), [raw]);
  const tooMany = rows.length > MAX_IMPORT_ROWS;

  const handleSubmit = () => {
    if (rows.length === 0 || tooMany) return;
    onConfirm(rows);
  };

  return (
    <ModalWrapper open={open} onOpenChange={onOpenChange} title={t('title')} description={t('description')}>
      <div className="flex flex-col gap-3 py-2">
        <Textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={t('placeholder')}
          rows={8}
          dir="ltr"
          className="font-mono text-sm"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          {tooMany
            ? t('tooMany', { max: MAX_IMPORT_ROWS })
            : t('detectedCount', { count: rows.length })}
        </p>
        {raw.trim().length > 0 && rows.length === 0 ? (
          <p className="text-xs text-destructive">{t('noValidRows')}</p>
        ) : null}
      </div>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
          {tCommon('cancel')}
        </Button>
        <Button
          variant="gradient"
          onClick={handleSubmit}
          disabled={isLoading || rows.length === 0 || tooMany}
        >
          {isLoading && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
          {t('submit')}
        </Button>
      </div>
    </ModalWrapper>
  );
}
