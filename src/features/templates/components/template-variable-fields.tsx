'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { getTemplateVariableFields } from '@/features/templates/utils/template-variables';
import type { Template } from '@/types/template.types';

interface TemplateVariableFieldsProps {
  template: Template;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export function TemplateVariableFields({ template, values, onChange }: TemplateVariableFieldsProps) {
  const t = useTranslations('templates.variables');
  const fields = getTemplateVariableFields(template);

  const getFieldLabel = (field: (typeof fields)[number]) => {
    if (field.labelKey.endsWith('Numbered')) {
      return t(field.labelKey, { paramNumber: field.paramNumber });
    }
    return t(field.labelKey);
  };

  if (!fields.length) return null;

  return (
    <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
      <p className="text-sm font-medium">{t('title')}</p>
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={`template-var-${field.key}`}>{getFieldLabel(field)}</Label>
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
