'use client';

import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDownIcon,
  BotIcon,
  CheckCheckIcon,
  GitBranchIcon,
  RadioTowerIcon,
  UserIcon,
  WebhookIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

function VisualFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="relative" role="img" aria-label={label}>
      <div
        aria-hidden
        className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-secondary/12 to-success/10 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-xl backdrop-blur-xl sm:p-6">
        {children}
      </div>
    </div>
  );
}

const pop = (index: number) => ({
  initial: { opacity: 0, y: 14 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.45, delay: index * 0.12, ease: 'easeOut' as const },
});

function AutomationVisual() {
  const steps = [
    { icon: UserIcon, label: 'رسالة عميل جديدة', tone: 'bg-muted text-foreground' },
    { icon: GitBranchIcon, label: 'تحليل النية واللغة', tone: 'bg-secondary/15 text-secondary' },
    { icon: BotIcon, label: 'رد ذكي خلال ثانيتين', tone: 'bg-primary/15 text-primary' },
  ];

  return (
    <VisualFrame label="مخطط تدفق الأتمتة الذكية">
      <div className="flex flex-col items-stretch gap-1.5">
        {steps.map((step, index) => (
          <div key={step.label}>
            <motion.div
              {...pop(index)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${step.tone}`}
            >
              <step.icon className="size-4 shrink-0" aria-hidden />
              {step.label}
              {index === 2 ? (
                <span className="ms-auto rounded-full bg-success/15 px-2 py-0.5 text-[0.65rem] font-semibold text-success">
                  تلقائي
                </span>
              ) : null}
            </motion.div>
            {index < steps.length - 1 ? (
              <motion.div {...pop(index + 0.5)} className="flex justify-center py-0.5">
                <ArrowDownIcon className="size-4 text-muted-foreground/60" aria-hidden />
              </motion.div>
            ) : null}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function InboxVisual() {
  const conversations = [
    { name: 'سارة العتيبي', preview: 'شكراً، وصلني الطلب اليوم', agent: 'نورة', unread: 0 },
    { name: 'محمد الحربي', preview: 'أحتاج تحديثاً بخصوص الشحنة', agent: 'خالد', unread: 2 },
    { name: 'شركة الوفاء', preview: 'متى يتجدد الاشتراك؟', agent: 'ريم', unread: 1 },
  ];

  return (
    <VisualFrame label="قائمة صندوق الوارد المشترك">
      <ul className="flex flex-col gap-2.5">
        {conversations.map((conversation, index) => (
          <motion.li
            key={conversation.name}
            {...pop(index)}
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary">
              {conversation.name.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{conversation.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{conversation.preview}</span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="rounded-full bg-secondary/12 px-2 py-0.5 text-[0.65rem] font-medium text-secondary">
                {conversation.agent}
              </span>
              {conversation.unread > 0 ? (
                <span className="flex size-4.5 items-center justify-center rounded-full bg-success px-1 text-[0.6rem] font-bold text-white">
                  {conversation.unread}
                </span>
              ) : (
                <CheckCheckIcon className="size-3.5 text-success" aria-hidden />
              )}
            </span>
          </motion.li>
        ))}
      </ul>
    </VisualFrame>
  );
}

function BroadcastVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <VisualFrame label="بطاقة أداء حملة بث">
      <div className="rounded-xl border border-border/50 bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <RadioTowerIcon className="size-4 text-secondary" aria-hidden />
            حملة عروض نهاية الأسبوع
          </p>
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-[0.65rem] font-semibold text-success">
            جارية الآن
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {[
            { label: 'تم الإرسال', value: 100, count: '12,400' },
            { label: 'تم التسليم', value: 98, count: '12,152' },
            { label: 'تمت القراءة', value: 86, count: '10,664' },
          ].map((row, index) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{row.label}</span>
                <span className="font-semibold text-foreground">{row.count}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${row.value}%` }}
                  viewport={{ once: true }}
                  transition={
                    reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.15 * index, ease: 'easeOut' }
                  }
                  className="h-full rounded-full bg-gradient-brand"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function ApiVisual() {
  const lines = [
    { tokens: [{ text: 'POST', tone: 'text-success font-bold' }, { text: ' /v1/messages', tone: 'text-foreground' }] },
    { tokens: [{ text: '{', tone: 'text-muted-foreground' }] },
    {
      tokens: [
        { text: '  "to"', tone: 'text-secondary' },
        { text: ': ', tone: 'text-muted-foreground' },
        { text: '"9665xxxxxxxx"', tone: 'text-warning' },
        { text: ',', tone: 'text-muted-foreground' },
      ],
    },
    {
      tokens: [
        { text: '  "template"', tone: 'text-secondary' },
        { text: ': ', tone: 'text-muted-foreground' },
        { text: '"order_confirmation"', tone: 'text-warning' },
        { text: ',', tone: 'text-muted-foreground' },
      ],
    },
    {
      tokens: [
        { text: '  "status"', tone: 'text-secondary' },
        { text: ': ', tone: 'text-muted-foreground' },
        { text: '"delivered"', tone: 'text-success' },
      ],
    },
    { tokens: [{ text: '}', tone: 'text-muted-foreground' }] },
  ];

  return (
    <VisualFrame label="مثال برمجي على واجهة API">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <WebhookIcon className="size-4 text-secondary" aria-hidden />
          إرسال رسالة قالب
        </span>
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
        </span>
      </div>
      <pre dir="ltr" className="mt-4 overflow-x-auto text-left font-mono text-xs leading-6 sm:text-sm">
        {lines.map((line, index) => (
          <motion.code key={index} {...pop(index)} className="block">
            {line.tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={token.tone}>
                {token.text}
              </span>
            ))}
          </motion.code>
        ))}
      </pre>
    </VisualFrame>
  );
}

function AnalyticsVisual() {
  const weeks = [45, 60, 52, 78, 65, 88, 95];

  return (
    <VisualFrame label="مخطط تحليلات الأداء">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <p className="text-[0.65rem] text-muted-foreground">زمن الرد الأول</p>
          <p className="mt-1 text-lg font-bold text-success">-38%</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <p className="text-[0.65rem] text-muted-foreground">محادثات محلولة</p>
          <p className="mt-1 text-lg font-bold">4,820</p>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-border/50 bg-background/60 p-4">
        <div className="flex h-24 items-end gap-2">
          {weeks.map((height, index) => (
            <motion.span
              key={index}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
              style={{ height: `${height}%` }}
              className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-primary/80 to-success/70"
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">رضا العملاء أسبوعياً</p>
      </div>
    </VisualFrame>
  );
}

export const SPLIT_VISUALS = {
  automation: AutomationVisual,
  inbox: InboxVisual,
  broadcast: BroadcastVisual,
  api: ApiVisual,
  analytics: AnalyticsVisual,
} as const;
