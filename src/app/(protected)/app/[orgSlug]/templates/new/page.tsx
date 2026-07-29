'use client';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplateForm } from '@/features/templates/components/template-form';
import { useCreateTemplate } from '@/features/templates/hooks/use-templates';
import type { CreateTemplatePayload } from '@/types/template.types';

export default function NewTemplatePage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const router = useRouter();
  const createMutation = useCreateTemplate();

  const handleCreate = (payload: CreateTemplatePayload) => {
    createMutation.mutate(payload, {
      onSuccess: (template) => router.push(`/app/${orgSlug}/templates/${template.id}`),
    });
  };

  return (
    <PermissionGuard permission="templates.manage">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="قالب جديد"
          description="إنشاء قالب رسالة WhatsApp جديد"
          actions={
            <Button variant="outline" render={<Link href={`/app/${orgSlug}/templates`} />}>
              <ArrowRightIcon data-icon="inline-start" />
              العودة للقائمة
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>بيانات القالب</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateForm
              onSubmit={handleCreate}
              isLoading={createMutation.isPending}
              onCancel={() => router.push(`/app/${orgSlug}/templates`)}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
