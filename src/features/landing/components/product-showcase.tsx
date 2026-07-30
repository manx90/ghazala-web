'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
  BarChart3Icon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  RadioTowerIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { useRef } from 'react';
import { Reveal } from './reveal';

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboardIcon, label: 'لوحة التحكم', active: true },
  { icon: InboxIcon, label: 'صندوق الوارد', active: false },
  { icon: UsersIcon, label: 'جهات الاتصال', active: false },
  { icon: RadioTowerIcon, label: 'الحملات', active: false },
  { icon: MessageSquareTextIcon, label: 'القوالب', active: false },
  { icon: SettingsIcon, label: 'الإعدادات', active: false },
] as const;

const CHART_BARS = [38, 52, 44, 66, 58, 74, 62, 84, 70, 92, 80, 96] as const;

export function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [48, -48]);

  return (
    <section id="product" className="scroll-mt-24 overflow-hidden py-20 sm:py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-secondary">جولة في المنتج</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              واجهة صُممت لتعمل بسرعة فريقك
            </h2>
            <p className="mt-4 leading-8 text-muted-foreground text-pretty">
              كل شيء حيث تتوقعه: محادثاتك، حملاتك، وأداؤك، في لوحة واحدة سريعة وأنيقة.
            </p>
          </div>
        </Reveal>

        <motion.div style={{ y }} className="relative mx-auto mt-16 max-w-5xl">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/25 via-secondary/15 to-success/10 blur-3xl"
          />

          <Reveal className="relative">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
              {/* شريط المتصفح */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-3">
                <span className="size-3 rounded-full bg-destructive/70" />
                <span className="size-3 rounded-full bg-warning/70" />
                <span className="size-3 rounded-full bg-success/70" />
                <span className="ms-3 flex-1 rounded-md bg-background/70 px-3 py-1 text-[0.7rem] text-muted-foreground">
                  app.ghazala.io/dashboard
                </span>
              </div>

              <div className="flex">
                {/* الشريط الجانبي */}
                <div className="hidden w-44 shrink-0 flex-col gap-1 border-e border-border/60 bg-muted/30 p-3 sm:flex">
                  {SIDEBAR_ITEMS.map((item) => (
                    <span
                      key={item.label}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                        item.active
                          ? 'bg-gradient-brand-soft font-semibold text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <item.icon className="size-3.5" aria-hidden />
                      {item.label}
                    </span>
                  ))}
                </div>

                {/* المحتوى */}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'محادثات اليوم', value: '1,284' },
                      { label: 'متوسط زمن الرد', value: '42 ث' },
                      { label: 'رضا العملاء', value: '96%' },
                    ].map((kpi) => (
                      <div key={kpi.label} className="rounded-xl border border-border/60 bg-background/60 p-3">
                        <p className="text-[0.65rem] text-muted-foreground sm:text-xs">{kpi.label}</p>
                        <p className="mt-1 text-sm font-bold sm:text-xl">{kpi.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-border/60 bg-background/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2 text-xs font-semibold">
                        <BarChart3Icon className="size-3.5 text-secondary" aria-hidden />
                        الرسائل عبر آخر 12 أسبوعاً
                      </p>
                      <span className="text-[0.65rem] text-success">+24% نمو</span>
                    </div>
                    <div className="mt-4 flex h-24 items-end gap-1.5 sm:h-32">
                      {CHART_BARS.map((height, index) => (
                        <motion.span
                          key={index}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
                          style={{ height: `${height}%` }}
                          className="flex-1 origin-bottom rounded-t-sm bg-gradient-to-t from-primary/70 to-secondary/70"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
