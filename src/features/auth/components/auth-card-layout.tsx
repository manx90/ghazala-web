'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageContainer } from '@/components/global/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

interface AuthCardLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCardLayout({ title, description, children, footer }: AuthCardLayoutProps) {
  return (
    <PageContainer
      size="sm"
      className="flex min-h-svh flex-col items-center justify-center py-12"
    >
      <Link
        href={ROUTES.home}
        className="mb-8 text-lg font-semibold tracking-tight text-foreground"
      >
        غزالة
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>

      {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
    </PageContainer>
  );
}
