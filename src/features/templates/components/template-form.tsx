'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
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
  createTemplateFormSchema,
  type TemplateFormValues,
} from '@/features/templates/schemas/template.schemas';
import { enrichTemplateComponents } from '@/features/templates/utils/template-meta-payload';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import { TemplateCategory, TemplateComponentType } from '@/types/template.types';
import type { CreateTemplatePayload } from '@/types/template.types';

const CATEGORY_VALUES = [
  TemplateCategory.MARKETING,
  TemplateCategory.UTILITY,
  TemplateCategory.AUTHENTICATION,
] as const;

interface TemplateFormProps {
  onSubmit: (payload: CreateTemplatePayload) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function toCreateTemplatePayload(values: TemplateFormValues): CreateTemplatePayload {
  const language = values.language.trim();
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
    language,
    components: enrichTemplateComponents(components, language),
  };
}

export function TemplateForm({ onSubmit, isLoading = false, onCancel }: TemplateFormProps) {
  const t = useTranslations('templates.form');
  const tCommon = useTranslations('common');
  const tTemplates = useTranslations('templates');
  const schema = useMemo(() => createTemplateFormSchema(tTemplates), [tTemplates]);

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
    resolver: zodResolver(schema),
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-4 w-1 rounded-full bg-gradient-brand" aria-hidden="true" />
          {t('basicInfo')}
        </h3>

        {wabaData?.items.length ? (
          <div className="flex flex-col gap-1.5">
            <Label>{t('wabaAccount')}</Label>
            <Select value={wabaId} onValueChange={(value) => setValue('wabaId', value ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectAccount')} />
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t('templateName')}</Label>
            <Input
              id="name"
              dir="ltr"
              placeholder="welcome_message"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">{t('nameHint')}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="language">{t('languageCode')}</Label>
            <Input id="language" dir="ltr" placeholder="ar" {...register('language')} />
            {errors.language ? (
              <p className="text-xs text-destructive">{errors.language.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">{t('languageHint')}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t('category')}</Label>
          <Select
            value={category}
            onValueChange={(value) => setValue('category', value as TemplateCategory)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {tTemplates(`categories.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category ? (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">{t('categoryHint')}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t pt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-4 w-1 rounded-full bg-gradient-brand" aria-hidden="true" />
          {t('content')}
        </h3>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="headerText">{t('headerOptional')}</Label>
          <Input id="headerText" {...register('headerText')} aria-invalid={!!errors.headerText} />
          {errors.headerText ? (
            <p className="text-xs text-destructive">{errors.headerText.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bodyText">{t('body')}</Label>
          <Textarea id="bodyText" rows={5} {...register('bodyText')} aria-invalid={!!errors.bodyText} />
          {errors.bodyText ? (
            <p className="text-xs text-destructive">{errors.bodyText.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">{t('bodyHint')}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="footerText">{t('footerOptional')}</Label>
          <Input id="footerText" {...register('footerText')} />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {tCommon('cancel')}
          </Button>
        )}
        <Button type="submit" variant="gradient" disabled={isLoading}>
          {isLoading && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
          {t('createTemplate')}
        </Button>
      </div>
    </form>
  );
}
