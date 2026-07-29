'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
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
  const createOrganization = useCreateOrganization();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
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
    <PageContainer size="sm" className="py-12">
      <Card>
        <CardHeader>
          <CardTitle>إنشاء منظمة</CardTitle>
          <CardDescription>أنشئ منظمتك للبدء في استخدام غزالة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField id="name" label="اسم المنظمة" error={errors.name?.message}>
              <Input
                id="name"
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
            </FormField>

            <FormField id="slug" label="المعرف (Slug)" error={errors.slug?.message}>
              <Input
                id="slug"
                dir="ltr"
                className="text-left"
                aria-invalid={Boolean(errors.slug)}
                {...register('slug')}
              />
            </FormField>

            <FormField id="timezone" label="المنطقة الزمنية" error={errors.timezone?.message}>
              <Select
                value={timezone}
                onValueChange={(value) => setValue('timezone', value ?? '', { shouldValidate: true })}
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
            </FormField>

            <FormField id="country" label="الدولة" error={errors.country?.message}>
              <Select
                value={country}
                onValueChange={(value) => setValue('country', value ?? '', { shouldValidate: true })}
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
            </FormField>

            <Button type="submit" className="w-full" disabled={createOrganization.isPending}>
              {createOrganization.isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                'إنشاء المنظمة'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
