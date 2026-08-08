'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTemplateVariableFields } from '@/features/templates/utils/template-variables';
import type { Template } from '@/types/template.types';

interface TemplateVariableFieldsProps {
  template: Template;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export function TemplateVariableFields({ template, values, onChange }: TemplateVariableFieldsProps) {
  const fields = getTemplateVariableFields(template);

  if (!fields.length) return null;

  return (
    <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
      <p className="text-sm font-medium">متغيرات القالب</p>
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={`template-var-${field.key}`}>{field.label}</Label>
          <Input
            id={`template-var-${field.key}`}
            value={values[field.key] ?? ''}
            onChange={(event) =>
              onChange({
                ...values,
                [field.key]: event.target.value,
              })
            }
            placeholder={`{{${field.paramNumber}}}`}
            dir="ltr"
            className="font-mono"
          />
        </div>
      ))}
    </div>
  );
}
