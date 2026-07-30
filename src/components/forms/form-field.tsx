'use client';

import { type ReactNode, useId } from 'react';
import { type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps<T extends FieldValues, K extends FieldPath<T>> {
  name: K;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: (field: { id: string; invalid: boolean }) => ReactNode;
}

export function FormField<T extends FieldValues, K extends FieldPath<T>>({
  name,
  label,
  description,
  required,
  className,
  children,
}: FormFieldProps<T, K>) {
  const { formState: { errors } } = useFormContext<T>();
  const generatedId = useId();
  const id = `field-${name.toString()}-${generatedId}`;
  const error = errors[name]?.message as string | undefined;
  const invalid = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {children({ id, invalid })}
      {description && !error && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}
      {error && (
        <p role="alert" className="animate-fade-in text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormLayout({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-5', className)}>{children}</div>;
}

export function FormRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2', className)}>{children}</div>;
}
