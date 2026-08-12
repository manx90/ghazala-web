'use client';

import { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Input } from '@/components/ui/input';
import type { InputHTMLAttributes } from 'react';

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  defaultCountryCode?: string;
}

const DEFAULT_CODE = '+966';

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { defaultCountryCode = DEFAULT_CODE, className, ...props },
  ref,
) {
  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>{defaultCountryCode}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        ref={ref}
        type="tel"
        inputMode="tel"
        dir="ltr"
        placeholder="5xxxxxxxx"
        className={className}
        {...props}
      />
    </InputGroup>
  );
});

const COUNTRY_CODES = [
  'SA', 'AE', 'EG', 'KW', 'QA', 'BH', 'OM', 'JO', 'PS', 'LB', 'IQ', 'SY', 'YE', 'SD', 'LY', 'TN', 'DZ', 'MA', 'MR',
] as const;

const COUNTRY_DIALS: Record<(typeof COUNTRY_CODES)[number], string> = {
  SA: '+966',
  AE: '+971',
  EG: '+20',
  KW: '+965',
  QA: '+974',
  BH: '+973',
  OM: '+968',
  JO: '+962',
  PS: '+970',
  LB: '+961',
  IQ: '+964',
  SY: '+963',
  YE: '+967',
  SD: '+249',
  LY: '+218',
  TN: '+216',
  DZ: '+213',
  MA: '+212',
  MR: '+222',
};

interface CountrySelectorProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const t = useTranslations('common.countries');
  const tForms = useTranslations('common.forms');

  return (
    <select
      className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={tForms('selectCountry')}
    >
      {COUNTRY_CODES.map((code) => (
        <option key={code} value={code}>
          {t(code)} ({COUNTRY_DIALS[code]})
        </option>
      ))}
    </select>
  );
}

export { COUNTRY_CODES as COUNTRIES, COUNTRY_DIALS };
export { Input as TextInput };
