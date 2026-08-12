'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/forms/form-field';
import {
  createPlanSchema,
  type PlanFormInputValues,
  type PlanFormValues,
} from '@/features/admin/schemas/plan.schemas';
import type { Plan } from '@/types/billing.types';
import { DEFAULT_CURRENCY } from '@/config/currency';

interface PlanFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Plan;
  onSubmit: (values: PlanFormValues) => void;
  isLoading?: boolean;
}

export function PlanForm({ mode, defaultValues, onSubmit, isLoading }: PlanFormProps) {
  const t = useTranslations('admin.plans.form');
  const tValidation = useTranslations('admin.plans.validation');
  const isEdit = mode === 'edit';

  const schema = useMemo(
    () => createPlanSchema((k) => tValidation(k)),
    [tValidation],
  );

  const methods = useForm<PlanFormInputValues, unknown, PlanFormValues>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          name: defaultValues?.name ?? '',
          code: defaultValues?.code ?? '',
          description: defaultValues?.description ?? '',
          monthlyPrice: defaultValues ? Number(defaultValues.monthlyPrice) : 0,
          yearlyPrice: defaultValues ? Number(defaultValues.yearlyPrice) : 0,
          currency: defaultValues?.currency ?? DEFAULT_CURRENCY,
          isActive: defaultValues?.isActive ?? true,
          maxMessagesMonthly: defaultValues?.maxMessagesMonthly ?? null,
          maxContacts: defaultValues?.maxContacts ?? null,
          maxTeamMembers: defaultValues?.maxTeamMembers ?? null,
          maxPhoneNumbers: defaultValues?.maxPhoneNumbers ?? null,
          whopPlanIdMonthly: defaultValues?.whopPlanIdMonthly ?? '',
          whopPlanIdYearly: defaultValues?.whopPlanIdYearly ?? '',
        }
      : {
          name: '',
          code: '',
          description: '',
          monthlyPrice: 0,
          yearlyPrice: 0,
          currency: DEFAULT_CURRENCY,
          isActive: true,
          maxMessagesMonthly: null,
          maxContacts: null,
          maxTeamMembers: null,
          maxPhoneNumbers: null,
          whopPlanIdMonthly: '',
          whopPlanIdYearly: '',
        },
  });

  const { register, handleSubmit, setValue, watch } = methods;
  const isActive = watch('isActive');

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('basicInfo')}</CardTitle>
            <CardDescription>{t('codeDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <FormField name="name" label={t('name')} required>
              {({ id, invalid }) => <Input id={id} {...register('name')} placeholder="Professional" aria-invalid={invalid} />}
            </FormField>

            {!isEdit ? (
              <FormField name="code" label={t('code')} description={t('codeDescription')} required>
                {({ id, invalid }) => <Input id={id} {...register('code')} placeholder="pro" dir="ltr" aria-invalid={invalid} />}
              </FormField>
            ) : (
              <input type="hidden" {...register('code')} />
            )}

            <FormField name="description" label={t('description')}>
              {({ id }) => <Textarea id={id} {...register('description')} rows={3} />}
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('pricing')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="monthlyPrice" label={t('monthlyPrice')} required>
                {({ id, invalid }) => (
                  <Input id={id} type="number" min={0} step="0.01" dir="ltr" {...register('monthlyPrice')} aria-invalid={invalid} />
                )}
              </FormField>
              <FormField name="yearlyPrice" label={t('yearlyPrice')} required>
                {({ id, invalid }) => (
                  <Input id={id} type="number" min={0} step="0.01" dir="ltr" {...register('yearlyPrice')} aria-invalid={invalid} />
                )}
              </FormField>
              <FormField name="currency" label={t('currency')}>
                {({ id }) => <Input id={id} maxLength={3} dir="ltr" {...register('currency')} />}
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('limits')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="maxMessagesMonthly" label={t('maxMessages')}>
                {({ id }) => (
                  <Input id={id} type="number" min={0} dir="ltr" placeholder={t('unlimitedPlaceholder')} {...register('maxMessagesMonthly')} />
                )}
              </FormField>
              <FormField name="maxContacts" label={t('maxContacts')}>
                {({ id }) => (
                  <Input id={id} type="number" min={0} dir="ltr" placeholder={t('unlimitedPlaceholder')} {...register('maxContacts')} />
                )}
              </FormField>
              <FormField name="maxTeamMembers" label={t('maxTeamMembers')}>
                {({ id }) => (
                  <Input id={id} type="number" min={0} dir="ltr" placeholder={t('unlimitedPlaceholder')} {...register('maxTeamMembers')} />
                )}
              </FormField>
              <FormField name="maxPhoneNumbers" label={t('maxPhoneNumbers')}>
                {({ id }) => (
                  <Input id={id} type="number" min={0} dir="ltr" placeholder={t('unlimitedPlaceholder')} {...register('maxPhoneNumbers')} />
                )}
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('whop')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="whopPlanIdMonthly" label={`${t('whop')} (${t('monthlyPrice')})`}>
                {({ id }) => (
                  <Input id={id} dir="ltr" placeholder="plan_..." {...register('whopPlanIdMonthly')} />
                )}
              </FormField>
              <FormField name="whopPlanIdYearly" label={`${t('whop')} (${t('yearlyPrice')})`}>
                {({ id }) => (
                  <Input id={id} dir="ltr" placeholder="plan_..." {...register('whopPlanIdYearly')} />
                )}
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField name="isActive">
              {() => (
                <div className="flex items-center justify-between rounded-xl bg-gradient-brand-soft p-4 ring-1 ring-primary/10">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="isActive">{t('active')}</Label>
                    <p className="text-xs text-muted-foreground">{t('visibleToCustomers')}</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive ?? true}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>
              )}
            </FormField>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="gradient" size="lg" disabled={isLoading}>
            {isLoading ? t('saving') : isEdit ? t('saveChanges') : t('create')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
