'use client';

import { Loader2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  const [name, setName] = useState('');
  const [urlBase, setUrlBase] = useState('https://example.com/{{1}}');
  const [phoneNumber, setPhoneNumber] = useState('');

  const createMutation = useCreateFromLibrary();

  const urlButton = useMemo(
    () => item?.buttons?.find((button) => button.type === 'URL'),
    [item],
  );
  const phoneButton = useMemo(
    () => item?.buttons?.find((button) => button.type === 'PHONE_NUMBER'),
    [item],
  );

  useEffect(() => {
    if (!item) return;
    setName(`${item.name}_${item.language}`.replace(/[^a-z0-9_]/gi, '_').toLowerCase());
    setUrlBase('https://example.com/{{1}}');
    setPhoneNumber('');
  }, [item]);

  const handleSubmit = () => {
    if (!item || !name.trim()) return;

    const buttonInputs = [];

    if (urlButton) {
      buttonInputs.push({
        type: 'URL',
        url: {
          base_url: urlBase.trim(),
          url_suffix_example: urlBase.trim().replace('{{1}}', 'demo'),
        },
      });
    }

    if (phoneButton && phoneNumber.trim()) {
      buttonInputs.push({
        type: 'PHONE_NUMBER',
        phone_number: phoneNumber.trim(),
      });
    }

    createMutation.mutate(
      {
        name: name.trim(),
        libraryTemplateName: item.name,
        language: item.language,
        ...(buttonInputs.length ? { libraryTemplateButtonInputs: buttonInputs } : {}),
      },
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
          <DialogTitle>إضافة قالب إلى حساب WhatsApp</DialogTitle>
          <DialogDescription>
            {item ? (
              <>
                يُرسل القالب لـ Meta للمراجعة. بعد الاعتماد زامن من صفحة قوالبي ثم أرسل من Inbox.
              </>
            ) : (
              'اختر قالباً من المكتبة'
            )}
          </DialogDescription>
        </DialogHeader>

        {item ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              {item.header ? <p className="mb-1 font-medium">{item.header}</p> : null}
              <p className="text-muted-foreground">{item.body}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="library-template-name">اسم القالب على حسابك *</Label>
              <Input
                id="library-template-name"
                dir="ltr"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="order_confirm_ar"
              />
            </div>

            {urlButton ? (
              <div className="space-y-1.5">
                <Label htmlFor="library-template-url">رابط الزر ({urlButton.text ?? 'URL'}) *</Label>
                <Input
                  id="library-template-url"
                  dir="ltr"
                  value={urlBase}
                  onChange={(event) => setUrlBase(event.target.value)}
                  placeholder="https://yourstore.com/orders/{{1}}"
                />
              </div>
            ) : null}

            {phoneButton ? (
              <div className="space-y-1.5">
                <Label htmlFor="library-template-phone">
                  رقم الهاتف ({phoneButton.text ?? 'Phone'}) *
                </Label>
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
            إلغاء
          </Button>
          <Button
            type="button"
            variant="gradient"
            disabled={
              !item ||
              !name.trim() ||
              (urlButton ? !urlBase.trim() : false) ||
              (phoneButton ? !phoneNumber.trim() : false) ||
              createMutation.isPending
            }
            onClick={handleSubmit}
          >
            {createMutation.isPending ? <Loader2Icon className="animate-spin" /> : 'إرسال لـ Meta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
