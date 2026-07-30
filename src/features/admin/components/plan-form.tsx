'use client';

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
  planFormSchema,
  type PlanFormValues,
} from '@/features/admin/schemas/plan.schemas';
import type { Plan } from '@/types/billing.types';

interface PlanFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Plan;
  onSubmit: (values: PlanFormValues) => void;
  isLoading?: boolean;
}

export function PlanForm({ mode, defaultValues, onSubmit, isLoading }: PlanFormProps) {
  const isEdit = mode === 'edit';

  const methods = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: isEdit
      ? {
          name: defaultValues?.name ?? '',
          code: defaultValues?.code ?? '',
          description: defaultValues?.description ?? '',
          monthlyPrice: defaultValues ? Number(defaultValues.monthlyPrice) : 0,
          yearlyPrice: defaultValues ? Number(defaultValues.yearlyPrice) : 0,
          currency: defaultValues?.currency ?? 'SAR',
          isActive: defaultValues?.isActive ?? true,
        }
      : {
          name: '',
          code: '',
          description: '',
          monthlyPrice: 0,
          yearlyPrice: 0,
          currency: 'SAR',
          isActive: true,
        },
  });

  const { register, handleSubmit, setValue, watch } = methods;
  const isActive = watch('isActive');

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">المعلومات الأساسية</CardTitle>
            <CardDescription>الاسم والرمز والوصف كما تظهر للعملاء</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <FormField name="name" label="اسم الخطة" required>
              {({ id, invalid }) => <Input id={id} {...register('name')} placeholder="Professional" aria-invalid={invalid} />}
            </FormField>

            {!isEdit ? (
              <FormField name="code" label="الرمز" description="أحرف صغيرة وأرقام وشرطات فقط" required>
                {({ id, invalid }) => <Input id={id} {...register('code')} placeholder="pro" dir="ltr" aria-invalid={invalid} />}
              </FormField>
            ) : (
              <input type="hidden" {...register('code')} />
            )}

            <FormField name="description" label="الوصف">
              {({ id }) => <Textarea id={id} {...register('description')} rows={3} />}
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">التسعير</CardTitle>
            <CardDescription>أسعار الاشتراك الشهري والسنوي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="monthlyPrice" label="السعر الشهري" required>
                {({ id, invalid }) => (
                  <Input id={id} type="number" min={0} step="0.01" dir="ltr" {...register('monthlyPrice')} aria-invalid={invalid} />
                )}
              </FormField>
              <FormField name="yearlyPrice" label="السعر السنوي" required>
                {({ id, invalid }) => (
                  <Input id={id} type="number" min={0} step="0.01" dir="ltr" {...register('yearlyPrice')} aria-invalid={invalid} />
                )}
              </FormField>
              <FormField name="currency" label="العملة">
                {({ id }) => <Input id={id} maxLength={3} dir="ltr" {...register('currency')} />}
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
                    <Label htmlFor="isActive">نشطة</Label>
                    <p className="text-xs text-muted-foreground">إظهار الخطة للعملاء</p>
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
            {isLoading ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إنشاء الخطة'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
