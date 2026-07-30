import { Reveal } from './reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <p className="text-sm font-semibold text-secondary">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p className="mt-4 leading-8 text-muted-foreground text-pretty">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
