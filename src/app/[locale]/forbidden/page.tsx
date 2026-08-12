'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ShieldXIcon } from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

export default function ForbiddenPage() {
  const t = useTranslations('errors.forbidden');
  const tCommon = useTranslations('common');

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-24 start-1/3 size-72 rounded-full bg-primary/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 end-0 size-64 rounded-full bg-secondary/10 blur-[100px]"
      />

      <PageContainer
        size="sm"
        className="relative flex min-h-svh flex-col items-center justify-center gap-6 py-12 text-center"
      >
        <span className="flex size-16 animate-scale-in items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg glow-brand">
          <ShieldXIcon className="size-8" aria-hidden />
        </span>
        <div className="flex flex-col gap-2">
          <p className="text-gradient text-sm font-bold tracking-widest">{t('code')}</p>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-sm leading-7 text-muted-foreground">{t('description')}</p>
        </div>
        <Link href={ROUTES.home} className={cn(buttonVariants({ variant: 'gradient', size: 'lg' }))}>
          {tCommon('backToHome')}
        </Link>
      </PageContainer>
    </div>
  );
}
