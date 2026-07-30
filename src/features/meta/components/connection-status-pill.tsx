'use client';

import { cn } from '@/lib/utils';

interface ConnectionStatusPillProps {
  connected: boolean;
  connectedLabel?: string;
  disconnectedLabel?: string;
  className?: string;
}

export function ConnectionStatusPill({
  connected,
  connectedLabel = 'متصل',
  disconnectedLabel = 'غير متصل',
  className,
}: ConnectionStatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1',
        connected
          ? 'bg-success/10 text-success ring-success/20'
          : 'bg-muted text-muted-foreground ring-border',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          connected ? 'animate-glow-pulse bg-success' : 'bg-muted-foreground/50',
        )}
      />
      {connected ? connectedLabel : disconnectedLabel}
    </span>
  );
}
