import { FEATURES_GRID } from '../data/landing-content';
import { SectionHeading } from './section-heading';
import { StaggerGroup, StaggerItem } from './reveal';

export function FeaturesGrid() {
  return (
    <section id={FEATURES_GRID.id} className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={FEATURES_GRID.eyebrow}
          title={FEATURES_GRID.title}
          description={FEATURES_GRID.description}
        />

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES_GRID.items.map((feature) => (
            <StaggerItem key={feature.title}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl hover:shadow-secondary/10">
                <div
                  aria-hidden
                  className="absolute -top-16 -end-16 size-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 to-secondary/12 text-secondary transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="size-6" aria-hidden />
                </span>
                <h3 className="relative mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="relative mt-2 text-sm leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
