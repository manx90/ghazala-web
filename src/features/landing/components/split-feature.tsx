'use client';

import { CheckCircle2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SPLIT_SECTIONS } from '../data/landing-content';
import { Reveal } from './reveal';
import { SPLIT_VISUALS } from './split-visuals';

type SplitSectionData = (typeof SPLIT_SECTIONS)[number];

export function SplitFeatures() {
  return (
    <div className="flex flex-col gap-20 py-20 sm:gap-28 sm:py-28">
      {SPLIT_SECTIONS.map((section, index) => (
        <SplitFeatureSection key={section.id} section={section} reversed={index % 2 === 1} />
      ))}
    </div>
  );
}

function SplitFeatureSection({
  section,
  reversed,
}: {
  section: SplitSectionData;
  reversed: boolean;
}) {
  const Visual = SPLIT_VISUALS[section.visual];

  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className={cn(reversed && 'lg:order-2')}>
          <Reveal>
            <p className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <section.icon className="size-4" aria-hidden />
              {section.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {section.title}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 leading-8 text-muted-foreground text-pretty">{section.description}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-8 space-y-4">
              {section.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-7">
                  <CheckCircle2Icon className="mt-1.5 size-4 shrink-0 text-success" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className={cn(reversed && 'lg:order-1')}>
          <Visual />
        </Reveal>
      </div>
    </section>
  );
}
