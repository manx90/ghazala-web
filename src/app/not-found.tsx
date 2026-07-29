import Link from 'next/link';
import { PageContainer } from '@/components/global/page-container';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

export default function NotFoundPage() {
  return (
    <PageContainer size="sm" className="flex min-h-svh flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">الصفحة غير موجودة</h1>
        <p className="text-sm text-muted-foreground">الصفحة التي تبحث عنها غير متوفرة.</p>
      </div>
      <Link href={ROUTES.home} className={cn(buttonVariants())}>
        العودة للرئيسية
      </Link>
    </PageContainer>
  );
}
