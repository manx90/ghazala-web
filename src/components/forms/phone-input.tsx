'use client';

import { forwardRef } from 'react';
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

const COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: 'SA', name: 'السعودية', dial: '+966' },
  { code: 'AE', name: 'الإمارات', dial: '+971' },
  { code: 'EG', name: 'مصر', dial: '+20' },
  { code: 'KW', name: 'الكويت', dial: '+965' },
  { code: 'QA', name: 'قطر', dial: '+974' },
  { code: 'BH', name: 'البحرين', dial: '+973' },
  { code: 'OM', name: 'عمان', dial: '+968' },
  { code: 'JO', name: 'الأردن', dial: '+962' },
  { code: 'PS', name: 'فلسطين', dial: '+970' },
  { code: 'LB', name: 'لبنان', dial: '+961' },
  { code: 'IQ', name: 'العراق', dial: '+964' },
  { code: 'SY', name: 'سوريا', dial: '+963' },
  { code: 'YE', name: 'اليمن', dial: '+967' },
  { code: 'SD', name: 'السودان', dial: '+249' },
  { code: 'LY', name: 'ليبيا', dial: '+218' },
  { code: 'TN', name: 'تونس', dial: '+216' },
  { code: 'DZ', name: 'الجزائر', dial: '+213' },
  { code: 'MA', name: 'المغرب', dial: '+212' },
  { code: 'MR', name: 'موريتانيا', dial: '+222' },
];

interface CountrySelectorProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  return (
    <select
      className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="اختر الدولة"
    >
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name} ({c.dial})
        </option>
      ))}
    </select>
  );
}

export { COUNTRIES };
export { Input as TextInput };
