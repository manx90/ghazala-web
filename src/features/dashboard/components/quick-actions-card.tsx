'use client';

import { Link } from '@/i18n/navigation';
import {
  InboxIcon,
  ContactIcon,
  FileTextIcon,
  MessageSquareIcon,
  SettingsIcon,
  ZapIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

interface QuickActionsCardProps {
  orgSlug: string;
}

const ACTION_KEYS = [
  { key: 'inbox', href: (slug: string) => ROUTES.app.inbox(slug), icon: InboxIcon },
  { key: 'contacts', href: (slug: string) => ROUTES.app.contacts(slug), icon: ContactIcon },
  { key: 'templates', href: (slug: string) => ROUTES.app.templates(slug), icon: FileTextIcon },
  { key: 'messages', href: (slug: string) => ROUTES.app.messages(slug), icon: MessageSquareIcon },
  { key: 'whatsappSettings', href: (slug: string) => ROUTES.app.settings.whatsapp(slug), icon: SettingsIcon },
] as const;

export function QuickActionsCard({ orgSlug }: QuickActionsCardProps) {
  const t = useTranslations('dashboard.quickActions');

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
            <ZapIcon className="size-4" aria-hidden="true" />
          </span>
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {ACTION_KEYS.map(({ key, href, icon: Icon }) => (
            <Link
              key={key}
              href={href(orgSlug)}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-gradient-brand-soft p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-2xs ring-1 ring-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{t(key)}</span>
              <ArrowLeftIcon
                className="ms-auto size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
