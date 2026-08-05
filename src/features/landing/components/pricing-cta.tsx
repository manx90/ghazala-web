'use client';

import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon } from 'lucide-react';
import { PRICING_CTA } from '../data/landing-content';
import { useLandingAuth } from '../hooks/use-landing-auth';
import { Reveal } from './reveal';

export function PricingCta() {
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, isSuperAdmin, workspaceHref, adminHref } = useLandingAuth();

  const primaryCta = isAuthenticated
    ? isSuperAdmin
      ? { label: 'لوحة الإدارة', href: adminHref }
      : { label: 'الذهاب للمنصة', href: workspaceHref }
    : PRICING_CTA.primaryCta;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-16 text-center text-primary-foreground shadow-2xl sm:px-12">
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_left,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]"
            />
            <motion.div
              aria-hidden
              animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-24 start-1/3 size-72 rounded-full bg-white/15 blur-[100px]"
            />

            <p className="relative text-sm font-semibold text-white/80">{PRICING_CTA.eyebrow}</p>
            <h2 className="relative mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {PRICING_CTA.title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl leading-8 text-white/80 text-pretty">
              {PRICING_CTA.description}
            </p>

            <motion.div
              className="relative mt-8"
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href={primaryCta.href}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-bold text-primary shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {primaryCta.label}
                <ArrowLeftIcon className="size-4" aria-hidden />
              </Link>
            </motion.div>

            <ul className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/75">
              {PRICING_CTA.points.map((point) => (
                <li key={point} className="flex items-center gap-1.5">
                  <CheckIcon className="size-4" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
