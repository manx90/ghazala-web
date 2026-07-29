'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import type { InputHTMLAttributes } from 'react';

export const DatePicker = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function DatePicker(
  { className, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="date"
      className={className}
      {...props}
    />
  );
});

export const TimePicker = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TimePicker(
  { className, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="time"
      className={className}
      {...props}
    />
  );
});

interface RadioGroupProps {
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({ options, value, onChange, name, disabled, className, orientation = 'vertical' }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={className}
    >
      <div className={orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2'}>
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className="flex cursor-pointer items-start gap-2 text-sm"
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                checked={value === opt.value}
                disabled={disabled}
                onChange={() => onChange(opt.value)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span className="flex flex-col">
                <span className="font-medium">{opt.label}</span>
                {opt.description && <span className="text-xs text-muted-foreground">{opt.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
