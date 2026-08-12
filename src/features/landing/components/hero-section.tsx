'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Link } from '@/i18n/navigation';
import { ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useLandingAuth } from '../hooks/use-landing-auth';
import { useLandingContent } from '../hooks/use-landing-content';
import { HeroVisual } from './hero-visual';

function AnimatedBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_left,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-32 start-1/4 size-[32rem] animate-pulse rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute top-24 -end-24 size-[26rem] animate-pulse rounded-full bg-secondary/25 blur-[110px] [animation-delay:1.5s]" />
      <div className="absolute bottom-0 start-0 size-[22rem] animate-pulse rounded-full bg-success/15 blur-[100px] [animation-delay:3s]" />
    </div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const locale = useLocale();
  const tNav = useTranslations('nav');
  const { hero, securityBadges } = useLandingContent();
  const { isAuthenticated, isSuperAdmin, workspaceHref, adminHref } = useLandingAuth();

  const primaryCta = isAuthenticated
    ? isSuperAdmin
      ? { label: tNav('adminPanel'), href: adminHref }
      : { label: tNav('dashboard'), href: workspaceHref }
    : hero.primaryCta;

  const CtaArrow = locale === 'ar' ? ArrowLeftIcon : ArrowRightIcon;

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: 'easeOut' as const },
        };

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 lg:pb-28">
      <AnimatedBackground />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="text-center lg:text-start">
          <motion.div {...fadeUp(0)}>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <SparklesIcon className="size-3.5 text-secondary" />
              {hero.badge}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-6 text-4xl leading-[1.2] font-bold tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            {hero.titleBefore}
            <span className="text-gradient">{hero.titleHighlight}</span>
            {hero.titleAfter}
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0"
          >
            {hero.description}
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
            <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={primaryCta.href}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-brand px-7 text-sm font-semibold text-primary-foreground shadow-lg glow-brand transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {primaryCta.label}
                <CtaArrow className="size-4" aria-hidden />
              </Link>
            </motion.div>
            <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={hero.secondaryCta.href}
                className="glass inline-flex h-12 items-center rounded-xl px-7 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {hero.secondaryCta.label}
              </Link>
            </motion.div>
          </motion.div>

          <motion.dl {...fadeUp(0.45)} className="mt-12 grid grid-cols-3 gap-4 border-t border-border/60 pt-8">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="order-2 mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
                <dd className="text-gradient text-2xl font-bold sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
        >
          <HeroVisual />
        </motion.div>
      </div>

      <div className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {securityBadges.map((badge) => (
            <li key={badge.label} className="flex items-center gap-2">
              <badge.icon className="size-4 text-secondary" aria-hidden />
              {badge.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
