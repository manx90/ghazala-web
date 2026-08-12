'use client';

import { Link } from '@/i18n/navigation';
import { MessageCircleIcon } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useLandingContent } from '../hooks/use-landing-content';

export function LandingFooter() {
  const { footer } = useLandingContent();

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href={ROUTES.home} className="flex items-center gap-2 text-lg font-bold">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                <MessageCircleIcon className="size-5" aria-hidden />
              </span>
              {footer.brandName}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
              {footer.description}
            </p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
}
