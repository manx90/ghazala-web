'use client';

import { forwardRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import type { InputHTMLAttributes } from 'react';

export const PasswordField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function PasswordField(
  { className, ...props },
  ref,
) {
  const t = useTranslations('common.forms');
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={className}
        autoComplete="current-password"
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          variant="ghost"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('hidePassword') : t('showPassword')}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
});
