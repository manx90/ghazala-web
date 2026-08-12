'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { BarChart3Icon } from 'lucide-react';
import { useRef } from 'react';
import { CHART_BARS } from '../data/landing-content';
import { useLandingContent } from '../hooks/use-landing-content';
import { Reveal } from './reveal';

export function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { productShowcase } = useLandingContent();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [48, -48]);

  return (
    <section id="product" className="scroll-mt-24 overflow-hidden py-20 sm:py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-secondary">{productShowcase.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {productShowcase.title}
            </h2>
            <p className="mt-4 leading-8 text-muted-foreground text-pretty">
              {productShowcase.description}
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
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-3">
                <span className="size-3 rounded-full bg-destructive/70" />
                <span className="size-3 rounded-full bg-warning/70" />
                <span className="size-3 rounded-full bg-success/70" />
                <span className="ms-3 flex-1 rounded-md bg-background/70 px-3 py-1 text-[0.7rem] text-muted-foreground">
                  app.ghazala.io/dashboard
                </span>
              </div>

              <div className="flex">
                <div className="hidden w-44 shrink-0 flex-col gap-1 border-e border-border/60 bg-muted/30 p-3 sm:flex">
                  {productShowcase.sidebar.map((item) => (
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

                <div className="flex-1 p-4 sm:p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {productShowcase.kpis.map((kpi) => (
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
                        {productShowcase.chartTitle}
                      </p>
                      <span className="text-[0.65rem] text-success">{productShowcase.chartGrowth}</span>
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
