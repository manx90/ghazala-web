'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLandingContent } from '../hooks/use-landing-content';
import { SectionHeading } from './section-heading';
import { StaggerGroup, StaggerItem } from './reveal';

export function FaqSection() {
  const { faq } = useLandingContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={faq.id} className="scroll-mt-24 bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />

        <StaggerGroup className="mt-12 space-y-3">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <StaggerItem key={item.question}>
                <div
                  className={cn(
                    'overflow-hidden rounded-2xl border bg-card transition-colors',
                    isOpen ? 'border-secondary/40 shadow-md' : 'border-border/60',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-semibold transition-colors hover:bg-accent/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:text-base"
                  >
                    {item.question}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                        isOpen
                          ? 'border-secondary bg-secondary text-secondary-foreground'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      <PlusIcon className="size-4" aria-hidden />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p className="border-t border-border/50 px-5 pt-4 pb-5 text-sm leading-8 text-muted-foreground">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
