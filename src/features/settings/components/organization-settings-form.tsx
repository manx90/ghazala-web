'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
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
  organizationSettingsSchema,
  type OrganizationSettingsFormValues,
} from '@/features/settings/schemas/settings.schemas';
import {
  useOrganizationSettings,
  useUpdateOrganizationSettings,
} from '@/features/settings/hooks/use-settings';
import type { Organization } from '@/types/organization.types';

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Riyadh', label: 'الرياض (Asia/Riyadh)' },
  { value: 'Asia/Dubai', label: 'دبي (Asia/Dubai)' },
  { value: 'Asia/Kuwait', label: 'الكويت (Asia/Kuwait)' },
  { value: 'Asia/Qatar', label: 'قطر (Asia/Qatar)' },
  { value: 'Asia/Bahrain', label: 'البحرين (Asia/Bahrain)' },
  { value: 'Asia/Muscat', label: 'مسقط (Asia/Muscat)' },
  { value: 'Africa/Cairo', label: 'القاهرة (Africa/Cairo)' },
  { value: 'Asia/Amman', label: 'عمان (Asia/Amman)' },
  { value: 'Asia/Beirut', label: 'بيروت (Asia/Beirut)' },
  { value: 'Africa/Casablanca', label: 'الدار البيضاء (Africa/Casablanca)' },
  { value: 'UTC', label: 'UTC' },
];

const COUNTRY_OPTIONS = [
  { value: 'SA', label: 'السعودية' },
  { value: 'AE', label: 'الإمارات' },
  { value: 'KW', label: 'الكويت' },
  { value: 'QA', label: 'قطر' },
  { value: 'BH', label: 'البحرين' },
  { value: 'OM', label: 'عُمان' },
  { value: 'EG', label: 'مصر' },
  { value: 'JO', label: 'الأردن' },
  { value: 'LB', label: 'لبنان' },
  { value: 'MA', label: 'المغرب' },
  { value: 'TN', label: 'تونس' },
];

function toFormValues(organization: Organization): OrganizationSettingsFormValues {
  return {
    logo: organization.logo ?? '',
    timezone: organization.timezone,
    country: organization.country,
  };
}

export function OrganizationSettingsForm() {
  const { data, isLoading, isError, error, refetch } = useOrganizationSettings();
  const updateSettings = useUpdateOrganizationSettings();

  const form = useForm<OrganizationSettingsFormValues>({
    resolver: zodResolver(organizationSettingsSchema),
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
          <Card>
            <CardHeader>
              <CardTitle>معلومات المنظمة</CardTitle>
              <CardDescription>بيانات عامة للمنظمة (للقراءة فقط)</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">الاسم</p>
                <p className="font-medium">{data.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">المعرّف</p>
                <p className="font-mono text-sm">{data.slug}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">الحالة</p>
                <StatusBadge status={data.status} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات المنظمة</CardTitle>
              <CardDescription>الشعار، المنطقة الزمنية، والدولة</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">رابط الشعار</Label>
                  <Input
                    id="logo"
                    placeholder="https://example.com/logo.png"
                    {...form.register('logo')}
                    aria-invalid={Boolean(form.formState.errors.logo)}
                  />
                  {form.formState.errors.logo && (
                    <p className="text-sm text-destructive">{form.formState.errors.logo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select
                    value={form.watch('timezone')}
                    onValueChange={(value) =>
                      form.setValue('timezone', value as string, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="timezone" className="w-full">
                      <SelectValue placeholder="اختر المنطقة الزمنية" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                  <Label htmlFor="country">الدولة</Label>
                  <Select
                    value={form.watch('country')}
                    onValueChange={(value) =>
                      form.setValue('country', value as string, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={updateSettings.isPending}>
                    {updateSettings.isPending && <Loader2Icon className="animate-spin" />}
                    حفظ التغييرات
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
