import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageContainer } from '@/components/global/page-container';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

export default async function NotFoundPage() {
  const t = await getTranslations('errors.notFound');

  return (
    <PageContainer size="sm" className="flex min-h-svh flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
      </div>
      <Link href={ROUTES.home} className={cn(buttonVariants())}>
        {t('goHome')}
      </Link>
    </PageContainer>
  );
}
