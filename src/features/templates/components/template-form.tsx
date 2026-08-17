'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  TEMPLATE_BUTTON_TYPES,
  type TemplateButtonFormType,
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

const MAX_TEMPLATE_BUTTONS = 3;

const DEFAULT_BUTTON: TemplateFormValues['buttons'][number] = {
  type: 'QUICK_REPLY',
  text: '',
  url: '',
  phone_number: '',
};

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

  const buttons = (values.buttons ?? [])
    .map((button) => {
      const text = button.text.trim();
      if (!text) return null;

      const payload: {
        type: string;
        text: string;
        url?: string;
        phone_number?: string;
      } = {
        type: button.type,
        text,
      };

      if (button.type === 'URL') {
        payload.url = button.url?.trim();
      }

      if (button.type === 'PHONE_NUMBER') {
        payload.phone_number = button.phone_number?.trim();
      }

      return payload;
    })
    .filter((button): button is NonNullable<typeof button> => button !== null);

  if (buttons.length) {
    components.push({
      type: TemplateComponentType.BUTTONS,
      buttons,
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
    control,
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
      buttons: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'buttons',
  });

  const category = watch('category');
  const wabaId = watch('wabaId');
  const buttons = watch('buttons');

  const canAddButton = fields.length < MAX_TEMPLATE_BUTTONS;
  const hasUrlButton = buttons.some((button) => button.type === 'URL');
  const hasPhoneButton = buttons.some((button) => button.type === 'PHONE_NUMBER');

  const getDefaultButtonType = (): TemplateButtonFormType => {
    if (!hasUrlButton) return 'URL';
    if (!hasPhoneButton) return 'PHONE_NUMBER';
    return 'QUICK_REPLY';
  };

  const handleAddButton = () => {
    if (!canAddButton) return;
    append({ ...DEFAULT_BUTTON, type: getDefaultButtonType() });
  };

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

      <div className="flex flex-col gap-5 border-t pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <span className="h-4 w-1 rounded-full bg-gradient-brand" aria-hidden="true" />
            {t('buttonsOptional')}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddButton}
            disabled={!canAddButton}
          >
            <PlusIcon data-icon="inline-start" className="size-4" />
            {t('addButton')}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">{t('buttonsHint')}</p>

        {errors.buttons?.message ? (
          <p className="text-xs text-destructive">{errors.buttons.message}</p>
        ) : null}

        {fields.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
            {t('noButtons')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => {
              const buttonType = buttons[index]?.type ?? 'QUICK_REPLY';
              const buttonErrors = errors.buttons?.[index];

              return (
                <div key={field.id} className="rounded-lg border bg-muted/20 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{t('buttonNumber', { number: index + 1 })}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      aria-label={t('removeButton')}
                    >
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label>{t('buttonType')}</Label>
                      <Select
                        value={buttonType}
                        onValueChange={(value) =>
                          setValue(`buttons.${index}.type`, value as TemplateButtonFormType, {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEMPLATE_BUTTON_TYPES.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              disabled={
                                (type === 'URL' && hasUrlButton && buttonType !== 'URL') ||
                                (type === 'PHONE_NUMBER' &&
                                  hasPhoneButton &&
                                  buttonType !== 'PHONE_NUMBER')
                              }
                            >
                              {t(`buttonTypes.${type}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`button-text-${index}`}>{t('buttonText')}</Label>
                      <Input
                        id={`button-text-${index}`}
                        {...register(`buttons.${index}.text`)}
                        aria-invalid={!!buttonErrors?.text}
                      />
                      {buttonErrors?.text ? (
                        <p className="text-xs text-destructive">{buttonErrors.text.message}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">{t('buttonTextHint')}</p>
                      )}
                    </div>

                    {buttonType === 'URL' ? (
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor={`button-url-${index}`}>{t('buttonUrl')}</Label>
                        <Input
                          id={`button-url-${index}`}
                          dir="ltr"
                          placeholder="https://example.com/orders/{{1}}"
                          {...register(`buttons.${index}.url`)}
                          aria-invalid={!!buttonErrors?.url}
                        />
                        {buttonErrors?.url ? (
                          <p className="text-xs text-destructive">{buttonErrors.url.message}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">{t('buttonUrlHint')}</p>
                        )}
                      </div>
                    ) : null}

                    {buttonType === 'PHONE_NUMBER' ? (
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor={`button-phone-${index}`}>{t('buttonPhone')}</Label>
                        <Input
                          id={`button-phone-${index}`}
                          dir="ltr"
                          placeholder="+966501234567"
                          {...register(`buttons.${index}.phone_number`)}
                          aria-invalid={!!buttonErrors?.phone_number}
                        />
                        {buttonErrors?.phone_number ? (
                          <p className="text-xs text-destructive">
                            {buttonErrors.phone_number.message}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">{t('buttonPhoneHint')}</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
