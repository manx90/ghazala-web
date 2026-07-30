'use client';

import { motion, useReducedMotion } from 'motion/react';
import { BotIcon, CheckCheckIcon, MessageCircleIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ROUTES } from '@/config/routes';

const PANEL_POINTS = [
  { icon: ZapIcon, label: 'ردود آلية خلال ثوانٍ' },
  { icon: ShieldCheckIcon, label: 'واجهة رسمية معتمدة من ميتا' },
  { icon: CheckCheckIcon, label: 'معدلات تسليم تتجاوز 98%' },
] as const;

function VisualPanel() {
  const reduceMotion = useReducedMotion();

  const float = (delay: number) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -12, 0] },
          transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay },
        };

  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary lg:flex lg:w-[52%] lg:flex-col lg:justify-between lg:p-12">
      {/* شبكة وتوهجات */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_left,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black,transparent)]"
      />
      <motion.div
        aria-hidden
        animate={reduceMotion ? undefined : { scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -end-20 size-80 rounded-full bg-white/15 blur-[100px]"
      />
      <motion.div
        aria-hidden
        animate={reduceMotion ? undefined : { scale: [1.15, 1, 1.15], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 -start-24 size-72 rounded-full bg-success/20 blur-[90px]"
      />

      <Link
        href={ROUTES.home}
        className="relative flex items-center gap-2 text-lg font-bold text-white"
        aria-label="غزالة - الصفحة الرئيسية"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
          <MessageCircleIcon className="size-5" aria-hidden />
        </span>
        غزالة
      </Link>

      {/* بطاقات عائمة */}
      <div className="relative mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <motion.div {...float(0)} className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <BotIcon className="size-5 text-white" aria-hidden />
            </span>
            <div className="rounded-2xl rounded-ss-sm bg-white/15 px-4 py-3 text-sm leading-7 text-white">
              مرحباً بعودتك! فريقك أنجز اليوم 1,284 محادثة بمتوسط رد 42 ثانية.
            </div>
          </motion.div>
          <motion.div {...float(1.2)} className="mt-4 flex justify-end">
            <div className="rounded-2xl rounded-se-sm bg-white px-4 py-3 text-sm font-medium leading-7 text-primary shadow-lg">
              أداء رائع، لنكمل من حيث توقفنا.
              <span className="mt-1 flex items-center justify-end gap-1 text-[0.65rem] text-muted-foreground">
                10:26
                <CheckCheckIcon className="size-3 text-success" aria-hidden />
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-lg leading-9 font-medium text-white/90">
            «قلّصنا زمن الاستجابة لعملائنا من ساعات إلى ثوانٍ خلال الأسبوع الأول.»
          </p>
          <footer className="mt-3 text-sm text-white/60">فريق تجربة العملاء — شركة الأفق للتجارة</footer>
        </motion.blockquote>
      </div>

      <ul className="relative flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/75">
        {PANEL_POINTS.map((point) => (
          <li key={point.label} className="flex items-center gap-2">
            <point.icon className="size-4" aria-hidden />
            {point.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LoginShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <VisualPanel />
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
        {/* خلفية جانب النموذج */}
        <div aria-hidden className="absolute inset-0 lg:hidden">
          <div className="absolute -top-24 start-1/4 size-72 animate-pulse rounded-full bg-primary/15 blur-[100px]" />
          <div className="absolute bottom-0 end-0 size-64 animate-pulse rounded-full bg-secondary/15 blur-[90px] [animation-delay:2s]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
