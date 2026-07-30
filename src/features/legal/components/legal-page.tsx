'use client';

import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ArrowRightIcon, CalendarDaysIcon, ListIcon, MessageCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeSwitcher } from '@/components/layout/header/theme-switcher';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import type { LegalDocument } from '../data/legal-content';

function LegalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2 text-base font-bold"
          aria-label="غزالة - الصفحة الرئيسية"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <MessageCircleIcon className="size-4" aria-hidden />
          </span>
          غزالة
        </Link>
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <Button variant="ghost" size="sm" render={<Link href={ROUTES.home} />}>
            <ArrowRightIcon data-icon="inline-start" aria-hidden />
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </header>
  );
}

export function LegalPage({ document }: { document: LegalDocument }) {
  const [activeId, setActiveId] = useState(document.sections[0]?.id ?? '');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.sections.forEach((section) => {
      const el = window.document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [document.sections]);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <LegalHeader />

      {/* ترويسة الصفحة */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_left,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 [mask-image:radial-gradient(ellipse_60%_100%_at_50%_0%,black,transparent)]"
        />
        <div aria-hidden className="absolute -top-24 start-1/3 size-72 rounded-full bg-primary/15 blur-[110px]" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{document.title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{document.subtitle}</p>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDaysIcon className="size-3.5" aria-hidden />
            آخر تحديث: {document.lastUpdated}
          </p>
        </motion.div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 py-12 sm:px-6">
        {/* فهرس المحتويات */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav
            aria-label="فهرس المحتويات"
            className="sticky top-24 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md"
          >
            <p className="flex items-center gap-2 px-2 pb-3 text-xs font-semibold text-muted-foreground">
              <ListIcon className="size-3.5" aria-hidden />
              محتويات الصفحة
            </p>
            <ul className="space-y-0.5">
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={activeId === section.id ? 'true' : undefined}
                    className={cn(
                      'block rounded-lg border-s-2 px-3 py-2 text-xs leading-5 transition-colors',
                      activeId === section.id
                        ? 'border-secondary bg-secondary/10 font-semibold text-primary'
                        : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* المحتوى */}
        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="min-w-0 max-w-3xl flex-1"
        >
          <p className="rounded-2xl border border-secondary/25 bg-secondary/5 p-5 text-sm leading-8 text-foreground/90">
            {document.intro}
          </p>

          {document.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28 pt-10">
              <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
                <span className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-secondary" aria-hidden />
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs?.map((paragraph, index) => (
                  <p key={index} className="leading-8 text-foreground/80 text-pretty">
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="space-y-3 pe-1">
                    {section.list.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 leading-8 text-foreground/80">
                        <span
                          aria-hidden
                          className="mt-3 size-1.5 shrink-0 rounded-full bg-secondary"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </motion.article>
      </div>

      <footer className="border-t border-border/60 py-6">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} غزالة. جميع الحقوق محفوظة. —{' '}
          <Link href="/terms" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
            شروط الخدمة
          </Link>{' '}
          ·{' '}
          <Link href="/privacy" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
            سياسة الخصوصية
          </Link>
        </p>
      </footer>
    </div>
  );
}
