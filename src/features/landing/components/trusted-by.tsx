'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLandingContent } from '../hooks/use-landing-content';
import { Reveal } from './reveal';

export function TrustedBy() {
  const reduceMotion = useReducedMotion();
  const { trustedBy } = useLandingContent();
  const loop = [...trustedBy.items, ...trustedBy.items];

  return (
    <section aria-label={trustedBy.title} className="border-y border-border/60 bg-muted/40 py-10">
      <Reveal>
        <p className="text-center text-sm font-medium text-muted-foreground">{trustedBy.title}</p>
      </Reveal>

      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_15%,black_85%,transparent)]">
        <motion.ul
          className="flex w-max items-center gap-14 pe-14"
          animate={reduceMotion ? undefined : { x: ['0%', '50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {loop.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="whitespace-nowrap text-lg font-semibold text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {name}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
