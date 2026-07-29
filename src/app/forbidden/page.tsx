import Link from 'next/link';
import { PageContainer } from '@/components/global/page-container';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

export default function ForbiddenPage() {
  return (
    <PageContainer size="sm" className="flex min-h-svh flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">403</p>
        <h1 className="text-2xl font-semibold tracking-tight">غير مصرح</h1>
        <p className="text-sm text-muted-foreground">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
      </div>
      <Link href={ROUTES.home} className={cn(buttonVariants({ variant: 'outline' }))}>
        العودة للرئيسية
      </Link>
    </PageContainer>
  );
}
