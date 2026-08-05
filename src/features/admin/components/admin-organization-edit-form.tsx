'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateOrganization } from '@/features/admin/hooks/use-admin-organizations';
import type { Organization } from '@/types/organization.types';

interface AdminOrganizationEditFormProps {
  organization: Organization;
}

export function AdminOrganizationEditForm({ organization }: AdminOrganizationEditFormProps) {
  const updateMutation = useUpdateOrganization();
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [timezone, setTimezone] = useState(organization.timezone);
  const [country, setCountry] = useState(organization.country);
  const [logo, setLogo] = useState(organization.logo ?? '');

  useEffect(() => {
    setName(organization.name);
    setSlug(organization.slug);
    setTimezone(organization.timezone);
    setCountry(organization.country);
    setLogo(organization.logo ?? '');
  }, [organization]);

  const hasChanges =
    name !== organization.name ||
    slug !== organization.slug ||
    timezone !== organization.timezone ||
    country !== organization.country ||
    (logo || null) !== organization.logo;

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">تعديل المنظمة</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="org-name">الاسم</Label>
          <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="org-slug">المعرّف (slug)</Label>
          <Input id="org-slug" value={slug} dir="ltr" onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="org-timezone">المنطقة الزمنية</Label>
          <Input id="org-timezone" value={timezone} dir="ltr" onChange={(e) => setTimezone(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="org-country">البلد</Label>
          <Input id="org-country" value={country} dir="ltr" onChange={(e) => setCountry(e.target.value.toUpperCase())} />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="org-logo">رابط الشعار</Label>
          <Input id="org-logo" value={logo} dir="ltr" onChange={(e) => setLogo(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Button
            disabled={!hasChanges || updateMutation.isPending}
            onClick={() =>
              updateMutation.mutate({
                id: organization.id,
                payload: {
                  name: name.trim(),
                  slug: slug.trim(),
                  timezone: timezone.trim(),
                  country: country.trim(),
                  logo: logo.trim() || null,
                },
              })
            }
          >
            حفظ التعديلات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
