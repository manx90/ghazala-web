'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { MenuIcon, MessageCircleIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/layout/header/theme-switcher';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import { LANDING_NAV_LINKS } from '../data/landing-content';

export function LandingNav() {
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
          scrolled ? 'py-3' : 'py-5'
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute inset-0 border-b transition-all duration-500',
            scrolled
              ? 'border-border/60 bg-background/70 backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          )}
          aria-hidden
        />

        <Link
          href={ROUTES.home}
          className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-tight"
          aria-label="غزالة - الصفحة الرئيسية"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
            <MessageCircleIcon className="size-5" />
          </span>
          غزالة
        </Link>

        <nav aria-label="التنقل الرئيسي" className="relative z-10 hidden items-center gap-1 lg:flex">
          {LANDING_NAV_LINKS.map((link) => (
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
          <ThemeSwitcher />
          <Button variant="ghost" render={<Link href={ROUTES.auth.login} />}>
            تسجيل الدخول
          </Button>
          <Button render={<Link href={ROUTES.auth.register} />} className="shadow-md">
            ابدأ مجاناً
          </Button>
        </div>

        <div className="relative z-10 flex items-center gap-1 lg:hidden">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
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
            aria-label="قائمة الجوال"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mx-4 overflow-hidden rounded-2xl border border-border/60 bg-background/90 shadow-lg backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {LANDING_NAV_LINKS.map((link) => (
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
                <Button variant="outline" render={<Link href={ROUTES.auth.login} />}>
                  تسجيل الدخول
                </Button>
                <Button render={<Link href={ROUTES.auth.register} />}>ابدأ مجاناً</Button>
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
