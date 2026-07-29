'use client';

import Link from 'next/link';
import {
  InboxIcon,
  ContactIcon,
  FileTextIcon,
  MessageSquareIcon,
  SettingsIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

interface QuickActionsCardProps {
  orgSlug: string;
}

const actions = [
  { href: (slug: string) => ROUTES.app.inbox(slug), label: 'صندوق الوارد', icon: InboxIcon },
  { href: (slug: string) => ROUTES.app.contacts(slug), label: 'جهات الاتصال', icon: ContactIcon },
  { href: (slug: string) => ROUTES.app.templates(slug), label: 'القوالب', icon: FileTextIcon },
  { href: (slug: string) => ROUTES.app.messages(slug), label: 'الرسائل', icon: MessageSquareIcon },
  { href: (slug: string) => ROUTES.app.settings.whatsapp(slug), label: 'إعدادات واتساب', icon: SettingsIcon },
] as const;

export function QuickActionsCard({ orgSlug }: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إجراءات سريعة</CardTitle>
        <CardDescription>انتقل مباشرة إلى الأقسام الرئيسية</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2">
          {actions.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href(orgSlug)}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-auto justify-start gap-2 py-2.5',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
