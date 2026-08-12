'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { MessageCircleIcon } from 'lucide-react';
import type { ReactNode } from 'react';
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
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-24 start-1/4 size-72 animate-pulse rounded-full bg-primary/15 blur-[110px]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 end-0 size-64 animate-pulse rounded-full bg-secondary/15 blur-[100px] [animation-delay:2s]"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex w-full max-w-md flex-col items-center"
      >
        <Link
          href={ROUTES.home}
          className="mb-8 flex items-center gap-3"
          aria-label={tNav('homeAria')}
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-md glow-brand">
            <MessageCircleIcon className="size-6" aria-hidden />
          </span>
          <span className="text-xl font-bold tracking-tight">{tCommon('appName')}</span>
        </Link>

        <Card className="glass-strong w-full rounded-2xl shadow-xl ring-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
            {description ? (
              <CardDescription className="mt-1.5">{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-5">{children}</CardContent>
        </Card>

        {footer ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        ) : null}
      </motion.div>
    </div>
  );
}
