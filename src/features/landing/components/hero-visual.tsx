'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import {
  BarChart3Icon,
  BotIcon,
  CheckCheckIcon,
  RadioTowerIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

const CHAT_SCRIPT = [
  { from: 'customer', text: 'مرحباً، هل العرض ما زال متاحاً؟', time: '10:24' },
  { from: 'bot', text: 'أهلاً بك! نعم، العرض ساري حتى نهاية الأسبوع.', time: '10:24' },
  { from: 'customer', text: 'رائع! أريد إتمام الطلب من فضلك.', time: '10:25' },
  { from: 'agent', text: 'بكل سرور، سأجهز طلبك الآن.', time: '10:25' },
] as const;

const SENDER_LABEL = { customer: 'عميل', bot: 'المساعد الذكي', agent: 'فريق الدعم' } as const;

function FloatingCard({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        className="rounded-2xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(1);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setVisibleCount((count) => (count >= CHAT_SCRIPT.length + 1 ? 1 : count + 1));
    }, 2200);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const shownCount = reduceMotion ? CHAT_SCRIPT.length : visibleCount;

  return (
    <div
      className="relative mx-auto w-full max-w-lg"
      style={{ perspective: 1200 }}
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* توهج خلفي */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-secondary/20 to-success/20 blur-3xl"
      />

      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative rounded-3xl border border-border/60 bg-card/70 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
      >
        {/* ترويسة المحادثة */}
        <div className="flex items-center gap-3 border-b border-border/60 pb-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-primary-foreground">
            <BotIcon className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">قناة واتساب الرسمية</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              متصل الآن
            </p>
          </div>
          <CheckCheckIcon className="size-4 text-success" aria-label="رسائل مقروءة" />
        </div>

        {/* الرسائل */}
        <div className="mt-4 flex min-h-56 flex-col justify-end gap-2.5" aria-live="polite">
          {CHAT_SCRIPT.slice(0, shownCount).map((message, index) => {
            const incoming = message.from === 'customer';
            return (
              <motion.div
                key={`${index}-${message.text}`}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`flex ${incoming ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                    incoming
                      ? 'rounded-ss-sm bg-muted text-foreground'
                      : 'rounded-se-sm bg-gradient-to-br from-secondary/90 to-primary/90 text-primary-foreground'
                  }`}
                >
                  {!incoming ? (
                    <p className="mb-0.5 text-[0.65rem] font-medium opacity-80">
                      {SENDER_LABEL[message.from]}
                    </p>
                  ) : null}
                  <p>{message.text}</p>
                  <p className={`mt-1 flex items-center justify-end gap-1 text-[0.65rem] ${incoming ? 'text-muted-foreground' : 'opacity-80'}`}>
                    {message.time}
                    {!incoming ? <CheckCheckIcon className="size-3" /> : null}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* بطاقات عائمة */}
      <FloatingCard className="absolute -start-4 top-16 z-10 hidden sm:block md:-start-12" delay={0.4}>
        <div className="flex items-center gap-2.5 p-3.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-success/15 text-success">
            <RadioTowerIcon className="size-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">حملة البث</p>
            <p className="text-sm font-semibold">تم التسليم 98%</p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="absolute -end-4 bottom-20 z-10 hidden sm:block md:-end-12" delay={0.7}>
        <div className="flex items-center gap-2.5 p-3.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <BarChart3Icon className="size-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">معدل القراءة</p>
            <p className="flex items-center gap-1 text-sm font-semibold">
              +42%
              <TrendingUpIcon className="size-3.5 text-success" />
            </p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="absolute -top-6 end-8 z-10 hidden md:block" delay={1}>
        <div className="flex items-center gap-2 px-3.5 py-2.5">
          <BotIcon className="size-4 text-secondary" />
          <p className="text-xs font-medium">تم الرد تلقائياً خلال ثانيتين</p>
        </div>
      </FloatingCard>
    </div>
  );
}
