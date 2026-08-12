'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Building2Icon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContainer } from '@/components/global/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormField } from '@/features/auth/components/form-field';
import { useCreateOrganization } from '@/features/onboarding/hooks/use-create-organization';
import {
  COUNTRY_OPTIONS,
  TIMEZONE_OPTIONS,
  createOrganizationSchema,
  type CreateOrganizationFormValues,
} from '@/features/onboarding/schemas/onboarding.schemas';
import { generateSlugFromName } from '@/features/onboarding/utils/slug';

export function CreateOrganizationForm() {
  const t = useTranslations('onboarding.createOrganization');
  const tOnboarding = useTranslations('onboarding');
  const tVal = useTranslations('validation');
  const createOrganization = useCreateOrganization();

  const schema = useMemo(() => createOrganizationSchema((k) => tVal(k)), [tVal]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      timezone: 'Asia/Riyadh',
      country: 'SA',
    },
  });

  const name = watch('name');
  const timezone = watch('timezone');
  const country = watch('country');

  useEffect(() => {
    if (name) {
      setValue('slug', generateSlugFromName(name), { shouldValidate: true });
    }
  }, [name, setValue]);

  const onSubmit = handleSubmit((values) => {
    createOrganization.mutate(values);
  });

  return (
    <PageContainer size="sm" className="max-w-lg py-10">
      <Card className="glass-strong animate-fade-in-up shadow-xl">
        <CardHeader className="flex flex-col items-center gap-3 pt-8 text-center">
          <span className="bg-gradient-brand glow-brand flex size-14 items-center justify-center rounded-2xl text-primary-foreground shadow-lg">
            <Building2Icon className="size-7" aria-hidden="true" />
          </span>
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <FormField id="name" label={t('orgName')} error={errors.name?.message}>
              <Input
                id="name"
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
            </FormField>

            <FormField id="slug" label={t('slug')} error={errors.slug?.message}>
              <Input
                id="slug"
                dir="ltr"
                className="text-left"
                aria-invalid={Boolean(errors.slug)}
                {...register('slug')}
              />
            </FormField>

            <FormField id="timezone" label={t('timezone')} error={errors.timezone?.message}>
              <Select
                value={timezone}
                onValueChange={(value) => setValue('timezone', value ?? '', { shouldValidate: true })}
              >
                <SelectTrigger id="timezone" className="w-full">
                  <SelectValue placeholder={t('selectTimezone')} />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {tOnboarding(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="country" label={t('country')} error={errors.country?.message}>
              <Select
                value={country}
                onValueChange={(value) => setValue('country', value ?? '', { shouldValidate: true })}
              >
                <SelectTrigger id="country" className="w-full">
                  <SelectValue placeholder={t('selectCountry')} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {tOnboarding(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="mt-1 w-full"
              disabled={createOrganization.isPending}
            >
              {createOrganization.isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  {t('creating')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
