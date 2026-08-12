'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LayoutDashboardIcon, MenuIcon, MessageCircleIcon, ShieldIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/layout/header/theme-switcher';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ROUTES } from '@/config/routes';
import { useLandingAuth } from '@/features/landing/hooks/use-landing-auth';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import { cn } from '@/lib/utils';

function AuthActions({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const t = useTranslations('auth');
  const tNav = useTranslations('nav');
  const { isAuthenticated, isSessionLoading, isSuperAdmin, workspaceHref, adminHref, loginHref, registerHref } =
    useLandingAuth();

  if (isSessionLoading) {
    return mobile ? null : <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />;
  }

  if (isAuthenticated) {
    return (
      <>
        {isSuperAdmin ? (
          <>
            <Button
              variant={mobile ? 'outline' : 'ghost'}
              className={mobile ? 'w-full' : undefined}
              render={<Link href={adminHref} onClick={onNavigate} />}
            >
              <ShieldIcon data-icon="inline-start" />
              {tNav('adminPanel')}
            </Button>
            <Button
              variant="gradient"
              className={mobile ? 'w-full' : undefined}
              render={<Link href={workspaceHref} onClick={onNavigate} />}
            >
              <LayoutDashboardIcon data-icon="inline-start" />
              {tNav('clientPortal')}
            </Button>
          </>
        ) : (
          <Button
            variant="gradient"
            className={mobile ? 'w-full' : undefined}
            render={<Link href={workspaceHref} onClick={onNavigate} />}
          >
            <LayoutDashboardIcon data-icon="inline-start" />
            {tNav('dashboard')}
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant={mobile ? 'outline' : 'ghost'}
        className={mobile ? 'w-full' : undefined}
        render={<Link href={loginHref} onClick={onNavigate} />}
      >
        {t('login')}
      </Button>
      <Button
        variant="gradient"
        className={mobile ? 'w-full' : undefined}
        render={<Link href={registerHref} onClick={onNavigate} />}
      >
        {t('startFree')}
      </Button>
    </>
  );
}

export function LandingNav() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const { navLinks } = useLandingContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6',
          scrolled ? 'py-3' : 'py-5',
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute inset-0 border-b transition-all duration-500',
            scrolled
              ? 'border-border/60 bg-background/70 backdrop-blur-xl'
              : 'border-transparent bg-transparent',
          )}
          aria-hidden
        />

        <Link
          href={ROUTES.home}
          className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-tight"
          aria-label={tNav('homeAria')}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-md">
            <MessageCircleIcon className="size-5" />
          </span>
          {t('appName')}
        </Link>

        <nav aria-label={tNav('mainNav')} className="relative z-10 hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <AuthActions />
        </div>

        <div className="relative z-10 flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? tNav('closeMenu') : tNav('openMenu')}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            aria-label={tNav('mobileNav')}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mx-4 overflow-hidden rounded-2xl border border-border/60 bg-background/90 shadow-lg backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-4">
                <AuthActions mobile onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
