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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateFromLibrary } from '@/features/templates/hooks/use-templates';
import {
  buildCreateFromLibraryPayload,
  canSubmitLibraryTemplate,
  getRequiredConfigurableButtons,
  getUnsupportedLibraryButtons,
  isAuthenticationLibraryItem,
} from '@/features/templates/utils/library-template';
import type { TemplateLibraryItem } from '@/types/template.types';

interface AddLibraryTemplateDialogProps {
  item: TemplateLibraryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddLibraryTemplateDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: AddLibraryTemplateDialogProps) {
  const t = useTranslations('templates.addLibrary');
  const tCommon = useTranslations('common');
  const [name, setName] = useState('');
  const [urlBase, setUrlBase] = useState('https://example.com/{{1}}');
  const [phoneNumber, setPhoneNumber] = useState('');

  const createMutation = useCreateFromLibrary();

  const isAuthentication = item ? isAuthenticationLibraryItem(item) : false;
  const unsupportedButtons = useMemo(
    () => (item ? getUnsupportedLibraryButtons(item) : []),
    [item],
  );
  const requiredButtons = useMemo(
    () => (item ? getRequiredConfigurableButtons(item) : { url: false, phone: false }),
    [item],
  );

  const submitCheck = useMemo(() => {
    if (!item) return { ok: false as const, code: undefined };
    return canSubmitLibraryTemplate({ item, name, urlBase, phoneNumber });
  }, [item, name, urlBase, phoneNumber]);

  useEffect(() => {
    if (!item) return;
    setName(`${item.name}_${item.language}`.replace(/[^a-z0-9_]/gi, '_').toLowerCase());
    setUrlBase('https://example.com/{{1}}');
    setPhoneNumber('');
  }, [item]);

  const handleSubmit = () => {
    if (!item || !submitCheck.ok) return;

    createMutation.mutate(
      buildCreateFromLibraryPayload({
        name: name.trim(),
        item,
        urlBase,
        phoneNumber,
      }),
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {item ? t('description') : t('selectFromLibrary')}
          </DialogDescription>
        </DialogHeader>

        {item ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              {item.header ? <p className="mb-1 font-medium">{item.header}</p> : null}
              <p className="text-muted-foreground">{item.body}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="library-template-name">{t('templateName')}</Label>
              <Input
                id="library-template-name"
                dir="ltr"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="order_confirm_ar"
              />
            </div>

            {isAuthentication ? (
              <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 px-3 py-2 text-sm text-sky-950 dark:text-sky-100">
                {t('authTemplate')}
              </div>
            ) : null}

            {unsupportedButtons.length ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
                {t('unsupportedButtons', {
                  types: unsupportedButtons.map((button) => button.type).join(', '),
                })}
              </div>
            ) : null}

            {requiredButtons.url ? (
              <div className="space-y-1.5">
                <Label htmlFor="library-template-url">{t('buttonUrl')}</Label>
                <Input
                  id="library-template-url"
                  dir="ltr"
                  value={urlBase}
                  onChange={(event) => setUrlBase(event.target.value)}
                  placeholder="https://yourstore.com/orders/{{1}}"
                />
              </div>
            ) : null}

            {requiredButtons.phone ? (
              <div className="space-y-1.5">
                <Label htmlFor="library-template-phone">{t('buttonPhone')}</Label>
                <Input
                  id="library-template-phone"
                  dir="ltr"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+966501234567"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon('cancel')}
          </Button>
          <Button
            type="button"
            variant="gradient"
            disabled={!item || !submitCheck.ok || createMutation.isPending}
            onClick={handleSubmit}
          >
            {createMutation.isPending ? <Loader2Icon className="animate-spin" /> : t('submitToMeta')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
