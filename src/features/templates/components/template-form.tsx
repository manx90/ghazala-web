'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { queryKeys } from '@/config/query-keys';
import {
  templateFormSchema,
  type TemplateFormValues,
} from '@/features/templates/schemas/template.schemas';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import { TemplateCategory, TemplateComponentType } from '@/types/template.types';
import type { CreateTemplatePayload } from '@/types/template.types';

const CATEGORY_OPTIONS = [
  { value: TemplateCategory.MARKETING, label: 'تسويق' },
  { value: TemplateCategory.UTILITY, label: 'خدمي' },
  { value: TemplateCategory.AUTHENTICATION, label: 'مصادقة' },
];

interface TemplateFormProps {
  onSubmit: (payload: CreateTemplatePayload) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function toCreateTemplatePayload(values: TemplateFormValues): CreateTemplatePayload {
  const components = [];

  if (values.headerText?.trim()) {
    components.push({
      type: TemplateComponentType.HEADER,
      format: 'TEXT',
      text: values.headerText.trim(),
    });
  }

  components.push({
    type: TemplateComponentType.BODY,
    text: values.bodyText.trim(),
  });

  if (values.footerText?.trim()) {
    components.push({
      type: TemplateComponentType.FOOTER,
      text: values.footerText.trim(),
    });
  }

  return {
    wabaId: values.wabaId || undefined,
    name: values.name.trim(),
    category: values.category,
    language: values.language.trim(),
    components,
  };
}

export function TemplateForm({ onSubmit, isLoading = false, onCancel }: TemplateFormProps) {
  const { data: wabaData } = useQuery({
    queryKey: queryKeys.whatsapp.businessAccounts,
    queryFn: () => whatsappApi.listBusinessAccounts(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      wabaId: '',
      name: '',
      category: TemplateCategory.UTILITY,
      language: 'ar',
      bodyText: '',
      headerText: '',
      footerText: '',
    },
  });

  const category = watch('category');
  const wabaId = watch('wabaId');

  const handleFormSubmit = (values: TemplateFormValues) => {
    onSubmit(toCreateTemplatePayload(values));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex max-w-2xl flex-col gap-4">
      {wabaData?.items.length ? (
        <div className="flex flex-col gap-1.5">
          <Label>حساب WhatsApp Business</Label>
          <Select value={wabaId} onValueChange={(value) => setValue('wabaId', value ?? '')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر الحساب" />
            </SelectTrigger>
            <SelectContent>
              {wabaData.items.map((account) => (
                <SelectItem key={account.id} value={account.wabaId}>
                  {account.name ?? account.wabaId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">اسم القالب *</Label>
          <Input
            id="name"
            dir="ltr"
            placeholder="welcome_message"
            {...register('name')}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="language">رمز اللغة *</Label>
          <Input id="language" dir="ltr" placeholder="ar" {...register('language')} />
          {errors.language && (
            <p className="text-xs text-destructive">{errors.language.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>التصنيف *</Label>
        <Select
          value={category}
          onValueChange={(value) => setValue('category', value as TemplateCategory)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر التصنيف" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="headerText">نص الترويسة (اختياري)</Label>
        <Input id="headerText" {...register('headerText')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bodyText">نص القالب *</Label>
        <Textarea id="bodyText" rows={5} {...register('bodyText')} aria-invalid={!!errors.bodyText} />
        {errors.bodyText && <p className="text-xs text-destructive">{errors.bodyText.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="footerText">نص التذييل (اختياري)</Label>
        <Input id="footerText" {...register('footerText')} />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          إنشاء القالب
        </Button>
      </div>
    </form>
  );
}
