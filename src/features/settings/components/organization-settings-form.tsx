'use client';

import { useEffect, useMemo, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2Icon, Loader2Icon, Settings2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  createOrganizationSettingsSchema,
  type OrganizationSettingsFormValues,
} from '@/features/settings/schemas/settings.schemas';
import {
  useOrganizationSettings,
  useUpdateOrganizationSettings,
} from '@/features/settings/hooks/use-settings';
import type { Organization } from '@/types/organization.types';

const TIMEZONE_VALUES = [
  'Asia/Riyadh',
  'Asia/Dubai',
  'Asia/Kuwait',
  'Asia/Qatar',
  'Asia/Bahrain',
  'Asia/Muscat',
  'Africa/Cairo',
  'Asia/Amman',
  'Asia/Beirut',
  'Africa/Casablanca',
  'UTC',
] as const;

const COUNTRY_VALUES = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO', 'LB', 'MA', 'TN'] as const;

function toFormValues(organization: Organization): OrganizationSettingsFormValues {
  return {
    logo: organization.logo ?? '',
    timezone: organization.timezone,
    country: organization.country,
  };
}

export function OrganizationSettingsForm() {
  const t = useTranslations('settings.organization');
  const tValidation = useTranslations('settings.validation');
  const tCommon = useTranslations('common');
  const { data, isLoading, isError, error, refetch } = useOrganizationSettings();
  const updateSettings = useUpdateOrganizationSettings();

  const schema = useMemo(
    () => createOrganizationSettingsSchema((k) => tValidation(k)),
    [tValidation],
  );

  const form = useForm<OrganizationSettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      logo: '',
      timezone: 'Asia/Riyadh',
      country: 'SA',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(toFormValues(data));
    }
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const logo = values.logo?.trim();
    await updateSettings.mutateAsync({
      ...(logo ? { logo } : {}),
      timezone: values.timezone,
      country: values.country,
    });
  });

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={false}
      emptyTitle=""
      onRetry={() => void refetch()}
    >
      {data && (
        <div className="flex flex-col gap-6">
          <Card className="stagger-in">
            <CardHeader className="flex flex-row items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                <Building2Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>{t('info.title')}</CardTitle>
                <CardDescription>{t('info.description')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('info.name')}</p>
                <p className="font-medium">{data.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('info.slug')}</p>
                <p className="font-mono text-sm" dir="ltr">{data.slug}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('info.status')}</p>
                <StatusBadge status={data.status} />
              </div>
            </CardContent>
          </Card>

          <Card className="stagger-in" style={{ '--stagger-delay': '80ms' } as CSSProperties}>
            <CardHeader className="flex flex-row items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                <Settings2Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>{t('form.title')}</CardTitle>
                <CardDescription>{t('form.description')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                  <Label htmlFor="logo">{t('form.logo')}</Label>
                  <Input
                    id="logo"
                    placeholder={t('form.logoPlaceholder')}
                    {...form.register('logo')}
                    aria-invalid={Boolean(form.formState.errors.logo)}
                  />
                  {form.formState.errors.logo && (
                    <p className="text-sm text-destructive">{form.formState.errors.logo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('form.timezone')}</Label>
                  <Select
                    value={form.watch('timezone')}
                    onValueChange={(value) =>
                      form.setValue('timezone', value as string, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="timezone" className="w-full">
                      <SelectValue placeholder={t('form.timezonePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {t(`timezones.${value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.timezone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.timezone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t('form.country')}</Label>
                  <Select
                    value={form.watch('country')}
                    onValueChange={(value) =>
                      form.setValue('country', value as string, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder={t('form.countryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {t(`countries.${value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="gradient" disabled={updateSettings.isPending}>
                    {updateSettings.isPending && <Loader2Icon className="animate-spin" />}
                    {tCommon('save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </QueryState>
  );
}
